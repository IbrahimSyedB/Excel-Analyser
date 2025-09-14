import { useStore } from '@nanostores/react';
import { memo, useState } from 'react';
import { workbenchStore } from '~/lib/stores/workbench';
import { MobileWorkbenchTabs } from './MobileWorkbenchTabs';
import { MobileFileTree } from './MobileFileTree';
import { MobilePreview } from './MobilePreview';
import { MobileTerminal } from './MobileTerminal';

export type MobileWorkbenchTab = 'preview' | 'files' | 'terminal';

export const MobileWorkbench = memo(() => {
  const [activeTab, setActiveTab] = useState<MobileWorkbenchTab>('preview');
  const files = useStore(workbenchStore.files);
  const previews = useStore(workbenchStore.previews);

  return (
    <div className="flex flex-col h-full bg-bolt-elements-background-depth-1">
      <MobileWorkbenchTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        hasFiles={Object.keys(files).length > 0}
        hasPreviews={previews.length > 0}
      />
      
      <div className="flex-1 overflow-hidden">
        {activeTab === 'preview' && <MobilePreview />}
        {activeTab === 'files' && <MobileFileTree />}
        {activeTab === 'terminal' && <MobileTerminal />}
      </div>
    </div>
  );
});