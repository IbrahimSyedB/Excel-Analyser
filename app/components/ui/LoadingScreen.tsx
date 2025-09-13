import { memo } from 'react';

export const LoadingScreen = memo(() => {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-bolt-elements-background-depth-1">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div>
        <p className="text-bolt-elements-textSecondary text-sm">Loading Bolt...</p>
      </div>
    </div>
  );
});