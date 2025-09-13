import { useStore } from '@nanostores/react';
import { useState, useEffect } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { BaseChat } from '~/components/chat/BaseChat';
import { Chat } from '~/components/chat/Chat.client';
import { Header } from '~/components/header/Header';
import { Workbench } from '~/components/workbench/Workbench.client';
import { chatStore } from '~/lib/stores/chat';

export function DesktopApp() {
  const [isReady, setIsReady] = useState(false);
  const { showChat } = useStore(chatStore);

  useEffect(() => {
    // Prevent flash by ensuring component is ready
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <div className={`transition-all duration-300 ${showChat ? 'flex-1' : 'w-0 overflow-hidden'}`}>
          <ClientOnly fallback={<BaseChat />}>
            {() => <Chat />}
          </ClientOnly>
        </div>
        <ClientOnly>
          {() => <Workbench chatStarted={true} isStreaming={false} />}
        </ClientOnly>
      </div>
    </div>
  );
}