import { useEffect, useRef, useState } from 'react';

type TransakSDKType = any;

interface TransakWidgetProps {
  apiKey?: string;
  environment?: 'STAGING' | 'PRODUCTION';
  defaultCryptoCurrency?: string;
  defaultFiatCurrency?: string;
  walletAddress?: string;
  cryptoCurrencyList?: string[];
  fiatCurrencyList?: string[];
  countryCode?: string;
  language?: string;
  theme?: 'light' | 'dark';
  onOrderCreated?: (orderData: any) => void;
  onOrderSuccessful?: (orderData: any) => void;
  onWidgetClose?: () => void;
  onError?: (error: any) => void;
}

/**
 * TransakWidget - A React component that integrates Transak's on-ramp functionality
 *
 * This component provides a seamless way for users to buy crypto assets directly
 * within your application using Transak's services.
 *
 * @param props - Configuration options for the Transak widget
 * @param props.apiKey - Your Transak API key (defaults to env var)
 * @param props.environment - Environment to use ('STAGING' | 'PRODUCTION')
 * @param props.defaultCryptoCurrency - Default crypto currency to show
 * @param props.defaultFiatCurrency - Default fiat currency to show
 * @param props.walletAddress - User's wallet address to pre-fill
 * @param props.cryptoCurrencyList - List of available crypto currencies
 * @param props.fiatCurrencyList - List of available fiat currencies
 * @param props.countryCode - User's country code
 * @param props.language - Language for the widget
 * @param props.theme - Theme for the widget ('light' | 'dark')
 * @param props.onOrderCreated - Callback when order is created
 * @param props.onOrderSuccessful - Callback when order is successful
 * @param props.onWidgetClose - Callback when widget is closed
 * @param props.onError - Callback for errors
 *
 * @example
 * // Basic usage with default settings
 * <TransakWidget />
 *
 * // With specific configuration
 * <TransakWidget
 *   defaultCryptoCurrency="ETH"
 *   defaultFiatCurrency="USD"
 *   walletAddress="0x1234..."
 *   cryptoCurrencyList={["ETH", "USDC", "MATIC"]}
 * />
 *
 * // With event handlers
 * <TransakWidget
 *   onOrderSuccessful={(orderData) => console.log('Order successful:', orderData)}
 *   onWidgetClose={() => console.log('Widget closed')}
 * />
 */
export function TransakWidget({
  apiKey,
  environment = 'PRODUCTION',
  defaultCryptoCurrency,
  defaultFiatCurrency = 'USD',
  walletAddress,
  cryptoCurrencyList,
  fiatCurrencyList,
  countryCode,
  language = 'en',
  theme = 'light',
  onOrderCreated,
  onOrderSuccessful,
  onWidgetClose,
  onError,
}: TransakWidgetProps) {
  const transakInstanceRef = useRef<TransakSDKType | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(typeof window !== 'undefined');
  }, []);

  useEffect(() => {
    if (!isReady) return;

    let cancelled = false;

    async function initTransak() {
      try {
        const { Transak } = await import('@transak/transak-sdk');
        if (cancelled) return;
        if (!Transak) return;

        const finalApiKey = apiKey || process.env.NEXT_PUBLIC_TRANSAK_API_KEY;
        if (!finalApiKey) {
          console.warn(
            'Transak API key not provided. Please set NEXT_PUBLIC_TRANSAK_API_KEY or pass apiKey prop.'
          );
          return;
        }

        // Build Transak configuration
        const transakConfig: any = {
          apiKey: finalApiKey,
          environment: Transak.ENVIRONMENTS[environment],
          defaultFiatCurrency,
          language,
          theme,
        };

        // Add optional parameters if provided
        if (defaultCryptoCurrency) {
          transakConfig.defaultCryptoCurrency = defaultCryptoCurrency;
        }

        if (walletAddress) {
          transakConfig.walletAddress = walletAddress;
        }

        if (cryptoCurrencyList) {
          transakConfig.cryptoCurrencyList = cryptoCurrencyList;
        }

        if (fiatCurrencyList) {
          transakConfig.fiatCurrencyList = fiatCurrencyList;
        }

        if (countryCode) {
          transakConfig.countryCode = countryCode;
        }

        // Initialize Transak
        const transak = new Transak(transakConfig);
        transakInstanceRef.current = transak;

        // Set up event listeners
        Transak.on('*', (data: any) => {
          console.log('Transak event:', data);
        });

        Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
          console.log('Transak SDK closed!');
          onWidgetClose?.();
        });

        Transak.on(Transak.EVENTS.TRANSAK_ORDER_CREATED, (orderData: any) => {
          console.log('Order created:', orderData);
          onOrderCreated?.(orderData);
        });

        Transak.on(
          Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL,
          (orderData: any) => {
            console.log('Order successful:', orderData);
            onOrderSuccessful?.(orderData);
            transak.close();
          }
        );

        Transak.on(Transak.EVENTS.TRANSAK_ORDER_FAILED, (error: any) => {
          console.error('Order failed:', error);
          onError?.(error);
        });

        // Initialize the widget
        transak.init();
      } catch (e) {
        console.error('Failed to load Transak SDK', e);
        onError?.(e);
      }
    }

    initTransak();

    return () => {
      cancelled = true;
      // Cleanup Transak instance
      if (transakInstanceRef.current) {
        try {
          transakInstanceRef.current.close();
        } catch (e) {
          // Ignore cleanup errors
        }
        transakInstanceRef.current = null;
      }
    };
  }, [
    isReady,
    apiKey,
    environment,
    defaultCryptoCurrency,
    defaultFiatCurrency,
    walletAddress,
    cryptoCurrencyList,
    fiatCurrencyList,
    countryCode,
    language,
    theme,
    onOrderCreated,
    onOrderSuccessful,
    onWidgetClose,
    onError,
  ]);

  // Transak creates its own modal/iframe, so we don't need to render anything
  return null;
}
