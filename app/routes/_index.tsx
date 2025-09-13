import { json, type MetaFunction } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import { MobileApp } from '~/components/mobile/MobileApp.client';
import { DesktopApp } from '~/components/desktop/DesktopApp.client';
import { LoadingScreen } from '~/components/ui/LoadingScreen';

export const meta: MetaFunction = () => {
  return [
    { title: 'Bolt - AI Assistant' }, 
    { name: 'description', content: 'Talk with Bolt, an AI assistant from StackBlitz' }
  ];
};

export const loader = () => json({});

export default function Index() {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-bolt-elements-background-depth-1">
      <ClientOnly fallback={<LoadingScreen />}>
        {() => (
          <>
            {/* Mobile Layout */}
            <div className="block md:hidden h-full">
              <MobileApp />
            </div>
            {/* Desktop Layout */}
            <div className="hidden md:block h-full">
              <DesktopApp />
            </div>
          </>
        )}
      </ClientOnly>
    </div>
  );
}