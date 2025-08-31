import React from 'react';
import { X } from 'lucide-react';

interface RampModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAddress?: string;
  swapAsset?: string;
  defaultAsset?: string;
  chainName?: string;
}

export function RampModal({
  isOpen,
  onClose,
  userAddress,
  swapAsset = 'ETH_*,MATIC_*,USDC_*,OSMO_*',
  defaultAsset = 'OSMO_OSMO',
  chainName = 'osmosis',
}: RampModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl'>
        {/* Header */}
        <div className='mb-6 flex items-center justify-between'>
          <h2 className='text-2xl font-bold text-gray-800'>
            Buy Crypto with Ramp
          </h2>
          <button
            onClick={onClose}
            className='rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700'
          >
            <X className='h-6 w-6' />
          </button>
        </div>

        {/* Content */}
        <div className='space-y-6'>
          <div className='rounded-lg bg-blue-50 p-4'>
            <h3 className='mb-2 font-semibold text-blue-800'>Configuration</h3>
            <div className='space-y-1 text-sm text-blue-700'>
              <p>
                <strong>Chain:</strong> {chainName}
              </p>
              <p>
                <strong>Default Asset:</strong> {defaultAsset}
              </p>
              <p>
                <strong>Available Assets:</strong> {swapAsset}
              </p>
              {userAddress && (
                <p>
                  <strong>Wallet Address:</strong> {userAddress}
                </p>
              )}
            </div>
          </div>

          <div className='rounded-lg bg-amber-50 p-4'>
            <h3 className='mb-2 font-semibold text-amber-800'>Coming Soon</h3>
            <p className='text-sm text-amber-700'>
              Ramp integration is currently being implemented. This modal will
              soon provide direct fiat-to-crypto purchasing capabilities with
              support for multiple chains and assets.
            </p>
          </div>

          <div className='space-y-3'>
            <h3 className='font-semibold text-gray-800'>
              Features Coming Soon:
            </h3>
            <ul className='space-y-2 text-sm text-gray-600'>
              <li>• Direct fiat-to-crypto purchases</li>
              <li>• Support for multiple payment methods</li>
              <li>• Real-time exchange rates</li>
              <li>• Automatic wallet address detection</li>
              <li>• Multi-chain asset support</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className='mt-6 flex justify-end space-x-3'>
          <button
            onClick={onClose}
            className='rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50'
          >
            Close
          </button>
          <button
            onClick={onClose}
            className='rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
