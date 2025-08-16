import React, { useState } from 'react';
import { RampWidget } from './RampWidget';
import { RampModal } from './RampModal';
import { TransakWidget } from './TransakWidget';
import { TransakModal } from './TransakModal';
import { useWallet } from '@/app/contexts/WalletContext';

type Provider = 'ramp' | 'transak';

interface OnRampWidgetProps {
  defaultProvider?: Provider;
  showProviderSelector?: boolean;
  // Ramp-specific props
  rampSwapAsset?: string;
  rampDefaultAsset?: string;
  rampChainName?: string;
  // Transak-specific props
  transakDefaultCryptoCurrency?: string;
  transakDefaultFiatCurrency?: string;
  transakCryptoCurrencyList?: string[];
  transakFiatCurrencyList?: string[];
  transakCountryCode?: string;
  transakLanguage?: string;
  transakTheme?: 'light' | 'dark';
  // Event handlers
  onOrderCreated?: (orderData: any, provider: Provider) => void;
  onOrderSuccessful?: (orderData: any, provider: Provider) => void;
  onWidgetClose?: (provider: Provider) => void;
  onError?: (error: any, provider: Provider) => void;
}

/**
 * OnRampWidget - A unified component that provides both Ramp and Transak on-ramp options
 *
 * This component allows users to choose between different on-ramp providers and provides
 * a consistent interface for both services.
 *
 * @param props - Configuration options for the on-ramp widget
 * @param props.defaultProvider - Default provider to show ('ramp' | 'transak')
 * @param props.showProviderSelector - Whether to show provider selection UI
 * @param props.rampSwapAsset - Ramp asset selection string
 * @param props.rampDefaultAsset - Ramp default asset
 * @param props.rampChainName - Ramp chain name for asset mapping
 * @param props.transakDefaultCryptoCurrency - Transak default crypto currency
 * @param props.transakDefaultFiatCurrency - Transak default fiat currency
 * @param props.transakCryptoCurrencyList - Transak available crypto currencies
 * @param props.transakFiatCurrencyList - Transak available fiat currencies
 * @param props.transakCountryCode - Transak country code
 * @param props.transakLanguage - Transak language
 * @param props.transakTheme - Transak theme
 * @param props.onOrderCreated - Callback when order is created
 * @param props.onOrderSuccessful - Callback when order is successful
 * @param props.onWidgetClose - Callback when widget is closed
 * @param props.onError - Callback for errors
 *
 * @example
 * // Basic usage with provider selector
 * <OnRampWidget showProviderSelector={true} />
 *
 * // Ramp only
 * <OnRampWidget
 *   defaultProvider="ramp"
 *   rampChainName="osmosis"
 *   userAddress="osmo1..."
 * />
 *
 * // Transak only
 * <OnRampWidget
 *   defaultProvider="transak"
 *   transakDefaultCryptoCurrency="ETH"
 *   userAddress="0x1234..."
 * />
 */
export function OnRampWidget({
  defaultProvider = 'ramp',
  showProviderSelector = false,
  // Ramp props
  rampSwapAsset,
  rampDefaultAsset,
  rampChainName,
  // Transak props
  transakDefaultCryptoCurrency,
  transakDefaultFiatCurrency = 'USD',
  transakCryptoCurrencyList,
  transakFiatCurrencyList,
  transakCountryCode,
  transakLanguage = 'en',
  transakTheme = 'light',
  // Event handlers
  onOrderCreated,
  onOrderSuccessful,
  onWidgetClose,
  onError,
}: OnRampWidgetProps) {
  const { address: connectedAddress } = useWallet();
  const [selectedProvider, setSelectedProvider] =
    useState<Provider>(defaultProvider);
  const [showWidget, setShowWidget] = useState(false);

  const handleProviderSelect = (provider: Provider) => {
    setSelectedProvider(provider);
    setShowWidget(true);
  };

  const handleWidgetClose = (provider: Provider) => {
    setShowWidget(false);
    onWidgetClose?.(provider);
  };

  const handleOrderCreated = (orderData: any, provider: Provider) => {
    onOrderCreated?.(orderData, provider);
  };

  const handleOrderSuccessful = (orderData: any, provider: Provider) => {
    onOrderSuccessful?.(orderData, provider);
  };

  const handleError = (error: any, provider: Provider) => {
    onError?.(error, provider);
  };

  // If no provider selector and widget should be shown immediately
  if (!showProviderSelector && showWidget) {
    if (selectedProvider === 'ramp') {
      return (
        <RampModal
          isOpen={true}
          onClose={() => handleWidgetClose('ramp')}
          userAddress={connectedAddress || undefined}
          swapAsset={rampSwapAsset}
          defaultAsset={rampDefaultAsset}
          chainName={rampChainName}
        />
      );
    } else {
      return (
        <TransakModal
          isOpen={true}
          onClose={() => handleWidgetClose('transak')}
          defaultCryptoCurrency={transakDefaultCryptoCurrency}
          defaultFiatCurrency={transakDefaultFiatCurrency}
          walletAddress={connectedAddress || undefined}
          cryptoCurrencyList={transakCryptoCurrencyList}
          fiatCurrencyList={transakFiatCurrencyList}
          countryCode={transakCountryCode}
          language={transakLanguage}
          theme={transakTheme}
          onOrderCreated={(orderData) =>
            handleOrderCreated(orderData, 'transak')
          }
          onOrderSuccessful={(orderData) =>
            handleOrderSuccessful(orderData, 'transak')
          }
          onWidgetClose={() => handleWidgetClose('transak')}
          onError={(error) => handleError(error, 'transak')}
        />
      );
    }
  }

  // Provider selection UI
  if (showProviderSelector && !showWidget) {
    return (
      <div className='mx-auto max-w-2xl space-y-6 p-6'>
        <div className='text-center'>
          <h2 className='mb-2 text-2xl font-bold text-gray-800'>
            Choose Your On-Ramp Provider
          </h2>
          <p className='text-gray-600'>
            Select your preferred service to buy crypto
          </p>
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          {/* Ramp Option */}
          <button
            onClick={() => handleProviderSelect('ramp')}
            className='rounded-lg border-2 border-gray-200 p-6 text-left transition-all hover:border-blue-500 hover:bg-blue-50'
          >
            <div className='mb-4 flex items-center'>
              <div className='mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-lg font-bold text-white'>
                R
              </div>
              <div>
                <h3 className='text-lg font-semibold text-gray-800'>Ramp</h3>
                <p className='text-sm text-gray-600'>Fast & Secure</p>
              </div>
            </div>
            <ul className='space-y-1 text-sm text-gray-600'>
              <li>• 150+ countries supported</li>
              <li>• 50+ payment methods</li>
              <li>• Instant crypto delivery</li>
              <li>• Competitive rates</li>
            </ul>
          </button>

          {/* Transak Option */}
          <button
            onClick={() => handleProviderSelect('transak')}
            className='rounded-lg border-2 border-gray-200 p-6 text-left transition-all hover:border-green-500 hover:bg-green-50'
          >
            <div className='mb-4 flex items-center'>
              <div className='mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-teal-600 text-lg font-bold text-white'>
                T
              </div>
              <div>
                <h3 className='text-lg font-semibold text-gray-800'>Transak</h3>
                <p className='text-sm text-gray-600'>Global Coverage</p>
              </div>
            </div>
            <ul className='space-y-1 text-sm text-gray-600'>
              <li>• 160+ countries supported</li>
              <li>• 60+ payment methods</li>
              <li>• Real-time pricing</li>
              <li>• 24/7 support</li>
            </ul>
          </button>
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
      </div>
    );
  }

  // Default: show provider selector if enabled, otherwise show default provider
  if (showProviderSelector) {
    return (
      <div className='mx-auto max-w-2xl space-y-6 p-6'>
        <div className='text-center'>
          <h2 className='mb-2 text-2xl font-bold text-gray-800'>
            Choose Your On-Ramp Provider
          </h2>
          <p className='text-gray-600'>
            Select your preferred service to buy crypto
          </p>
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          {/* Ramp Option */}
          <button
            onClick={() => handleProviderSelect('ramp')}
            className='rounded-lg border-2 border-gray-200 p-6 text-left transition-all hover:border-blue-500 hover:bg-blue-50'
          >
            <div className='mb-4 flex items-center'>
              <div className='mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-lg font-bold text-white'>
                R
              </div>
              <div>
                <h3 className='text-lg font-semibold text-gray-800'>Ramp</h3>
                <p className='text-sm text-gray-600'>Fast & Secure</p>
              </div>
            </div>
            <ul className='space-y-1 text-sm text-gray-600'>
              <li>• 150+ countries supported</li>
              <li>• 50+ payment methods</li>
              <li>• Instant crypto delivery</li>
              <li>• Competitive rates</li>
            </ul>
          </button>

          {/* Transak Option */}
          <button
            onClick={() => handleProviderSelect('transak')}
            className='rounded-lg border-2 border-gray-200 p-6 text-left transition-all hover:border-green-500 hover:bg-green-50'
          >
            <div className='mb-4 flex items-center'>
              <div className='mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-teal-600 text-lg font-bold text-white'>
                T
              </div>
              <div>
                <h3 className='text-lg font-semibold text-gray-800'>Transak</h3>
                <p className='text-sm text-gray-600'>Global Coverage</p>
              </div>
            </div>
            <ul className='space-y-1 text-sm text-gray-600'>
              <li>• 160+ countries supported</li>
              <li>• 60+ payment methods</li>
              <li>• Real-time pricing</li>
              <li>• 24/7 support</li>
            </ul>
          </button>
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
      </div>
    );
  }

  // Default provider widget
  if (defaultProvider === 'ramp') {
    return (
      <RampModal
        isOpen={true}
        onClose={() => handleWidgetClose('ramp')}
        userAddress={connectedAddress || undefined}
        swapAsset={rampSwapAsset}
        defaultAsset={rampDefaultAsset}
        chainName={rampChainName}
      />
    );
  } else {
    return (
      <TransakModal
        isOpen={true}
        onClose={() => handleWidgetClose('transak')}
        defaultCryptoCurrency={transakDefaultCryptoCurrency}
        defaultFiatCurrency={transakDefaultFiatCurrency}
        walletAddress={connectedAddress || undefined}
        cryptoCurrencyList={transakCryptoCurrencyList}
        fiatCurrencyList={transakFiatCurrencyList}
        countryCode={transakCountryCode}
        language={transakLanguage}
        theme={transakTheme}
        onOrderCreated={(orderData) => handleOrderCreated(orderData, 'transak')}
        onOrderSuccessful={(orderData) =>
          handleOrderSuccessful(orderData, 'transak')
        }
        onWidgetClose={() => handleWidgetClose('transak')}
        onError={(error) => handleError(error, 'transak')}
      />
    );
  }
}
