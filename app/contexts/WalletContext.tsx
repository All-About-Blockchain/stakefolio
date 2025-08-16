import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type WalletId = 'keplr' | 'cosmostation' | 'leap' | null;

interface WalletContextValue {
  address: string | null;
  connectedWallet: WalletId;
  isConnecting: boolean;
  connectKeplr: () => Promise<void>;
  connectCosmostation: () => Promise<void>;
  connectLeap: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

const DEFAULT_CHAIN = 'cosmoshub';
const STORAGE_KEY = 'stakefolio:wallet-session';

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [connectedWallet, setConnectedWallet] = useState<WalletId>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Restore last session (best-effort; extensions may still require user action)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const { wallet, address: storedAddress } = JSON.parse(raw) as {
          wallet: WalletId;
          address?: string;
        };
        if (wallet && storedAddress) {
          setConnectedWallet(wallet);
          setAddress(storedAddress);
        }
      }
    } catch {}
  }, []);

  const persist = useCallback((wallet: WalletId, addr: string | null) => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ wallet, address: addr })
      );
    } catch {}
  }, []);

  const connectKeplr = useCallback(async () => {
    setIsConnecting(true);
    try {
      const w = window as any;
      if (!w.keplr) throw new Error('Keplr not detected');
      await w.keplr.enable(DEFAULT_CHAIN);
      let addr: string | null = null;
      if (typeof w.keplr.getKey === 'function') {
        const key = await w.keplr.getKey(DEFAULT_CHAIN);
        addr = key?.bech32Address || null;
      }
      if (!addr && typeof w.getOfflineSigner === 'function') {
        const signer = w.getOfflineSigner(DEFAULT_CHAIN);
        const accounts = await signer.getAccounts();
        addr = accounts?.[0]?.address || null;
      }
      setConnectedWallet('keplr');
      if (addr) setAddress(addr);
      persist('keplr', addr);
    } finally {
      setIsConnecting(false);
    }
  }, [persist]);

  const connectCosmostation = useCallback(async () => {
    setIsConnecting(true);
    try {
      const w = window as any;
      if (!w.cosmostation?.cosmos) throw new Error('Cosmostation not detected');
      const res = await w.cosmostation.cosmos.request({
        method: 'cos_requestAccount',
        params: { chainName: DEFAULT_CHAIN },
      });
      const addr: string | null = res?.address || res?.bech32Address || null;
      setConnectedWallet('cosmostation');
      if (addr) setAddress(addr);
      persist('cosmostation', addr);
    } finally {
      setIsConnecting(false);
    }
  }, [persist]);

  const connectLeap = useCallback(async () => {
    setIsConnecting(true);
    try {
      const w = window as any;
      if (!w.leap) throw new Error('Leap not detected');
      await w.leap.enable(DEFAULT_CHAIN);
      let addr: string | null = null;
      if (typeof w.leap.getKey === 'function') {
        const key = await w.leap.getKey(DEFAULT_CHAIN);
        addr = key?.bech32Address || null;
      }
      if (!addr && typeof w.getOfflineSigner === 'function') {
        const signer = w.getOfflineSigner(DEFAULT_CHAIN);
        const accounts = await signer.getAccounts();
        addr = accounts?.[0]?.address || null;
      }
      setConnectedWallet('leap');
      if (addr) setAddress(addr);
      persist('leap', addr);
    } finally {
      setIsConnecting(false);
    }
  }, [persist]);

  const disconnect = useCallback(async () => {
    setConnectedWallet(null);
    setAddress(null);
    persist(null, null);
  }, [persist]);

  const value = useMemo<WalletContextValue>(
    () => ({
      address,
      connectedWallet,
      isConnecting,
      connectKeplr,
      connectCosmostation,
      connectLeap,
      disconnect,
    }),
    [
      address,
      connectedWallet,
      isConnecting,
      connectKeplr,
      connectCosmostation,
      connectLeap,
      disconnect,
    ]
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
