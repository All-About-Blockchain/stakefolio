import React from 'react';
import dynamic from 'next/dynamic';

// Client-only import of the official Skip Go widget to avoid SSR issues
const SkipGoCore = dynamic(() => import('@skip-go/widget').then((m) => m.Widget), {
  ssr: false,
});

interface SkipGoWidgetProps {
  className?: string;
  brandColor?: string;
  theme?: 'light' | 'dark';
  defaultRoute?: {
    amountIn?: number;
    amountOut?: number;
    srcChainId?: string;
    srcAssetDenom?: string;
    destChainId?: string;
    destAssetDenom?: string;
  };
}

// Wrapper around the official Skip Go Widget with sensible defaults
export function SkipGoWidget({
  className,
  brandColor = '#7C3AED',
  theme = 'light',
  defaultRoute,
}: SkipGoWidgetProps) {
  return (
    <div className={className}>
      <SkipGoCore theme={theme} brandColor={brandColor} defaultRoute={defaultRoute} />
    </div>
  );
}

export default SkipGoWidget;


