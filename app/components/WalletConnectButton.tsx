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
      <div className='flex h-12 gap-4 rounded-lg border p-1'>
        {connectedChains.length === 0 ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className='rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
          >
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
            <p className='rounded bg-gray-100 p-2 font-mono text-sm'>
              {connectedChains.length}/{totalChains} chains
            </p>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600'
            >
              Manage
            </button>
          </div>
        )}
      </div>

      {/* Expanded dropdown */}
      {isExpanded && (
        <div className='absolute right-0 top-14 z-50 w-[400px] rounded-lg border bg-white p-4 shadow-lg'>
          <div className='mb-4 flex justify-between'>
            <h3 className='font-semibold'>Chain Connections</h3>
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
              className={`rounded px-3 py-1 text-sm text-white ${
                isConnecting
                  ? 'cursor-not-allowed bg-gray-400'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isConnecting ? 'Connecting...' : 'Connect All'}
            </button>
            <button
              onClick={handleDisconnectAll}
              disabled={isConnecting}
              className={`rounded px-3 py-1 text-sm text-white ${
                isConnecting
                  ? 'cursor-not-allowed bg-gray-400'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              Disconnect All
            </button>
          </div>

          {/* Individual chain connections */}
          <div className='max-h-[90vh] overflow-y-auto'>
            {chainHooks.map((chain) => (
              <div
                key={chain.chainName}
                className='mb-2 flex items-center justify-between rounded border p-2'
              >
                <div className='flex items-center gap-2'>
                  <div
                    className={`h-3 w-3 rounded-full ${chain.address ? 'bg-green-500' : 'bg-gray-300'}`}
                  />
                  <span className='font-medium capitalize'>
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
                        className='rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600'
                      >
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => chain.connect()}
                      className='rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600'
                    >
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
