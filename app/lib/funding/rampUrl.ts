/**
 * Builds query params for Ramp hosted / embedded widget.
 * @see https://docs.ramp.network/web/quick-start-hosted
 * @see https://docs.ramp.network/configuration
 */
export type RampFlowMode = 'onramp' | 'offramp';

export type BuildRampHostedParamsOptions = {
  hostApiKey: string;
  hostAppName: string;
  hostLogoUrl: string;
  mode: RampFlowMode;
  /** Comma-separated Ramp crypto asset keys, e.g. ETH_ETH,BTC_BTC */
  enabledCryptoAssets: string;
  /** Primary crypto asset for ONRAMP (what user receives) */
  onrampOutAsset: string;
  /** Primary crypto asset for OFFRAMP (what user sells) */
  offrampInAsset: string;
  /** Fiat code user receives on OFFRAMP (default USD) */
  offrampOutFiat?: string;
  userAddress?: string;
  /** Return URL after hosted on-ramp (optional) */
  finalUrl?: string;
  variant?: string;
  hideExitButton?: boolean;
};

export function buildRampHostedSearchParams(
  options: BuildRampHostedParamsOptions
): URLSearchParams {
  const defaultFlow = options.mode === 'onramp' ? 'ONRAMP' : 'OFFRAMP';
  const p = new URLSearchParams();

  p.set('hostApiKey', options.hostApiKey);
  p.set('hostAppName', options.hostAppName);
  p.set('hostLogoUrl', options.hostLogoUrl);

  p.set('defaultFlow', defaultFlow);
  p.set('enabledFlows', 'ONRAMP,OFFRAMP');
  p.set('enabledCryptoAssets', options.enabledCryptoAssets);

  p.set('variant', options.variant ?? 'embedded-desktop');
  p.set('hideExitButton', String(options.hideExitButton ?? true));

  if (options.userAddress) {
    p.set('userAddress', options.userAddress);
  }

  if (options.finalUrl) {
    p.set('finalUrl', options.finalUrl);
  }

  if (options.mode === 'onramp') {
    p.set('outAsset', options.onrampOutAsset);
  } else {
    p.set('inAsset', options.offrampInAsset);
    p.set('outAsset', options.offrampOutFiat ?? 'USD');
  }

  return p;
}

export function getRampHostedWidgetUrl(options: BuildRampHostedParamsOptions) {
  const base = 'https://app.rampnetwork.com/';
  const qs = buildRampHostedSearchParams(options).toString();
  return `${base}?${qs}`;
}
