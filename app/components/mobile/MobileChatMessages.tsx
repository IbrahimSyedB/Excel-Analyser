import type { Message } from 'ai';
import { memo } from 'react';
import { classNames } from '~/utils/classNames';
import { AssistantMessage } from '~/components/chat/AssistantMessage';
import { UserMessage } from '~/components/chat/UserMessage';

interface MobileChatMessagesProps {
  messages: Message[];
  isStreaming: boolean;
  chatStarted: boolean;
  onExampleClick: (text: string) => void;
}

const EXAMPLE_PROMPTS = [
  { text: 'Build a todo app in React using Tailwind' },
  { text: 'Create a simple blog using Astro' },
  { text: 'Make a cookie consent form using Material UI' },
  { text: 'Build a space invaders game' },
  { text: 'How do I center a div?' },
];

export const MobileChatMessages = memo(({ 
  messages, 
  isStreaming, 
  chatStarted, 
  onExampleClick 
}: MobileChatMessagesProps) => {
  if (!chatStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-bolt-elements-textPrimary mb-4">
            Where ideas begin
          </h1>
          <p className="text-bolt-elements-textSecondary text-lg">
            Bring ideas to life in seconds or get help on existing projects.
          </p>
        </div>

        <div className="w-full max-w-sm space-y-3">
          <p className="text-sm text-bolt-elements-textTertiary mb-4">Try these examples:</p>
          {EXAMPLE_PROMPTS.map((prompt, index) => (
            <button
              key={index}
              onClick={() => onExampleClick(prompt.text)}
              className="w-full p-4 text-left bg-bolt-elements-background-depth-2 hover:bg-bolt-elements-background-depth-3 rounded-lg border border-bolt-elements-borderColor transition-colors text-sm text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary min-h-[48px] touch-manipulation"
            >
              {prompt.text}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {messages.map((message, index) => {
        const { role, content } = message;
        const isUserMessage = role === 'user';
        const isLast = index === messages.length - 1;

        return (
          <div
            key={index}
            className={classNames('flex gap-3 p-4 rounded-lg', {
              'bg-bolt-elements-messages-background': isUserMessage || !isStreaming || (isStreaming && !isLast),
              'bg-gradient-to-b from-bolt-elements-messages-background from-30% to-transparent':
                isStreaming && isLast,
            })}
          >
            {isUserMessage && (
              <div className="flex items-center justify-center w-8 h-8 bg-white text-gray-600 rounded-full shrink-0">
                <div className="i-ph:user-fill text-lg"></div>
              </div>
            )}
            <div className="flex-1 min-w-0">
              {isUserMessage ? <UserMessage content={content} /> : <AssistantMessage content={content} />}
            </div>
          </div>
        );
      })}
      
      {isStreaming && (
        <div className="flex justify-center py-4">
          <div className="i-svg-spinners:3-dots-fade text-3xl text-bolt-elements-textSecondary"></div>
        </div>
      )}
    </div>
  );
});