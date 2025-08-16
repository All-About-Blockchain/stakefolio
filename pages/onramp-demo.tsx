import Head from 'next/head';
import { useState } from 'react';
import { OnRampWidget } from '@/app/components/onboarding/OnRampWidget';
import { TransakWidget } from '@/app/components/onboarding/TransakWidget';
import { RampModal } from '@/app/components/onboarding/RampModal';
import { TransakModal } from '@/app/components/onboarding/TransakModal';
import { useWallet } from '@/app/contexts/WalletContext';

export default function OnRampDemoPage() {
  const { address: connectedAddress } = useWallet();
  const [selectedMode, setSelectedMode] = useState<
    'selector' | 'ramp' | 'transak' | 'transak-embedded'
  >('selector');
  const [showRampModal, setShowRampModal] = useState(false);
  const [showTransakModal, setShowTransakModal] = useState(false);

  const handleOrderSuccessful = (
    orderData: any,
    provider: 'ramp' | 'transak'
  ) => {
    console.log(`${provider} order successful:`, orderData);
    alert(`${provider} order completed successfully!`);
  };

  const handleWidgetClose = (provider: 'ramp' | 'transak') => {
    console.log(`${provider} widget closed`);
    if (provider === 'ramp') {
      setShowRampModal(false);
    } else if (provider === 'transak') {
      setShowTransakModal(false);
    }
  };

  return (
    <>
      <Head>
        <title>On-Ramp Demo - Stakefolio</title>
        <meta
          name='description'
          content='Demo of On-Ramp providers (Ramp & Transak)'
        />
      </Head>
      <div className='min-h-screen bg-gray-50'>
        <div className='mx-auto max-w-6xl space-y-6 p-6'>
          <div className='text-center'>
            <h1 className='mb-4 text-3xl font-bold text-gray-800'>
              On-Ramp Provider Demo
            </h1>
            <p className='mb-8 text-gray-600'>
              Test different on-ramp providers and configurations
            </p>
          </div>

          {/* Mode Selector */}
          <div className='flex flex-wrap justify-center space-x-4'>
            <button
              onClick={() => setSelectedMode('selector')}
              className={`rounded-lg border-2 px-6 py-3 transition-all ${
                selectedMode === 'selector'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              Provider Selector
            </button>
            <button
              onClick={() => setSelectedMode('ramp')}
              className={`rounded-lg border-2 px-6 py-3 transition-all ${
                selectedMode === 'ramp'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              Ramp Only
            </button>
            <button
              onClick={() => setSelectedMode('transak')}
              className={`rounded-lg border-2 px-6 py-3 transition-all ${
                selectedMode === 'transak'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              Transak Modal
            </button>
            <button
              onClick={() => setSelectedMode('transak-embedded')}
              className={`rounded-lg border-2 px-6 py-3 transition-all ${
                selectedMode === 'transak-embedded'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              Transak Embedded
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

          {/* Widget Display */}
          <div className='rounded-lg border-2 border-dashed border-gray-300 p-4'>
            <h3 className='mb-4 text-center font-semibold'>
              {selectedMode === 'selector' && 'Provider Selection'}
              {selectedMode === 'ramp' && 'Ramp Widget'}
              {selectedMode === 'transak' && 'Transak Modal'}
              {selectedMode === 'transak-embedded' && 'Transak Embedded Widget'}
            </h3>

            {selectedMode === 'selector' && (
              <OnRampWidget
                showProviderSelector={true}
                rampChainName='cosmoshub'
                transakDefaultCryptoCurrency='ATOM'
                onOrderSuccessful={handleOrderSuccessful}
                onWidgetClose={handleWidgetClose}
              />
            )}

            {selectedMode === 'ramp' && (
              <div className='text-center'>
                <button
                  onClick={() => setShowRampModal(true)}
                  className='rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700'
                >
                  Open Ramp Modal
                </button>
              </div>
            )}

            {selectedMode === 'transak' && (
              <div className='text-center'>
                <button
                  onClick={() => setShowTransakModal(true)}
                  className='rounded-lg bg-green-600 px-6 py-3 text-white transition-colors hover:bg-green-700'
                >
                  Open Transak Modal
                </button>
              </div>
            )}

            {selectedMode === 'transak-embedded' && (
              <div className='w-full'>
                <TransakWidget
                  defaultCryptoCurrency='ATOM'
                  defaultFiatCurrency='USD'
                  walletAddress={connectedAddress || undefined}
                  cryptoCurrencyList={['ETH', 'USDC', 'MATIC', 'ATOM']}
                  fiatCurrencyList={['USD', 'EUR', 'GBP', 'CAD']}
                  onOrderCreated={(orderData: any) =>
                    console.log('Transak order created:', orderData)
                  }
                  onOrderSuccessful={(orderData: any) =>
                    handleOrderSuccessful(orderData, 'transak')
                  }
                  onWidgetClose={() => console.log('Transak widget closed')}
                  onError={(error: any) =>
                    console.error('Transak error:', error)
                  }
                />
              </div>
            )}
          </div>

          {/* Configuration Info */}
          <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
            <h3 className='mb-2 font-semibold text-blue-800'>
              Current Configuration
            </h3>
            <div className='space-y-2 text-sm text-blue-700'>
              <p>
                <strong>Mode:</strong> {selectedMode}
              </p>
              <p>
                <strong>Wallet Address:</strong>{' '}
                {connectedAddress || 'Not connected'}
              </p>
              {(selectedMode === 'ramp' || selectedMode === 'selector') && (
                <div>
                  <p>
                    <strong>Ramp Chain:</strong> osmosis
                  </p>
                  <p>
                    <strong>Ramp Assets:</strong> ETH_*, MATIC_*, USDC_*, OSMO_*
                  </p>
                </div>
              )}
              {(selectedMode === 'transak' ||
                selectedMode === 'transak-embedded' ||
                selectedMode === 'selector') && (
                <div>
                  <p>
                    <strong>Transak Default Crypto:</strong> ETH
                  </p>
                  <p>
                    <strong>Transak Default Fiat:</strong> USD
                  </p>
                  <p>
                    <strong>Available Cryptos:</strong> ETH, USDC, MATIC, ATOM
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Usage Instructions */}
          <div className='rounded-lg bg-gray-50 p-4'>
            <h3 className='mb-2 font-semibold'>How to Use</h3>
            <ul className='space-y-1 text-sm text-gray-700'>
              <li>
                • Select different modes above to test various configurations
              </li>
              <li>• Connect a wallet to see address pre-filling in action</li>
              <li>
                • Provider Selector allows users to choose between Ramp and
                Transak
              </li>
              <li>• Ramp Only shows a button to open Ramp in a modal</li>
              <li>• Transak Modal shows a button to open Transak in a modal</li>
              <li>
                • Transak Embedded shows Transak directly embedded in the page
              </li>
              <li>• Check the browser console for event logs</li>
            </ul>
          </div>

          {/* Code Examples */}
          <div className='rounded-lg bg-gray-50 p-4'>
            <h3 className='mb-2 font-semibold'>Code Examples:</h3>
            <div className='space-y-4'>
              <div>
                <h4 className='mb-1 text-sm font-medium'>Provider Selector:</h4>
                <pre className='overflow-x-auto rounded border bg-white p-2 text-xs'>
                  {`<OnRampWidget 
  showProviderSelector={true}
  rampChainName="cosmoshub"
  transakDefaultCryptoCurrency="ETH"
/>`}
                </pre>
              </div>
              <div>
                <h4 className='mb-1 text-sm font-medium'>Ramp Modal:</h4>
                <pre className='overflow-x-auto rounded border bg-white p-2 text-xs'>
                  {`<RampModal
  isOpen={showRampModal}
  onClose={() => setShowRampModal(false)}
  chainName="osmosis"
  userAddress={walletAddress}
/>`}
                </pre>
              </div>
              <div>
                <h4 className='mb-1 text-sm font-medium'>Transak Modal:</h4>
                <pre className='overflow-x-auto rounded border bg-white p-2 text-xs'>
                  {`<TransakModal
  isOpen={showTransakModal}
  onClose={() => setShowTransakModal(false)}
  defaultCryptoCurrency="ETH"
  walletAddress={walletAddress}
/>`}
                </pre>
              </div>
              <div>
                <h4 className='mb-1 text-sm font-medium'>Transak Embedded:</h4>
                <pre className='overflow-x-auto rounded border bg-white p-2 text-xs'>
                  {`<TransakWidget
  defaultCryptoCurrency="ETH"
  walletAddress={walletAddress}
  cryptoCurrencyList={["ETH", "USDC", "MATIC"]}
/>`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ramp Modal */}
      <RampModal
        isOpen={showRampModal}
        onClose={() => setShowRampModal(false)}
        userAddress={connectedAddress || undefined}
        swapAsset='ETH_*,MATIC_*,USDC_*,OSMO_*'
        defaultAsset='OSMO_OSMO'
        chainName='osmosis'
      />

      {/* Transak Modal */}
      <TransakModal
        isOpen={showTransakModal}
        onClose={() => setShowTransakModal(false)}
        defaultCryptoCurrency='ETH'
        defaultFiatCurrency='USD'
        walletAddress={connectedAddress || undefined}
        cryptoCurrencyList={['ETH', 'USDC', 'MATIC', 'ATOM']}
        fiatCurrencyList={['USD', 'EUR', 'GBP']}
        onOrderSuccessful={(orderData) =>
          handleOrderSuccessful(orderData, 'transak')
        }
        onWidgetClose={() => handleWidgetClose('transak')}
      />
    </>
  );
}
