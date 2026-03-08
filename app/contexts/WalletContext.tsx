import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { usePrivy } from '@privy-io/react-auth';

type WalletId =
  | 'privy'
  | 'keplr'
  | 'cosmostation'
  | 'leap'
  | 'okx'
  | 'metamask'
  | 'station'
  | 'xdefi'
  | null;

interface WalletContextValue {
  address: string | null;
  connectedWallet: WalletId;
  isConnecting: boolean;
  isProMode: boolean;
  toggleProMode: () => void;
  // Privy (primary)
  connectPrivy: () => void;
  // Extension wallets (pro mode only)
  connectKeplr: () => Promise<void>;
  connectCosmostation: () => Promise<void>;
  connectLeap: () => Promise<void>;
  connectOkx: () => Promise<void>;
  connectMetaMask: () => Promise<void>;
  connectStation: () => Promise<void>;
  connectXdefi: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

const DEFAULT_CHAIN = 'cosmoshub';
const STORAGE_KEY = 'stakefolio:wallet-session';
const PRO_MODE_KEY = 'stakefolio:pro-mode';

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [extensionAddress, setExtensionAddress] = useState<string | null>(null);
  const [privyAddress, setPrivyAddress] = useState<string | null>(null);
  const [connectedWallet, setConnectedWallet] = useState<WalletId>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isProMode, setIsProMode] = useState(false);

  const { login, logout, authenticated, ready, user } = usePrivy();

  // Load pro mode preference from localStorage
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(PRO_MODE_KEY);
      if (stored === 'true') setIsProMode(true);
    } catch {}
  }, []);

  const toggleProMode = useCallback(() => {
    setIsProMode((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(PRO_MODE_KEY, String(next));
      } catch {}
      return next;
    });
  }, []);

  // Helper: extract EVM wallet address from Privy user's linked accounts
  const getPrivyWalletAddress = useCallback(
    (privyUser: typeof user): string | null => {
      if (!privyUser?.linkedAccounts) return null;
      // Find the first EVM wallet in linked accounts
      const walletAccount = privyUser.linkedAccounts.find(
        (account: any) =>
          account.type === 'wallet' && account.chainType === 'ethereum'
      ) as any;
      if (walletAccount?.address) return walletAccount.address;
      // Fallback: any wallet account
      const anyWallet = privyUser.linkedAccounts.find(
        (account: any) => account.type === 'wallet'
      ) as any;
      return anyWallet?.address || null;
    },
    []
  );

  // Sync Privy auth state → wallet context
  useEffect(() => {
    if (!ready) return;

    if (authenticated && user) {
      // Only auto-set if not already connected via extension wallet
      if (connectedWallet && connectedWallet !== 'privy') return;

      const walletAddr = getPrivyWalletAddress(user);
      if (walletAddr) {
        setConnectedWallet('privy');
        setPrivyAddress(walletAddr);
        setExtensionAddress(null);
      } else {
        // User is authenticated but no wallet yet — still mark as privy connected
        // (embedded wallet may be creating asynchronously)
        setConnectedWallet('privy');
        setPrivyAddress(null);
        setExtensionAddress(null);
      }
    } else if (!authenticated && connectedWallet === 'privy') {
      // User logged out of Privy
      setConnectedWallet(null);
      setPrivyAddress(null);
      setExtensionAddress(null);
    }
  }, [ready, authenticated, user, connectedWallet, getPrivyWalletAddress]);

  // Derive the effective address
  const address = useMemo(() => {
    if (connectedWallet === 'privy') {
      return privyAddress;
    }
    return extensionAddress;
  }, [connectedWallet, privyAddress, extensionAddress]);

  // Restore extension wallet session
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const { wallet, address: storedAddress } = JSON.parse(raw) as {
          wallet: WalletId;
          address?: string;
        };
        // Only restore non-privy sessions (Privy handles its own persistence)
        if (wallet && wallet !== 'privy' && storedAddress) {
          setConnectedWallet(wallet);
          setExtensionAddress(storedAddress);
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

  // --- Privy connection ---
  const connectPrivy = useCallback(() => {
    login();
  }, [login]);

  // --- Extension wallet connections (pro mode) ---
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
      if (addr) setExtensionAddress(addr);
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
      if (addr) setExtensionAddress(addr);
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
      if (addr) setExtensionAddress(addr);
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
      const accounts = await w.okxwallet.request({
        method: 'eth_requestAccounts',
      });
      if (accounts && accounts.length > 0) {
        const addr = accounts[0];
        setConnectedWallet('okx');
        setExtensionAddress(addr);
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
      const accounts = await w.ethereum.request({
        method: 'eth_requestAccounts',
      });
      if (accounts && accounts.length > 0) {
        const addr = accounts[0];
        setConnectedWallet('metamask');
        setExtensionAddress(addr);
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
      const result = await w.station.connect();
      if (result && result.address) {
        setConnectedWallet('station');
        setExtensionAddress(result.address);
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
      const result = await w.xfi.request({
        method: 'cosmos_requestAccount',
        params: { chainName: DEFAULT_CHAIN },
      });
      if (result && result.address) {
        setConnectedWallet('xdefi');
        setExtensionAddress(result.address);
        persist('xdefi', result.address);
      }
    } finally {
      setIsConnecting(false);
    }
  }, [persist]);

  const disconnect = useCallback(async () => {
    if (connectedWallet === 'privy') {
      await logout();
    }
    setConnectedWallet(null);
    setExtensionAddress(null);
    persist(null, null);
  }, [connectedWallet, logout, persist]);

  const value = useMemo<WalletContextValue>(
    () => ({
      address,
      connectedWallet,
      isConnecting,
      isProMode,
      toggleProMode,
      connectPrivy,
      connectKeplr,
      connectCosmostation,
      connectLeap,
      connectOkx,
      connectMetaMask,
      connectStation,
      connectXdefi,
      disconnect,
    }),
    [
      address,
      connectedWallet,
      isConnecting,
      isProMode,
      toggleProMode,
      connectPrivy,
      connectKeplr,
      connectCosmostation,
      connectLeap,
      connectOkx,
      connectMetaMask,
      connectStation,
      connectXdefi,
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
