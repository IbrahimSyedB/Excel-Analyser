import { useStore } from '@nanostores/react';
import { useState, useEffect } from 'react';
import { chatStore } from '~/lib/stores/chat';
import { workbenchStore } from '~/lib/stores/workbench';
import { MobileHeader } from './MobileHeader';
import { MobileChat } from './MobileChat';
import { MobileWorkbench } from './MobileWorkbench';
import { MobileBottomNav } from './MobileBottomNav';
import { classNames } from '~/utils/classNames';

export type MobileView = 'chat' | 'workbench';

export function MobileLayout() {
  const [activeView, setActiveView] = useState<MobileView>('chat');
  const chatStarted = useStore(chatStore).started;
  const showWorkbench = useStore(workbenchStore.showWorkbench);

  useEffect(() => {
    if (showWorkbench && chatStarted && activeView === 'chat') {
      setActiveView('workbench');
    }
  }, [showWorkbench, chatStarted, activeView]);

  return (
    <div className="flex flex-col h-full bg-bolt-elements-background-depth-1">
      <MobileHeader activeView={activeView} />
      
      <div className="flex-1 overflow-hidden relative">
        <div
          className={classNames(
            'absolute inset-0 transition-transform duration-300 ease-out',
            activeView === 'chat' ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <MobileChat />
        </div>

        <div
          className={classNames(
            'absolute inset-0 transition-transform duration-300 ease-out',
            activeView === 'workbench' ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <MobileWorkbench />
        </div>
      </div>

      <MobileBottomNav 
        activeView={activeView} 
        onViewChange={setActiveView}
        chatStarted={chatStarted}
        showWorkbench={showWorkbench}
      />
    </div>
  );
}