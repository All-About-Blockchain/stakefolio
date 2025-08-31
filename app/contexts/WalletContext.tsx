import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type WalletId =
  | 'keplr'
  | 'cosmostation'
  | 'leap'
  | 'browser'
  | 'okx'
  | 'metamask'
  | 'station'
  | 'xdefi'
  | null;

interface WalletContextValue {
  address: string | null;
  connectedWallet: WalletId;
  isConnecting: boolean;
  connectKeplr: () => Promise<void>;
  connectCosmostation: () => Promise<void>;
  connectLeap: () => Promise<void>;
  connectOkx: () => Promise<void>;
  connectMetaMask: () => Promise<void>;
  connectStation: () => Promise<void>;
  connectXdefi: () => Promise<void>;
  connectBrowserWallet: (address: string) => Promise<void>;
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

  const connectOkx = useCallback(async () => {
    setIsConnecting(true);
    try {
      const w = window as any;
      if (!w.okxwallet) throw new Error('OKX Wallet not detected');

      // Request account access
      const accounts = await w.okxwallet.request({
        method: 'eth_requestAccounts',
      });
      if (accounts && accounts.length > 0) {
        // For Cosmos chains, we might need to use a different method
        // This is a basic implementation - may need adjustment for specific Cosmos support
        const addr = accounts[0];
        setConnectedWallet('okx');
        setAddress(addr);
        persist('okx', addr);
      }
    } finally {
      setIsConnecting(false);
    }
  }, [persist]);

  const connectMetaMask = useCallback(async () => {
    setIsConnecting(true);
    try {
      const w = window as any;
      if (!w.ethereum) throw new Error('MetaMask not detected');

      // Request account access
      const accounts = await w.ethereum.request({
        method: 'eth_requestAccounts',
      });
      if (accounts && accounts.length > 0) {
        // For Cosmos chains, we might need to use a different method
        // This is a basic implementation - may need adjustment for specific Cosmos support
        const addr = accounts[0];
        setConnectedWallet('metamask');
        setAddress(addr);
        persist('metamask', addr);
      }
    } finally {
      setIsConnecting(false);
    }
  }, [persist]);

  const connectStation = useCallback(async () => {
    setIsConnecting(true);
    try {
      const w = window as any;
      if (!w.station) throw new Error('Station Wallet not detected');

      // Request connection to Terra chain
      const result = await w.station.connect();
      if (result && result.address) {
        setConnectedWallet('station');
        setAddress(result.address);
        persist('station', result.address);
      }
    } finally {
      setIsConnecting(false);
    }
  }, [persist]);

  const connectXdefi = useCallback(async () => {
    setIsConnecting(true);
    try {
      const w = window as any;
      if (!w.xfi) throw new Error('XDEFI Wallet not detected');

      // Request connection
      const result = await w.xfi.request({
        method: 'cosmos_requestAccount',
        params: { chainName: DEFAULT_CHAIN },
      });

      if (result && result.address) {
        setConnectedWallet('xdefi');
        setAddress(result.address);
        persist('xdefi', result.address);
      }
    } finally {
      setIsConnecting(false);
    }
  }, [persist]);

  const connectBrowserWallet = useCallback(
    async (browserAddress: string) => {
      setIsConnecting(true);
      try {
        setConnectedWallet('browser');
        setAddress(browserAddress);
        persist('browser', browserAddress);
      } finally {
        setIsConnecting(false);
      }
    },
    [persist]
  );

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
      connectOkx,
      connectMetaMask,
      connectStation,
      connectXdefi,
      connectBrowserWallet,
      disconnect,
    }),
    [
      address,
      connectedWallet,
      isConnecting,
      connectKeplr,
      connectCosmostation,
      connectLeap,
      connectOkx,
      connectMetaMask,
      connectStation,
      connectXdefi,
      connectBrowserWallet,
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
