import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { usePrivy } from '@privy-io/react-auth';

type WalletId = 'privy' | null;

interface WalletContextValue {
  address: string | null;
  connectedWallet: WalletId;
  connectPrivy: () => void;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

const STORAGE_KEY = 'stakefolio:wallet-session';

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [privyAddress, setPrivyAddress] = useState<string | null>(null);
  const [connectedWallet, setConnectedWallet] = useState<WalletId>(null);

  const { login, logout, authenticated, ready, user } = usePrivy();

  const getPrivyWalletAddress = useCallback(
    (privyUser: typeof user): string | null => {
      if (!privyUser?.linkedAccounts) return null;
      const walletAccount = privyUser.linkedAccounts.find(
        (account: any) =>
          account.type === 'wallet' && account.chainType === 'ethereum'
      ) as any;
      if (walletAccount?.address) return walletAccount.address;
      const anyWallet = privyUser.linkedAccounts.find(
        (account: any) => account.type === 'wallet'
      ) as any;
      return anyWallet?.address || null;
    },
    []
  );

  useEffect(() => {
    if (!ready) return;
    if (authenticated) {
      const walletAddr = user ? getPrivyWalletAddress(user) : null;
      setConnectedWallet('privy');
      setPrivyAddress(walletAddr);
    } else {
      setConnectedWallet(null);
      setPrivyAddress(null);
    }
  }, [ready, authenticated, user, getPrivyWalletAddress]);

  const address = useMemo(() => {
    if (connectedWallet === 'privy') return privyAddress;
    return null;
  }, [connectedWallet, privyAddress]);

  // Drop legacy extension-wallet sessions from earlier app versions
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const { wallet } = JSON.parse(raw) as { wallet: string | null };
        if (wallet && wallet !== 'privy') {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {}
  }, []);

  const connectPrivy = useCallback(() => {
    login();
  }, [login]);

  const disconnect = useCallback(async () => {
    if (connectedWallet === 'privy') {
      await logout();
    }
    setConnectedWallet(null);
    setPrivyAddress(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, [connectedWallet, logout]);

  const value = useMemo<WalletContextValue>(
    () => ({
      address,
      connectedWallet,
      connectPrivy,
      disconnect,
    }),
    [address, connectedWallet, connectPrivy, disconnect]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}
