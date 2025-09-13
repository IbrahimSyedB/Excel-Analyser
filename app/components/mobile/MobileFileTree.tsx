import { useStore } from '@nanostores/react';
import { memo } from 'react';
import { workbenchStore } from '~/lib/stores/workbench';
import { FileTree } from '~/components/workbench/FileTree';
import { WORK_DIR } from '~/utils/constants';

export const MobileFileTree = memo(() => {
  const files = useStore(workbenchStore.files);
  const selectedFile = useStore(workbenchStore.selectedFile);
  const unsavedFiles = useStore(workbenchStore.unsavedFiles);

  const handleFileSelect = (filePath: string) => {
    workbenchStore.setSelectedFile(filePath);
    // Could add navigation to editor view here if needed
  };

  if (Object.keys(files).length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-center">
        <div>
          <div className="i-ph:folder-open text-4xl text-bolt-elements-textTertiary mb-4" />
          <p className="text-bolt-elements-textSecondary">No files available</p>
          <p className="text-sm text-bolt-elements-textTertiary mt-2">
            Files will appear here when you start a project
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-bolt-elements-background-depth-1">
      <div className="p-4">
        <FileTree
          files={files}
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          rootFolder={WORK_DIR}
          hideRoot
          unsavedFiles={unsavedFiles}
          className="text-base" // Larger text for mobile
        />
      </div>
    </div>
  );
});