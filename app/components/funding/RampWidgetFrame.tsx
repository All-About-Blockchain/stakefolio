import { useEffect, useMemo, useState } from 'react';
import { getRampHostedWidgetUrl } from '@/app/lib/funding/rampUrl';
import type { RampFlowMode } from '@/app/lib/funding/rampUrl';

type RampWidgetFrameProps = {
  mode: RampFlowMode;
  enabledCryptoAssets: string;
  onrampOutAsset: string;
  offrampInAsset: string;
  userAddress?: string;
  overlay?: boolean;
  onClose?: () => void;
};

export default function RampWidgetFrame({
  mode,
  enabledCryptoAssets,
  onrampOutAsset,
  offrampInAsset,
  userAddress,
  overlay = false,
  onClose,
}: RampWidgetFrameProps) {
  const apiKey = process.env.NEXT_PUBLIC_RAMP_API_KEY;
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);

  const hostAppName = useMemo(
    () => process.env.NEXT_PUBLIC_RAMP_APP_NAME || 'Stakefolio',
    []
  );

  useEffect(() => {
    if (!apiKey || typeof window === 'undefined') return;

    const hostLogoUrl =
      process.env.NEXT_PUBLIC_RAMP_HOST_LOGO_URL ||
      `${window.location.origin}/vercel.svg`;

    try {
      const url = getRampHostedWidgetUrl({
        hostApiKey: apiKey,
        hostAppName,
        hostLogoUrl,
        mode,
        enabledCryptoAssets,
        onrampOutAsset,
        offrampInAsset,
        userAddress,
        finalUrl: window.location.href,
        variant: 'embedded-desktop',
        hideExitButton: overlay,
      });
      setIframeSrc(url);
    } catch {
      setIframeSrc(null);
    }
  }, [
    apiKey,
    hostAppName,
    mode,
    enabledCryptoAssets,
    onrampOutAsset,
    offrampInAsset,
    userAddress,
    overlay,
  ]);

  const openInNewTab = () => {
    if (!iframeSrc) return;
    window.open(iframeSrc, '_blank', 'noopener,noreferrer');
  };

  const header = (
    <div className='flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-4 py-3 sm:px-6'>
      <div>
        <h3 className='text-lg font-semibold text-gray-900'>
          {mode === 'onramp' ? 'Buy with bank' : 'Sell to bank'}
        </h3>
        <p className='text-sm text-gray-500'>
          Ramp — {enabledCryptoAssets}
        </p>
      </div>
      <div className='flex flex-wrap gap-2'>
        {iframeSrc && (
          <button
            type='button'
            onClick={openInNewTab}
            className='rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50'
          >
            Open in new tab
          </button>
        )}
        {onClose && (
          <button
            type='button'
            onClick={onClose}
            className='rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50'
          >
            Close
          </button>
        )}
      </div>
    </div>
  );

  const content =
    !apiKey ? (
      <div className='p-6 text-sm text-amber-800'>
        Set{' '}
        <code className='rounded bg-amber-100 px-1'>NEXT_PUBLIC_RAMP_API_KEY</code>
        . For production, set{' '}
        <code className='rounded bg-amber-100 px-1'>NEXT_PUBLIC_RAMP_HOST_LOGO_URL</code>{' '}
        to your app logo URL (required by Ramp). Local dev can fall back to{' '}
        <code className='rounded bg-amber-100 px-1'>/vercel.svg</code> if served from your
        origin.
      </div>
    ) : !iframeSrc ? (
      <div className='flex h-[480px] items-center justify-center text-sm text-gray-500'>
        Loading Ramp…
      </div>
    ) : (
      <iframe
        title='Ramp'
        src={iframeSrc}
        className='h-[min(70vh,720px)] w-full min-h-[480px] border-0'
        allow='clipboard-write; payment'
        referrerPolicy='strict-origin-when-cross-origin'
      />
    );

  const shell = (
    <div className='overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm'>
      {header}
      {content}
    </div>
  );

  if (overlay) {
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
        <div className='max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl'>
          {shell}
        </div>
      </div>
    );
  }

  return shell;
}
