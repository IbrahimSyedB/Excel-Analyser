import { memo } from 'react';
import { classNames } from '~/utils/classNames';
import type { MobileView } from './MobileApp.client';

interface MobileBottomNavProps {
  activeView: MobileView;
  onViewChange: (view: MobileView) => void;
  chatStarted: boolean;
  showWorkbench: boolean;
}

export const MobileBottomNav = memo(({ 
  activeView, 
  onViewChange, 
  chatStarted, 
  showWorkbench 
}: MobileBottomNavProps) => {
  const navItems = [
    {
      id: 'chat' as const,
      label: 'Chat',
      icon: 'i-ph:chat-circle',
      enabled: true,
    },
    {
      id: 'workbench' as const,
      label: 'Code',
      icon: 'i-ph:code',
      enabled: showWorkbench,
    },
  ];

  return (
    <nav className="flex bg-bolt-elements-background-depth-2 border-t border-bolt-elements-borderColor safe-area-inset-bottom">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => item.enabled && onViewChange(item.id)}
          disabled={!item.enabled}
          className={classNames(
            'flex-1 flex flex-col items-center justify-center py-3 px-4 min-h-[60px] transition-colors',
            {
              'text-accent-500 bg-bolt-elements-item-backgroundAccent': 
                activeView === item.id && item.enabled,
              'text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundActive': 
                activeView !== item.id && item.enabled,
              'text-bolt-elements-textTertiary cursor-not-allowed opacity-50': !item.enabled,
            }
          )}
        >
          <div className={classNames(item.icon, 'text-xl mb-1')} />
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
});