import { json, type MetaFunction } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { useEffect, useState } from 'react';
import { Chat } from '~/components/chat/Chat.client';
import { Header } from '~/components/header/Header';
import { Workbench } from '~/components/workbench/Workbench.client';
import { MobileLayout } from '~/components/mobile/MobileLayout';
import { useStore } from '@nanostores/react';
import { chatStore } from '~/lib/stores/chat';
import { workbenchStore } from '~/lib/stores/workbench';
import { isMobile } from '~/utils/mobile';

export const meta: MetaFunction = () => {
  return [
    { title: 'Bolt - AI Assistant' }, 
    { name: 'description', content: 'Talk with Bolt, an AI assistant from StackBlitz' }
  ];
};

export const loader = () => json({});

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-bolt-elements-background-depth-1">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div>
        <p className="text-bolt-elements-textSecondary text-sm">Loading Bolt...</p>
      </div>
    </div>
  );
}

function DesktopLayout() {
  const { showChat } = useStore(chatStore);
  const showWorkbench = useStore(workbenchStore.showWorkbench);
  const chatStarted = useStore(chatStore).started;

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <div className={`transition-all duration-300 ${showChat ? 'flex-1' : 'w-0 overflow-hidden'}`}>
          <Chat />
        </div>
        <Workbench chatStarted={chatStarted} isStreaming={false} />
      </div>
    </div>
  );
}

export default function Index() {
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsMobileDevice(isMobile());
    setIsReady(true);
  }, []);

  if (!isReady) {
    return <LoadingFallback />;
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-bolt-elements-background-depth-1">
      <ClientOnly fallback={<LoadingFallback />}>
        {() => isMobileDevice ? <MobileLayout /> : <DesktopLayout />}
      </ClientOnly>
    </div>
  );
}