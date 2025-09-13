import { useStore } from '@nanostores/react';
import type { Message } from 'ai';
import { useChat } from 'ai/react';
import { memo, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useMessageParser, usePromptEnhancer } from '~/lib/hooks';
import { useChatHistory } from '~/lib/persistence';
import { chatStore } from '~/lib/stores/chat';
import { workbenchStore } from '~/lib/stores/workbench';
import { fileModificationsToHTML } from '~/utils/diff';
import { createScopedLogger } from '~/utils/logger';
import { MobileChatMessages } from './MobileChatMessages';
import { MobileChatInput } from './MobileChatInput';

const logger = createScopedLogger('MobileChat');

export const MobileChat = memo(() => {
  const { ready, initialMessages, storeMessageHistory } = useChatHistory();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (ready) {
      const timer = setTimeout(() => setIsReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, [ready]);

  if (!ready || !isReady) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  return <MobileChatImpl initialMessages={initialMessages} storeMessageHistory={storeMessageHistory} />;
});

interface MobileChatImplProps {
  initialMessages: Message[];
  storeMessageHistory: (messages: Message[]) => Promise<void>;
}

const MobileChatImpl = memo(({ initialMessages, storeMessageHistory }: MobileChatImplProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [chatStarted, setChatStarted] = useState(initialMessages.length > 0);
  const { showChat } = useStore(chatStore);

  const { messages, isLoading, input, handleInputChange, setInput, stop, append } = useChat({
    api: '/api/chat',
    onError: (error) => {
      logger.error('Request failed\n\n', error);
      toast.error('There was an error processing your request');
    },
    onFinish: () => {
      logger.debug('Finished streaming');
    },
    initialMessages,
  });

  const { enhancingPrompt, promptEnhanced, enhancePrompt, resetEnhancer } = usePromptEnhancer();
  const { parsedMessages, parseMessages } = useMessageParser();

  useEffect(() => {
    chatStore.setKey('started', initialMessages.length > 0);
  }, []);

  useEffect(() => {
    parseMessages(messages, isLoading);

    if (messages.length > initialMessages.length) {
      storeMessageHistory(messages).catch((error) => toast.error(error.message));
    }
  }, [messages, isLoading, parseMessages]);

  useEffect(() => {
    // Auto-scroll to bottom on new messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async (messageInput?: string) => {
    const _input = messageInput || input;

    if (_input.length === 0 || isLoading) {
      return;
    }

    await workbenchStore.saveAllFiles();

    const fileModifications = workbenchStore.getFileModifcations();

    chatStore.setKey('aborted', false);

    if (!chatStarted) {
      setChatStarted(true);
      chatStore.setKey('started', true);
    }

    if (fileModifications !== undefined) {
      const diff = fileModificationsToHTML(fileModifications);
      append({ role: 'user', content: `${diff}\n\n${_input}` });
      workbenchStore.resetAllFileModifications();
    } else {
      append({ role: 'user', content: _input });
    }

    setInput('');
    resetEnhancer();
    textareaRef.current?.blur();
  };

  const handleStop = () => {
    stop();
    chatStore.setKey('aborted', true);
    workbenchStore.abortAllActions();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <MobileChatMessages
          messages={messages.map((message, i) => {
            if (message.role === 'user') {
              return message;
            }
            return {
              ...message,
              content: parsedMessages[i] || '',
            };
          })}
          isStreaming={isLoading}
          chatStarted={chatStarted}
          onExampleClick={sendMessage}
        />
        <div ref={messagesEndRef} />
      </div>

      <MobileChatInput
        ref={textareaRef}
        input={input}
        isStreaming={isLoading}
        enhancingPrompt={enhancingPrompt}
        promptEnhanced={promptEnhanced}
        onInputChange={handleInputChange}
        onSend={sendMessage}
        onStop={handleStop}
        onEnhance={() => {
          enhancePrompt(input, (input) => {
            setInput(input);
          });
        }}
      />
    </div>
  );
});