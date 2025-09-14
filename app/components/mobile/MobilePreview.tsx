import { useStore } from '@nanostores/react';
import { memo, useState, useRef, useEffect } from 'react';
import { workbenchStore } from '~/lib/stores/workbench';
import { classNames } from '~/utils/classNames';

export const MobilePreview = memo(() => {
  const previews = useStore(workbenchStore.previews);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [url, setUrl] = useState('');
  const [iframeUrl, setIframeUrl] = useState<string | undefined>();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const activePreview = previews[activePreviewIndex];

  useEffect(() => {
    if (!activePreview) {
      setUrl('');
      setIframeUrl(undefined);
      return;
    }

    const { baseUrl } = activePreview;
    setUrl(baseUrl);
    setIframeUrl(baseUrl);
  }, [activePreview]);

  const reloadPreview = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  if (previews.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-center bg-white">
        <div>
          <div className="i-ph:monitor text-4xl text-gray-400 mb-4" />
          <p className="text-gray-600">No preview available</p>
          <p className="text-sm text-gray-500 mt-2">
            Start a project to see the preview here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-3 bg-bolt-elements-background-depth-2 border-b border-bolt-elements-borderColor space-x-3">
        <button
          onClick={reloadPreview}
          className="p-2 rounded-md bg-bolt-elements-button-secondary-background text-bolt-elements-button-secondary-text hover:bg-bolt-elements-button-secondary-backgroundHover transition-colors min-h-[44px] min-w-[44px] touch-manipulation"
        >
          <div className="i-ph:arrow-clockwise text-lg" />
        </button>

        <div className="flex-1 flex items-center bg-bolt-elements-preview-addressBar-background border border-bolt-elements-borderColor rounded-md px-3 py-2">
          <input
            className="flex-1 bg-transparent text-sm text-bolt-elements-preview-addressBar-text outline-none"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setIframeUrl(url);
              }
            }}
          />
        </div>

        {previews.length > 1 && (
          <select
            value={activePreviewIndex}
            onChange={(e) => setActivePreviewIndex(Number(e.target.value))}
            className="px-3 py-2 bg-bolt-elements-button-secondary-background text-bolt-elements-button-secondary-text rounded-md border border-bolt-elements-borderColor text-sm min-h-[44px] touch-manipulation"
          >
            {previews.map((preview, index) => (
              <option key={preview.port} value={index}>
                Port {preview.port}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex-1">
        {activePreview ? (
          <iframe
            ref={iframeRef}
            className="w-full h-full border-none bg-white"
            src={iframeUrl}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-white">
            <p className="text-gray-600">No preview available</p>
          </div>
        )}
      </div>
    </div>
  );
});