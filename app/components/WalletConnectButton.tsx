import React, { useState } from 'react';
import Image from 'next/image';
import { useWalletConnection } from '../hooks/useWalletConnection';
import { useToast } from '../contexts/ToastContext';

const walletImages: Record<string, string> = {
  'keplr-extension': '/wallet/keplr.png',
  'leap-extension': '/wallet/leap.png',
  'cosmostation-extension': '/wallet/cosmostation.png',
};

const WalletConnectButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { addToast } = useToast();
  const {
    connectionStatuses,
    isConnecting,
    summary,
    connectAll,
    disconnectAll,
    retryFailed,
    connectSingleChain,
    disconnectSingleChain,
  } = useWalletConnection();

  const handleConnectAll = async () => {
    const result = await connectAll();
    if (result && result.success > 0) {
      addToast(
        `Successfully connected to ${result.success} chains!`,
        'success'
      );
    }
    if (result && result.failed > 0) {
      addToast(
        `${result.failed} chains failed to connect. You may need to connect them manually.`,
        'warning'
      );
    }
  };

  const handleDisconnectAll = async () => {
    await disconnectAll();
    addToast('Disconnected from all chains', 'info');
  };

  const handleRetryFailed = async () => {
    const result = await retryFailed();
    if (result && result.success > 0) {
      addToast(`Successfully retried ${result.success} chains!`, 'success');
    }
    if (result && result.failed > 0) {
      addToast(`${result.failed} chains still failed after retry.`, 'error');
    }
  };

  return (
    <div className='relative'>
      {/* Main button */}
      <div className='flex h-12 gap-4 rounded-lg border-0 p-1'>
        {summary.connectedChains === 0 ? (
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
            {summary.connectedChains > 0 &&
              connectionStatuses.find((s) => s.status === 'connected')
                ?.walletName &&
              walletImages[
                connectionStatuses.find((s) => s.status === 'connected')!
                  .walletName!
              ] && (
                <Image
                  src={
                    walletImages[
                      connectionStatuses.find((s) => s.status === 'connected')!
                        .walletName!
                    ]
                  }
                  alt={
                    connectionStatuses.find((s) => s.status === 'connected')!
                      .walletName!
                  }
                  width={24}
                  height={24}
                  className='h-6 w-6'
                />
              )}
            <div className='flex items-center gap-2'>
              <p className='glass-ultra-light rounded-lg p-2 font-mono text-sm'>
                {summary.connectedChains}/{summary.totalChains} chains
              </p>
              {summary.failedChains > 0 && (
                <div className='flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
                  {summary.failedChains}
                </div>
              )}
              {summary.connectingChains > 0 && (
                <div className='flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 text-xs text-white'>
                  {summary.connectingChains}
                </div>
              )}
            </div>
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
        <div className='bright-card ultra-soft-shadow absolute right-0 top-14 z-50 w-[450px] rounded-xl border-0 p-4 shadow-2xl'>
          <div className='mb-4 flex justify-between'>
            <h3 className='font-semibold text-gray-800'>Chain Connections</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className='text-gray-500 hover:text-gray-700'
            >
              ✕
            </button>
          </div>

          {/* Connection Summary */}
          <div className='mb-4 rounded-lg bg-gray-50 p-3'>
            <div className='flex items-center justify-between text-sm'>
              <span className='text-gray-600'>Connection Status:</span>
              <div className='flex items-center gap-2'>
                <span className='flex items-center gap-1 text-green-600'>
                  <div className='h-2 w-2 rounded-full bg-green-500'></div>
                  {summary.connectedChains} connected
                </span>
                {summary.failedChains > 0 && (
                  <span className='flex items-center gap-1 text-red-600'>
                    <div className='h-2 w-2 rounded-full bg-red-500'></div>
                    {summary.failedChains} failed
                  </span>
                )}
                {summary.connectingChains > 0 && (
                  <span className='flex items-center gap-1 text-yellow-600'>
                    <div className='h-2 w-2 rounded-full bg-yellow-500'></div>
                    {summary.connectingChains} connecting
                  </span>
                )}
              </div>
            </div>
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
            {summary.failedChains > 0 && (
              <button
                onClick={handleRetryFailed}
                disabled={isConnecting}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isConnecting
                    ? 'cursor-not-allowed bg-gray-400 text-white'
                    : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg hover:shadow-xl'
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
                    d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                  />
                </svg>
                Retry Failed
              </button>
            )}
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
            {connectionStatuses.map((status, index) => (
              <div
                key={status.chainName}
                className='glass-ultra-light mb-2 flex items-center justify-between rounded-lg border-0 p-3'
              >
                <div className='flex items-center gap-2'>
                  <div
                    className={`h-3 w-3 rounded-full ${
                      status.status === 'connected'
                        ? 'bg-green-500'
                        : status.status === 'connecting'
                          ? 'animate-pulse bg-yellow-500'
                          : status.status === 'failed'
                            ? 'bg-red-500'
                            : 'bg-gray-300'
                    }`}
                  />
                  <span className='font-medium capitalize text-gray-800'>
                    {status.chainName}
                  </span>
                  {status.walletName && (
                    <span className='text-xs text-gray-500'>
                      ({status.walletName})
                    </span>
                  )}
                </div>
                <div className='flex items-center gap-2'>
                  {status.status === 'connected' ? (
                    <>
                      <span className='text-xs text-gray-500'>
                        {status.address?.slice(0, 8)}...
                        {status.address?.slice(-6)}
                      </span>
                      <button
                        onClick={() => disconnectSingleChain(status.chainName)}
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
                  ) : status.status === 'failed' ? (
                    <div className='flex items-center gap-2'>
                      <span className='text-xs text-red-500'>
                        {status.error || 'Failed'}
                      </span>
                      <button
                        onClick={() => connectSingleChain(status.chainName)}
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
                            d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                          />
                        </svg>
                        Retry
                      </button>
                    </div>
                  ) : status.status === 'connecting' ? (
                    <div className='flex items-center gap-2'>
                      <div className='h-3 w-3 animate-spin rounded-full border-b-2 border-blue-500'></div>
                      <span className='text-xs text-blue-500'>
                        Connecting...
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => connectSingleChain(status.chainName)}
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
