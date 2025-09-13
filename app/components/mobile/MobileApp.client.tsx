import { useStore } from '@nanostores/react';
import { useState, useEffect } from 'react';
import { chatStore } from '~/lib/stores/chat';
import { workbenchStore } from '~/lib/stores/workbench';
import { MobileHeader } from './MobileHeader';
import { MobileChat } from './MobileChat';
import { MobileWorkbench } from './MobileWorkbench';
import { MobileBottomNav } from './MobileBottomNav';
import { classNames } from '~/utils/classNames';

export type MobileView = 'chat' | 'workbench' | 'files' | 'terminal';

export function MobileApp() {
  const [activeView, setActiveView] = useState<MobileView>('chat');
  const [isReady, setIsReady] = useState(false);
  const chatStarted = useStore(chatStore).started;
  const showWorkbench = useStore(workbenchStore.showWorkbench);

  useEffect(() => {
    // Prevent flash by ensuring component is ready
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-switch to workbench when it becomes available
    if (showWorkbench && activeView === 'chat' && chatStarted) {
      setActiveView('workbench');
    }
  }, [showWorkbench, activeView, chatStarted]);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-bolt-elements-background-depth-1">
      <MobileHeader activeView={activeView} />
      
      <div className="flex-1 overflow-hidden relative">
        {/* Chat View */}
        <div
          className={classNames(
            'absolute inset-0 transition-transform duration-300 ease-in-out',
            activeView === 'chat' ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <MobileChat />
        </div>

        {/* Workbench View */}
        <div
          className={classNames(
            'absolute inset-0 transition-transform duration-300 ease-in-out',
            activeView === 'workbench' ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <MobileWorkbench activeTab={activeView === 'files' ? 'files' : activeView === 'terminal' ? 'terminal' : 'preview'} />
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