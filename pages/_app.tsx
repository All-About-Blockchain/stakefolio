import type { AppProps } from 'next/app';
import '@/app/globals.css';
import '@interchain-ui/react/styles';

import { PrivyProvider } from '@privy-io/react-auth';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import {
  ToastProvider,
  ToastContainer,
  useToast,
} from '@/app/contexts/ToastContext';
import { WalletProvider } from '@/app/contexts/WalletContext';

function AppContent({
  Component,
  pageProps,
}: {
  Component: AppProps['Component'];
  pageProps: AppProps['pageProps'];
}) {
  const { toasts, removeToast } = useToast();

  return (
    <div className='relative min-h-screen overflow-hidden'>
      {/* Floating Background Elements */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='gradient-primary floating-card absolute left-10 top-20 h-80 w-80 rounded-full opacity-50 blur-3xl'></div>
        <div
          className='gradient-accent floating-card absolute right-20 top-40 h-60 w-60 rounded-full opacity-40 blur-3xl'
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className='gradient-warm floating-card absolute bottom-20 left-1/3 h-72 w-72 rounded-full opacity-35 blur-3xl'
          style={{ animationDelay: '4s' }}
        ></div>
        <div
          className='gradient-cool floating-card absolute right-1/4 top-1/2 h-48 w-48 rounded-full opacity-30 blur-2xl'
          style={{ animationDelay: '6s' }}
        ></div>
        <div
          className='gradient-cosmic floating-card absolute left-1/2 top-10 h-40 w-40 rounded-full opacity-45 blur-2xl'
          style={{ animationDelay: '8s' }}
        ></div>
      </div>

      <div className='relative z-10'>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
}

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'all-users',
          },
        },
        appearance: {
          walletChainType: 'ethereum-only',
          theme: 'light',
          accentColor: '#8B5CF6',
        },
      }}
    >
      <ToastProvider>
        <WalletProvider>
          <AppContent Component={Component} pageProps={pageProps} />
        </WalletProvider>
      </ToastProvider>
    </PrivyProvider>
  );
}
