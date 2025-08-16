import React, { useEffect, useRef, useState } from 'react';
import { TransakWidget } from './TransakWidget';

interface TransakModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Transak-specific props
  defaultCryptoCurrency?: string;
  defaultFiatCurrency?: string;
  walletAddress?: string;
  cryptoCurrencyList?: string[];
  fiatCurrencyList?: string[];
  countryCode?: string;
  language?: string;
  theme?: 'light' | 'dark';
  apiKey?: string;
  environment?: 'STAGING' | 'PRODUCTION';
  // Event handlers
  onOrderCreated?: (orderData: any) => void;
  onOrderSuccessful?: (orderData: any) => void;
  onWidgetClose?: () => void;
  onError?: (error: any) => void;
}

/**
 * TransakModal - A custom modal wrapper for Transak that provides click-outside-to-close functionality
 *
 * This component wraps the Transak widget in a modal with proper backdrop and close behavior.
 *
 * @param props - Configuration options for the Transak modal
 * @param props.isOpen - Whether the modal is open
 * @param props.onClose - Callback when modal should close
 * @param props.defaultCryptoCurrency - Default crypto currency to show
 * @param props.defaultFiatCurrency - Default fiat currency to show
 * @param props.walletAddress - User's wallet address to pre-fill
 * @param props.cryptoCurrencyList - List of available crypto currencies
 * @param props.fiatCurrencyList - List of available fiat currencies
 * @param props.countryCode - User's country code
 * @param props.language - Language for the widget
 * @param props.theme - Theme for the widget
 * @param props.apiKey - Transak API key
 * @param props.environment - Environment to use
 *
 * @example
 * // Basic usage
 * <TransakModal
 *   isOpen={showTransak}
 *   onClose={() => setShowTransak(false)}
 *   defaultCryptoCurrency="ETH"
 * />
 */
export function TransakModal({
  isOpen,
  onClose,
  defaultCryptoCurrency,
  defaultFiatCurrency = 'USD',
  walletAddress,
  cryptoCurrencyList,
  fiatCurrencyList,
  countryCode,
  language = 'en',
  theme = 'light',
  apiKey,
  environment = 'PRODUCTION',
  onOrderCreated,
  onOrderSuccessful,
  onWidgetClose,
  onError,
}: TransakModalProps) {
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

  const handleOrderSuccessful = (orderData: any) => {
    console.log('Transak order successful:', orderData);
    onOrderSuccessful?.(orderData);
    // Close modal after successful order
    handleClose();
  };

  const handleWidgetClose = () => {
    console.log('Transak widget closed');
    onWidgetClose?.();
    handleClose();
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

        {/* Transak Widget */}
        <div className='p-4'>
          <TransakWidget
            apiKey={apiKey}
            environment={environment}
            defaultCryptoCurrency={defaultCryptoCurrency}
            defaultFiatCurrency={defaultFiatCurrency}
            walletAddress={walletAddress}
            cryptoCurrencyList={cryptoCurrencyList}
            fiatCurrencyList={fiatCurrencyList}
            countryCode={countryCode}
            language={language}
            theme={theme}
            onOrderCreated={onOrderCreated}
            onOrderSuccessful={handleOrderSuccessful}
            onWidgetClose={handleWidgetClose}
            onError={(error) => {
              console.error('Transak error:', error);
              onError?.(error);
            }}
          />
        </div>
      </div>
    </div>
  );
}
