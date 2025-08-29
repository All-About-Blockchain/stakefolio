import { useState, useCallback, useEffect } from 'react';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { stringToPath } from '@cosmjs/crypto';

export interface BrowserWallet {
  address: string;
  mnemonic: string;
  name: string;
  createdAt: number;
}

export interface BrowserWalletState {
  wallets: BrowserWallet[];
  activeWallet: BrowserWallet | null;
  isCreating: boolean;
  isInitialized: boolean;
}

const STORAGE_KEY = 'stakefolio:browser-wallets';
const ACTIVE_WALLET_KEY = 'stakefolio:active-browser-wallet';

export function useBrowserWallet() {
  const [state, setState] = useState<BrowserWalletState>({
    wallets: [],
    activeWallet: null,
    isCreating: false,
    isInitialized: false,
  });

  // Load wallets from localStorage on mount
  useEffect(() => {
    try {
      const storedWallets = localStorage.getItem(STORAGE_KEY);
      const storedActiveWallet = localStorage.getItem(ACTIVE_WALLET_KEY);

      if (storedWallets) {
        const wallets = JSON.parse(storedWallets) as BrowserWallet[];
        setState((prev) => ({ ...prev, wallets, isInitialized: true }));
      }

      if (storedActiveWallet) {
        const activeWallet = JSON.parse(storedActiveWallet) as BrowserWallet;
        setState((prev) => ({ ...prev, activeWallet, isInitialized: true }));
      }
    } catch (error) {
      console.error('Failed to load browser wallets:', error);
      setState((prev) => ({ ...prev, isInitialized: true }));
    }
  }, []);

  const saveWallets = useCallback((wallets: BrowserWallet[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets));
    } catch (error) {
      console.error('Failed to save wallets:', error);
    }
  }, []);

  const saveActiveWallet = useCallback((wallet: BrowserWallet | null) => {
    try {
      if (wallet) {
        localStorage.setItem(ACTIVE_WALLET_KEY, JSON.stringify(wallet));
      } else {
        localStorage.removeItem(ACTIVE_WALLET_KEY);
      }
    } catch (error) {
      console.error('Failed to save active wallet:', error);
    }
  }, []);

  const createWallet = useCallback(
    async (name: string = 'Quick Wallet'): Promise<BrowserWallet> => {
      setState((prev) => ({ ...prev, isCreating: true }));

      try {
        // Generate a new wallet using CosmJS
        const wallet = await DirectSecp256k1HdWallet.generate(24, {
          prefix: 'cosmos',
          hdPaths: [stringToPath("m/44'/118'/0'/0/0")],
        });

        const accounts = await wallet.getAccounts();
        const address = accounts[0].address;
        const mnemonic = await wallet.mnemonic;

        if (!mnemonic) {
          throw new Error('Failed to generate mnemonic');
        }

        const newWallet: BrowserWallet = {
          address,
          mnemonic,
          name,
          createdAt: Date.now(),
        };

        setState((prev) => {
          const updatedWallets = [...prev.wallets, newWallet];
          saveWallets(updatedWallets);
          return {
            ...prev,
            wallets: updatedWallets,
            activeWallet: newWallet,
            isCreating: false,
          };
        });

        saveActiveWallet(newWallet);
        return newWallet;
      } catch (error) {
        setState((prev) => ({ ...prev, isCreating: false }));
        throw error;
      }
    },
    [saveWallets, saveActiveWallet]
  );

  const importWallet = useCallback(
    async (
      mnemonic: string,
      name: string = 'Imported Wallet'
    ): Promise<BrowserWallet> => {
      setState((prev) => ({ ...prev, isCreating: true }));

      try {
        // Validate and import the mnemonic
        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
          prefix: 'cosmos',
          hdPaths: [stringToPath("m/44'/118'/0'/0/0")],
        });

        const accounts = await wallet.getAccounts();
        const address = accounts[0].address;

        const importedWallet: BrowserWallet = {
          address,
          mnemonic,
          name,
          createdAt: Date.now(),
        };

        setState((prev) => {
          const updatedWallets = [...prev.wallets, importedWallet];
          saveWallets(updatedWallets);
          return {
            ...prev,
            wallets: updatedWallets,
            activeWallet: importedWallet,
            isCreating: false,
          };
        });

        saveActiveWallet(importedWallet);
        return importedWallet;
      } catch (error) {
        setState((prev) => ({ ...prev, isCreating: false }));
        throw error;
      }
    },
    [saveWallets, saveActiveWallet]
  );

  const selectWallet = useCallback(
    (wallet: BrowserWallet) => {
      setState((prev) => ({ ...prev, activeWallet: wallet }));
      saveActiveWallet(wallet);
    },
    [saveActiveWallet]
  );

  const deleteWallet = useCallback(
    (address: string) => {
      setState((prev) => {
        const updatedWallets = prev.wallets.filter(
          (w) => w.address !== address
        );
        saveWallets(updatedWallets);

        // If we're deleting the active wallet, clear it
        const newActiveWallet =
          prev.activeWallet?.address === address ? null : prev.activeWallet;
        saveActiveWallet(newActiveWallet);

        return {
          ...prev,
          wallets: updatedWallets,
          activeWallet: newActiveWallet,
        };
      });
    },
    [saveWallets, saveActiveWallet]
  );

  const clearAllWallets = useCallback(() => {
    setState((prev) => ({
      ...prev,
      wallets: [],
      activeWallet: null,
    }));
    saveWallets([]);
    saveActiveWallet(null);
  }, [saveWallets, saveActiveWallet]);

  return {
    ...state,
    createWallet,
    importWallet,
    selectWallet,
    deleteWallet,
    clearAllWallets,
  };
}
