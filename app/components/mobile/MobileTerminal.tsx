import { memo, useRef, useEffect } from 'react';
import { Terminal, type TerminalRef } from '~/components/workbench/terminal/Terminal';
import { workbenchStore } from '~/lib/stores/workbench';
import { useStore } from '@nanostores/react';
import { themeStore } from '~/lib/stores/theme';

export const MobileTerminal = memo(() => {
  const terminalRef = useRef<TerminalRef>(null);
  const theme = useStore(themeStore);

  useEffect(() => {
    const unsubscribe = themeStore.subscribe(() => {
      terminalRef.current?.reloadStyles();
    });

    return unsubscribe;
  }, []);

  return (
    <div className="h-full bg-bolt-elements-terminals-background">
      <Terminal
        ref={terminalRef}
        className="h-full"
        theme={theme}
        onTerminalReady={(terminal) => workbenchStore.attachTerminal(terminal)}
        onTerminalResize={(cols, rows) => workbenchStore.onTerminalResize(cols, rows)}
      />
    </div>
  );
});