import React, { useEffect, useRef, useState } from 'react';
import { RampWidget } from './RampWidget';

interface RampModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Ramp-specific props
  swapAsset?: string;
  defaultAsset?: string;
  chainName?: string;
  userAddress?: string;
  hostAppName?: string;
  hostLogoUrl?: string;
}

/**
 * RampModal - A custom modal wrapper for Ramp that provides click-outside-to-close functionality
 *
 * This component wraps the Ramp widget in a modal with proper backdrop and close behavior.
 *
 * @param props - Configuration options for the Ramp modal
 * @param props.isOpen - Whether the modal is open
 * @param props.onClose - Callback when modal should close
 * @param props.swapAsset - Ramp asset selection string
 * @param props.defaultAsset - Ramp default asset
 * @param props.chainName - Ramp chain name for asset mapping
 * @param props.userAddress - User's wallet address
 * @param props.hostAppName - Host app name
 * @param props.hostLogoUrl - Host logo URL
 *
 * @example
 * // Basic usage
 * <RampModal
 *   isOpen={showRamp}
 *   onClose={() => setShowRamp(false)}
 *   chainName="osmosis"
 * />
 */
export function RampModal({
  isOpen,
  onClose,
  swapAsset,
  defaultAsset,
  chainName,
  userAddress,
  hostAppName,
  hostLogoUrl,
}: RampModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle click outside
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    // Small delay to allow for closing animation
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 150);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-150 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`relative rounded-lg bg-white shadow-xl transition-transform duration-150 ${
          isClosing ? 'scale-95' : 'scale-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className='absolute right-4 top-4 z-10 p-2 text-gray-500 transition-colors hover:text-gray-700'
          aria-label='Close modal'
        >
          <svg
            className='h-6 w-6'
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
        </button>

        {/* Ramp Widget */}
        <div className='p-4'>
          <RampWidget
            variant='embedded-desktop'
            userAddress={userAddress}
            swapAsset={swapAsset}
            defaultAsset={defaultAsset}
            chainName={chainName}
            hostAppName={hostAppName}
            hostLogoUrl={hostLogoUrl}
          />
        </div>
      </div>
    </div>
  );
}
