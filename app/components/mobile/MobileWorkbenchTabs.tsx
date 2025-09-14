import { memo } from 'react';
import { classNames } from '~/utils/classNames';
import type { MobileWorkbenchTab } from './MobileWorkbench';

interface MobileWorkbenchTabsProps {
  activeTab: MobileWorkbenchTab;
  onTabChange: (tab: MobileWorkbenchTab) => void;
  hasFiles: boolean;
  hasPreviews: boolean;
}

export const MobileWorkbenchTabs = memo(({ 
  activeTab, 
  onTabChange, 
  hasFiles, 
  hasPreviews 
}: MobileWorkbenchTabsProps) => {
  const tabs = [
    { id: 'preview' as const, label: 'Preview', icon: 'i-ph:monitor', disabled: !hasPreviews },
    { id: 'files' as const, label: 'Files', icon: 'i-ph:folder', disabled: !hasFiles },
    { id: 'terminal' as const, label: 'Terminal', icon: 'i-ph:terminal' },
  ];

  return (
    <div className="flex bg-bolt-elements-background-depth-2 border-b border-bolt-elements-borderColor">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => !tab.disabled && onTabChange(tab.id)}
          disabled={tab.disabled}
          className={classNames(
            'flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-colors min-h-[48px] touch-manipulation',
            {
              'bg-bolt-elements-background-depth-1 text-bolt-elements-textPrimary border-b-2 border-accent-500': 
                activeTab === tab.id,
              'text-bolt-elements-textSecondary hover:text-bolt-elements-textPrimary hover:bg-bolt-elements-background-depth-3': 
                activeTab !== tab.id && !tab.disabled,
              'text-bolt-elements-textTertiary cursor-not-allowed opacity-50': tab.disabled,
            }
          )}
        >
          <div className={classNames(tab.icon, 'text-lg')} />
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
});