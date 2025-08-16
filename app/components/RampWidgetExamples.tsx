import React, { useState } from 'react';
import { RampWidget } from './onboarding/RampWidget';
import { useWallet } from '@/app/contexts/WalletContext';

/**
 * RampWidgetExamples - A demonstration component showing various RampWidget configurations
 *
 * This component showcases different ways to configure the RampWidget for different use cases:
 * - Basic usage with defaults
 * - Chain-specific asset mapping
 * - Custom asset selection
 * - Mobile variant
 * - With wallet address pre-filling
 */
export function RampWidgetExamples() {
  const { address: connectedAddress } = useWallet();
  const [selectedExample, setSelectedExample] = useState<string>('basic');

  const examples = [
    {
      id: 'basic',
      title: 'Basic Usage',
      description: 'Default configuration with popular assets',
      config: {},
    },
    {
      id: 'cosmoshub',
      title: 'Cosmos Hub',
      description: 'Chain-specific assets for Cosmos Hub including ATOM',
      config: {
        chainName: 'cosmoshub',
        userAddress: connectedAddress || undefined,
      },
    },
    {
      id: 'osmosis',
      title: 'Osmosis',
      description: 'Chain-specific assets for Osmosis including OSMO',
      config: {
        chainName: 'osmosis',
        userAddress: connectedAddress || undefined,
      },
    },
    {
      id: 'juno',
      title: 'Juno',
      description: 'Chain-specific assets for Juno including JUNO',
      config: {
        chainName: 'juno',
        userAddress: connectedAddress || undefined,
      },
    },
    {
      id: 'custom-assets',
      title: 'Custom Asset Selection',
      description: 'Specific assets: ETH, USDC, and MATIC',
      config: {
        swapAsset: 'ETH_ETH,ETH_USDC,MATIC_*',
        defaultAsset: 'ETH_ETH',
        userAddress: connectedAddress || undefined,
      },
    },
    {
      id: 'ethereum-only',
      title: 'Ethereum Only',
      description: 'All Ethereum assets with ETH as default',
      config: {
        swapAsset: 'ETH_*',
        defaultAsset: 'ETH_ETH',
        userAddress: connectedAddress || undefined,
      },
    },
    {
      id: 'mobile',
      title: 'Mobile Variant',
      description: 'Mobile-optimized widget with popular assets',
      config: {
        variant: 'embedded-mobile' as const,
        swapAsset: 'ETH_*,USDC_*',
        defaultAsset: 'ETH_ETH',
        userAddress: connectedAddress || undefined,
      },
    },
    {
      id: 'stablecoins',
      title: 'Stablecoins Only',
      description: 'Focus on stablecoins: USDC, USDT, DAI',
      config: {
        swapAsset: 'ETH_USDC,ETH_USDT,ETH_DAI,MATIC_USDC,MATIC_USDT',
        defaultAsset: 'ETH_USDC',
        userAddress: connectedAddress || undefined,
      },
    },
  ];

  const selectedConfig =
    examples.find((ex) => ex.id === selectedExample)?.config || {};

  return (
    <div className='mx-auto max-w-6xl space-y-6 p-6'>
      <div className='text-center'>
        <h1 className='mb-4 text-3xl font-bold text-gray-800'>
          RampWidget Configuration Examples
        </h1>
        <p className='mb-8 text-gray-600'>
          Explore different ways to configure the RampWidget for various use
          cases
        </p>
      </div>

      {/* Example Selector */}
      <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
        {examples.map((example) => (
          <button
            key={example.id}
            onClick={() => setSelectedExample(example.id)}
            className={`rounded-lg border-2 p-4 transition-all ${
              selectedExample === example.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <h3 className='mb-2 text-sm font-semibold'>{example.title}</h3>
            <p className='text-xs text-gray-600'>{example.description}</p>
          </button>
        ))}
      </div>

      {/* Current Configuration Display */}
      <div className='rounded-lg bg-gray-50 p-4'>
        <h3 className='mb-2 font-semibold'>Current Configuration:</h3>
        <pre className='overflow-x-auto rounded border bg-white p-3 text-sm'>
          {JSON.stringify(selectedConfig, null, 2)}
        </pre>
      </div>

      {/* Wallet Status */}
      {connectedAddress && (
        <div className='rounded-lg border border-green-200 bg-green-50 p-4'>
          <h3 className='mb-2 font-semibold text-green-800'>
            Wallet Connected
          </h3>
          <p className='break-all font-mono text-sm text-green-700'>
            {connectedAddress}
          </p>
        </div>
      )}

      {/* RampWidget */}
      <div className='rounded-lg border-2 border-dashed border-gray-300 p-4'>
        <h3 className='mb-4 text-center font-semibold'>
          {examples.find((ex) => ex.id === selectedExample)?.title}
        </h3>
        <RampWidget {...selectedConfig} />
      </div>

      {/* Usage Instructions */}
      <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
        <h3 className='mb-2 font-semibold text-blue-800'>How to Use</h3>
        <ul className='space-y-1 text-sm text-blue-700'>
          <li>
            • Select different examples above to see various configurations
          </li>
          <li>• Connect a wallet to see address pre-filling in action</li>
          <li>
            • Each configuration demonstrates different asset selection
            strategies
          </li>
          <li>
            • The widget will automatically adjust based on the selected
            configuration
          </li>
        </ul>
      </div>

      {/* Code Examples */}
      <div className='rounded-lg bg-gray-50 p-4'>
        <h3 className='mb-2 font-semibold'>Code Examples:</h3>
        <div className='space-y-4'>
          <div>
            <h4 className='mb-1 text-sm font-medium'>Basic Usage:</h4>
            <pre className='overflow-x-auto rounded border bg-white p-2 text-xs'>
              {`<RampWidget />`}
            </pre>
          </div>
          <div>
            <h4 className='mb-1 text-sm font-medium'>
              With Chain and Address:
            </h4>
            <pre className='overflow-x-auto rounded border bg-white p-2 text-xs'>
              {`<RampWidget 
  chainName="osmosis"
  userAddress="osmo1..."
/>`}
            </pre>
          </div>
          <div>
            <h4 className='mb-1 text-sm font-medium'>Custom Assets:</h4>
            <pre className='overflow-x-auto rounded border bg-white p-2 text-xs'>
              {`<RampWidget 
  swapAsset="ETH_ETH,ETH_USDC,MATIC_*"
  defaultAsset="ETH_ETH"
  userAddress="0x1234..."
/>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
