import { useEffect, useRef, useState } from 'react';

type RampSDKType = any;

interface RampWidgetProps {
  hostAppName?: string;
  hostLogoUrl?: string;
  variant?: 'embedded-desktop' | 'embedded-mobile';
}

export function RampWidget({
  hostAppName = 'Stakefolio',
  hostLogoUrl = 'https://stakefol.io/icon.png',
  variant = 'embedded-desktop',
}: RampWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sdkInstanceRef = useRef<RampSDKType | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(typeof window !== 'undefined');
  }, []);

  useEffect(() => {
    if (!isReady || !containerRef.current) return;

    let cancelled = false;
    const containerNode = containerRef.current;

    async function startRamp() {
      try {
        const { RampInstantSDK } = await import(
          '@ramp-network/ramp-instant-sdk'
        );
        if (cancelled) return;
        if (!RampInstantSDK) return;
        const apiKey = process.env.NEXT_PUBLIC_RAMP_API_KEY;

        // Instantiate the SDK with a stable container node
        const instance = new RampInstantSDK({
          hostAppName,
          hostLogoUrl,
          hostApiKey: apiKey,
          variant,
          containerNode,
        });
        sdkInstanceRef.current = instance;
        instance.show();
      } catch (e) {
        // Fail silently; the parent can show alternative content if needed
        // console.error('Failed to load Ramp SDK', e);
      }
    }

    startRamp();

    return () => {
      cancelled = true;
      // Best-effort cleanup: clear container content
      if (containerNode) {
        containerNode.innerHTML = '';
      }
      sdkInstanceRef.current = null;
    };
  }, [isReady, hostAppName, hostLogoUrl, variant]);

  return (
    <div className='w-full'>
      <div
        ref={containerRef}
        className='mx-auto w-full'
        style={{
          minWidth: variant === 'embedded-desktop' ? 895 : 375,
          minHeight: variant === 'embedded-desktop' ? 590 : 667,
        }}
      />
    </div>
  );
}
