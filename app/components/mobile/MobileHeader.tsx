import { memo } from 'react';
import { ThemeSwitch } from '~/components/ui/ThemeSwitch';
import type { MobileView } from './MobileLayout';

interface MobileHeaderProps {
  activeView: MobileView;
}

const viewTitles: Record<MobileView, string> = {
  chat: 'Bolt AI',
  workbench: 'Workbench'
};

export const MobileHeader = memo(({ activeView }: MobileHeaderProps) => {
  return (
    <header className="flex items-center justify-between p-4 bg-bolt-elements-background-depth-2 border-b border-bolt-elements-borderColor min-h-[60px] safe-area-inset-top">
      <div className="flex items-center space-x-3">
        <div className="i-bolt:logo-text w-8 h-8 text-accent-500" />
        <h1 className="text-lg font-semibold text-bolt-elements-textPrimary">
          {viewTitles[activeView]}
        </h1>
      </div>
      
      <ThemeSwitch className="p-2" />
    </header>
  );
});