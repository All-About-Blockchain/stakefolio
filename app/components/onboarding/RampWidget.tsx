import { useEffect, useRef, useState } from 'react';

type RampSDKType = any;

interface RampWidgetProps {
  hostAppName?: string;
  hostLogoUrl?: string;
  variant?: 'embedded-desktop' | 'embedded-mobile' | 'modal';
  swapAsset?: string; // e.g., 'ETH_ETH', 'ETH_*', 'MATIC_*,ETH_ETH'
  userAddress?: string; // User's wallet address
  defaultAsset?: string; // Default asset when using chain wildcards
  chainName?: string; // Optional chain name for asset mapping
  onClose?: () => void; // Callback when modal is closed
}

/**
 * Utility function to map Cosmos chains to appropriate Ramp assets
 *
 * @param chainName - The chain name to get assets for
 * @returns Object containing swapAsset and defaultAsset strings
 *
 * @example
 * // For Cosmos Hub
 * getRampAssetsForChain('cosmoshub')
 * // Returns: { swapAsset: 'ETH_*,MATIC_*,USDC_*,USDT_*,ATOM_*', defaultAsset: 'ETH_ETH' }
 *
 * // For Osmosis
 * getRampAssetsForChain('osmosis')
 * // Returns: { swapAsset: 'ETH_*,MATIC_*,USDC_*,USDT_*,OSMO_*', defaultAsset: 'ETH_ETH' }
 */
const getRampAssetsForChain = (
  chainName?: string
): { swapAsset: string; defaultAsset: string } => {
  if (!chainName) {
    // Default to popular assets for general use
    return {
      swapAsset: 'ETH_*,MATIC_*,USDC_*,USDT_*',
      defaultAsset: 'ETH_ETH',
    };
  }

  // Map specific Cosmos chains to appropriate assets
  const chainAssetMap: Record<
    string,
    { swapAsset: string; defaultAsset: string }
  > = {
    cosmoshub: {
      swapAsset: 'ETH_*,MATIC_*,USDC_*,USDT_*,ATOM_*',
      defaultAsset: 'ATOM_ATOM',
    },
    osmosis: {
      swapAsset: 'ETH_*,MATIC_*,USDC_*,USDT_*,OSMO_*',
      defaultAsset: 'OSMO_OSMO',
    },
    juno: {
      swapAsset: 'ETH_*,MATIC_*,USDC_*,USDT_*,JUNO_*',
      defaultAsset: 'JUNO_JUNO',
    },
    stargaze: {
      swapAsset: 'ETH_*,MATIC_*,USDC_*,USDT_*,STARS_*',
      defaultAsset: 'STARS_STARS',
    },
    evmos: {
      swapAsset: 'ETH_*,MATIC_*,USDC_*,USDT_*,EVMOS_*',
      defaultAsset: 'EVMOS_EVMOS',
    },
    axelar: {
      swapAsset: 'ETH_*,MATIC_*,USDC_*,USDT_*,AXL_*',
      defaultAsset: 'AXL_AXL',
    },
  };

  return (
    chainAssetMap[chainName.toLowerCase()] || {
      swapAsset: 'ETH_*,MATIC_*,USDC_*,USDT_*',
      defaultAsset: 'ETH_ETH',
    }
  );
};

/**
 * RampWidget - A React component that integrates Ramp Network's on-ramp/off-ramp functionality
 *
 * This component provides a seamless way for users to buy and sell crypto assets directly
 * within your application. It supports various configuration options including asset selection,
 * wallet address pre-filling, and chain-specific asset mapping.
 *
 * @param props - Configuration options for the Ramp widget
 * @param props.hostAppName - Your application name (default: 'Stakefolio')
 * @param props.hostLogoUrl - Your application logo URL (default: 'https://stakefol.io/icon.png')
 * @param props.variant - Widget variant ('embedded-desktop' | 'embedded-mobile')
 * @param props.swapAsset - Asset selection string (e.g., 'ETH_ETH', 'ETH_*', 'MATIC_*,ETH_ETH')
 * @param props.userAddress - User's wallet address to pre-fill
 * @param props.defaultAsset - Default asset when using chain wildcards
 * @param props.chainName - Chain name for automatic asset mapping
 *
 * @example
 * // Basic usage with default settings
 * <RampWidget />
 *
 * // With specific assets and wallet address
 * <RampWidget
 *   swapAsset="ETH_ETH,ETH_USDC,MATIC_*"
 *   userAddress="0x1234..."
 *   defaultAsset="ETH_ETH"
 * />
 *
 * // With chain-aware asset mapping
 * <RampWidget
 *   chainName="osmosis"
 *   userAddress="osmo1..."
 * />
 *
 * // Mobile variant
 * <RampWidget
 *   variant="embedded-mobile"
 *   swapAsset="ETH_*"
 *   userAddress="0x1234..."
 * />
 *
 * @example
 * // Asset string formats:
 * // Single asset: 'ETH_ETH'
 * // Multiple assets: 'ETH_ETH,ETH_USDC,MATIC_*'
 * // Chain wildcard: 'ETH_*' (includes all ETH assets)
 * // Mixed: 'ETH_*,MATIC_*,USDC_*'
 */
export function RampWidget({
  hostAppName = 'Stakefolio',
  hostLogoUrl = 'https://stakefol.io/icon.png',
  variant = 'embedded-desktop',
  swapAsset,
  userAddress,
  defaultAsset,
  chainName,
  onClose,
}: RampWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sdkInstanceRef = useRef<RampSDKType | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Get appropriate assets based on chain if not explicitly provided
  const { swapAsset: chainSwapAsset, defaultAsset: chainDefaultAsset } =
    getRampAssetsForChain(chainName);
  const finalSwapAsset = swapAsset || chainSwapAsset;
  const finalDefaultAsset = defaultAsset || chainDefaultAsset;

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

        // Build SDK configuration object
        const sdkConfig: any = {
          hostAppName,
          hostLogoUrl,
          hostApiKey: apiKey,
          variant,
        };

        // Only add containerNode for embedded variants
        if (variant !== 'modal') {
          sdkConfig.containerNode = containerNode;
        }

        // Add optional parameters if provided
        if (finalSwapAsset) {
          sdkConfig.swapAsset = finalSwapAsset;
        }

        if (userAddress) {
          sdkConfig.userAddress = userAddress;
        }

        if (finalDefaultAsset) {
          sdkConfig.defaultAsset = finalDefaultAsset;
        }

        // Instantiate the SDK with a stable container node
        const instance = new RampInstantSDK(sdkConfig);
        sdkInstanceRef.current = instance;

        // Add event listeners for modal variant
        if (variant === 'modal') {
          // Listen for close events
          const handleClose = () => {
            onClose?.();
          };

          // Listen for purchase completion
          const handlePurchase = () => {
            onClose?.();
          };

          // Add event listeners (Ramp SDK events)
          window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'RAMP_SDK_CLOSE') {
              handleClose();
            }
            if (
              event.data &&
              event.data.type === 'RAMP_SDK_PURCHASE_SUCCESSFUL'
            ) {
              handlePurchase();
            }
          });
        }

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
  }, [
    isReady,
    hostAppName,
    hostLogoUrl,
    variant,
    finalSwapAsset,
    userAddress,
    finalDefaultAsset,
  ]);

  // For modal variant, don't render a container
  if (variant === 'modal') {
    return null;
  }

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
