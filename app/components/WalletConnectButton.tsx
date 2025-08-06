import { useChain, useWalletManager } from '@interchain-kit/react';
import React, { useState } from 'react';
import Image from 'next/image';

const walletImages: Record<string, string> = {
  'keplr-extension': '/wallet/keplr.png',
  'leap-extension': '/wallet/leap.png',
  'cosmostation-extension': '/wallet/cosmostation.png',
};

const WalletConnectButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const walletManager = useWalletManager();

  // Call all useChain hooks at the top level
  const cosmoshub = useChain('cosmoshub');
  const osmosis = useChain('osmosis');
  const juno = useChain('juno');
  const stargaze = useChain('stargaze');
  const akash = useChain('akash');
  const axelar = useChain('axelar');
  const evmos = useChain('evmos');
  const crescent = useChain('crescent');
  const comdex = useChain('comdex');
  const chihuahua = useChain('chihuahua');
  const stride = useChain('stride');
  const quicksilver = useChain('quicksilver');
  const kujira = useChain('kujira');
  const persistence = useChain('persistence');
  const regen = useChain('regen');
  const bitsong = useChain('bitsong');
  const gravitybridge = useChain('gravitybridge');
  const umee = useChain('umee');
  const desmos = useChain('desmos');

  // Combine all chain hooks into an array
  const chainHooks = [
    { chainName: 'cosmoshub', ...cosmoshub },
    { chainName: 'osmosis', ...osmosis },
    { chainName: 'juno', ...juno },
    { chainName: 'stargaze', ...stargaze },
    { chainName: 'akash', ...akash },
    { chainName: 'axelar', ...axelar },
    { chainName: 'evmos', ...evmos },
    { chainName: 'crescent', ...crescent },
    { chainName: 'comdex', ...comdex },
    { chainName: 'chihuahua', ...chihuahua },
    { chainName: 'stride', ...stride },
    { chainName: 'quicksilver', ...quicksilver },
    { chainName: 'kujira', ...kujira },
    { chainName: 'persistence', ...persistence },
    { chainName: 'regen', ...regen },
    { chainName: 'bitsong', ...bitsong },
    { chainName: 'gravitybridge', ...gravitybridge },
    { chainName: 'umee', ...umee },
    { chainName: 'desmos', ...desmos },
  ];

  // Count connected chains
  const connectedChains = chainHooks.filter((chain) => chain.address);
  const totalChains = chainHooks.length;

  const handleConnectAll = async () => {
    // List of problematic chain IDs that don't have proper modular chain info
    const problematicChainIds = ['crescent-1', 'bitsong-2b'];

    // Get all chains that aren't connected yet and have valid chain info
    const unconnectedChains = chainHooks.filter(
      (chain) =>
        !chain.address &&
        chain.chain?.chainId &&
        !problematicChainIds.includes(chain.chain.chainId)
    );

    if (unconnectedChains.length === 0) {
      console.log(
        'No chains to connect - all are already connected or invalid'
      );
      return;
    }

    console.log(
      `Found ${unconnectedChains.length} chains to connect:`,
      unconnectedChains.map((c) => `${c.chainName} (${c.chain?.chainId})`)
    );

    setIsConnecting(true);

    try {
      // Connect to chains sequentially with proper delays
      let connectedCount = 0;
      let failedCount = 0;

      for (const chain of unconnectedChains) {
        try {
          console.log(`Connecting to ${chain.chainName}...`);

          // Use the interchain-kit connect method
          await chain.connect();
          connectedCount++;
          console.log(`✅ Connected to ${chain.chainName}`);

          // Add delay between connections to avoid overwhelming the wallet
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
          failedCount++;
          console.error(`❌ Failed to connect to ${chain.chainName}:`, error);

          // Continue with next chain even if this one failed
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      }

      console.log(
        `Connection complete: ${connectedCount} successful, ${failedCount} failed`
      );

      if (connectedCount > 0) {
        console.log(`Successfully connected to ${connectedCount} chains!`);
      }

      if (failedCount > 0) {
        console.log(
          `${failedCount} chains failed to connect. You may need to connect them manually.`
        );
      }
    } catch (error) {
      console.error('Connection process failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectAll = async () => {
    for (const chain of chainHooks) {
      if (chain.address) {
        try {
          await chain.disconnect();
        } catch (error) {
          console.error(`Failed to disconnect from ${chain.chainName}:`, error);
        }
      }
    }
  };

  return (
    <div className='relative'>
      {/* Main button */}
      <div className='flex h-12 gap-4 rounded-lg border-0 p-1'>
        {connectedChains.length === 0 ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className='glass-button flex items-center gap-2 rounded-lg border-0 px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-gray-100'
          >
            <svg
              className='h-4 w-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
              />
            </svg>
            Connect Wallet
          </button>
        ) : (
          <div className='flex items-center gap-3 pl-2'>
            {/* Show wallet icon if all chains use the same wallet */}
            {connectedChains.length > 0 &&
              connectedChains[0].wallet?.walletName &&
              walletImages[connectedChains[0].wallet.walletName] && (
                <Image
                  src={walletImages[connectedChains[0].wallet.walletName]}
                  alt={connectedChains[0].wallet.walletName}
                  width={24}
                  height={24}
                  className='h-6 w-6'
                />
              )}
            <p className='glass-ultra-light rounded-lg p-2 font-mono text-sm'>
              {connectedChains.length}/{totalChains} chains
            </p>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='glass-button flex items-center gap-2 rounded-lg border-0 px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-gray-100'
            >
              <svg
                className='h-4 w-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
              Manage
            </button>
          </div>
        )}
      </div>

      {/* Expanded dropdown */}
      {isExpanded && (
        <div className='bright-card ultra-soft-shadow absolute right-0 top-14 z-50 w-[400px] rounded-xl border-0 p-4 shadow-2xl'>
          <div className='mb-4 flex justify-between'>
            <h3 className='font-semibold text-gray-800'>Chain Connections</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className='text-gray-500 hover:text-gray-700'
            >
              ✕
            </button>
          </div>

          {/* Bulk actions */}
          <div className='mb-4 flex gap-2'>
            <button
              onClick={handleConnectAll}
              disabled={isConnecting}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                isConnecting
                  ? 'cursor-not-allowed bg-gray-400 text-white'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              <svg
                className='h-4 w-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                />
              </svg>
              {isConnecting ? 'Connecting...' : 'Connect All'}
            </button>
            <button
              onClick={handleDisconnectAll}
              disabled={isConnecting}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                isConnecting
                  ? 'cursor-not-allowed bg-gray-400 text-white'
                  : 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              <svg
                className='h-4 w-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
              Disconnect All
            </button>
          </div>

          {/* Individual chain connections */}
          <div className='max-h-[90vh] overflow-y-auto'>
            {chainHooks.map((chain) => (
              <div
                key={chain.chainName}
                className='glass-ultra-light mb-2 flex items-center justify-between rounded-lg border-0 p-3'
              >
                <div className='flex items-center gap-2'>
                  <div
                    className={`h-3 w-3 rounded-full ${chain.address ? 'bg-green-500' : 'bg-gray-300'}`}
                  />
                  <span className='font-medium capitalize text-gray-800'>
                    {chain.chainName}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  {chain.address ? (
                    <>
                      <span className='text-xs text-gray-500'>
                        {chain.address.slice(0, 8)}...{chain.address.slice(-6)}
                      </span>
                      <button
                        onClick={() => chain.disconnect()}
                        className='glass-button flex items-center gap-1 rounded-lg border-0 px-2 py-1 text-xs font-medium transition-all duration-200 hover:bg-gray-100'
                      >
                        <svg
                          className='h-3 w-3'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M6 18L18 6M6 6l12 12'
                          />
                        </svg>
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => chain.connect()}
                      className='glass-button flex items-center gap-1 rounded-lg border-0 px-2 py-1 text-xs font-medium transition-all duration-200 hover:bg-gray-100'
                    >
                      <svg
                        className='h-3 w-3'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                        />
                      </svg>
                      Connect
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnectButton;
