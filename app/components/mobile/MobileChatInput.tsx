import { forwardRef, memo } from 'react';
import { classNames } from '~/utils/classNames';

interface MobileChatInputProps {
  input: string;
  isStreaming: boolean;
  enhancingPrompt: boolean;
  promptEnhanced: boolean;
  onInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  onStop: () => void;
  onEnhance: () => void;
}

export const MobileChatInput = memo(forwardRef<HTMLTextAreaElement, MobileChatInputProps>(
  ({ input, isStreaming, enhancingPrompt, promptEnhanced, onInputChange, onSend, onStop, onEnhance }, ref) => {
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (isStreaming) {
          onStop();
        } else {
          onSend();
        }
      }
    };

    return (
      <div className="p-4 bg-bolt-elements-background-depth-2 border-t border-bolt-elements-borderColor">
        <div className="bg-bolt-elements-prompt-background border border-bolt-elements-borderColor rounded-lg overflow-hidden">
          <textarea
            ref={ref}
            className="w-full p-4 bg-transparent text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary resize-none focus:outline-none"
            placeholder="How can Bolt help you today?"
            value={input}
            onChange={onInputChange}
            onKeyDown={handleKeyDown}
            rows={3}
            style={{ minHeight: '80px', maxHeight: '120px' }}
          />
          
          <div className="flex items-center justify-between p-3 pt-0">
            <button
              disabled={input.length === 0 || enhancingPrompt}
              onClick={onEnhance}
              className={classNames(
                'flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors',
                {
                  'bg-bolt-elements-button-secondary-background text-bolt-elements-button-secondary-text hover:bg-bolt-elements-button-secondary-backgroundHover': 
                    !promptEnhanced && !enhancingPrompt,
                  'bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text': 
                    promptEnhanced,
                  'opacity-50 cursor-not-allowed': input.length === 0 || enhancingPrompt,
                }
              )}
            >
              {enhancingPrompt ? (
                <>
                  <div className="i-svg-spinners:90-ring-with-bg text-lg"></div>
                  <span>Enhancing...</span>
                </>
              ) : (
                <>
                  <div className="i-bolt:stars text-lg"></div>
                  <span>{promptEnhanced ? 'Enhanced' : 'Enhance'}</span>
                </>
              )}
            </button>

            <button
              onClick={isStreaming ? onStop : onSend}
              disabled={!isStreaming && input.length === 0}
              className={classNames(
                'flex items-center justify-center w-12 h-12 rounded-full transition-colors',
                {
                  'bg-accent-500 hover:bg-accent-600 text-white': input.length > 0 || isStreaming,
                  'bg-bolt-elements-background-depth-3 text-bolt-elements-textTertiary cursor-not-allowed': 
                    !isStreaming && input.length === 0,
                }
              )}
            >
              {isStreaming ? (
                <div className="i-ph:stop-circle-bold text-xl"></div>
              ) : (
                <div className="i-ph:arrow-right text-xl"></div>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
));