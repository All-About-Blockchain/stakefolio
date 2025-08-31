import { useEffect, useState } from 'react';

export interface WalletDetectionResult {
  isChecked: boolean;
  detectedWallets: string[];
  hasAnyWallet: boolean;
}

export function useCosmosWalletDetection(): WalletDetectionResult {
  const [isChecked, setIsChecked] = useState(false);
  const [detectedWallets, setDetectedWallets] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const found: string[] = [];
    try {
      // Keplr injects window.keplr
      if ((window as any).keplr) {
        found.push('keplr');
      }
      // Leap injects window.leap
      if ((window as any).leap) {
        found.push('leap');
      }
      // Cosmostation injects window.cosmostation
      if ((window as any).cosmostation) {
        found.push('cosmostation');
      }
      // OKX Wallet injects window.okxwallet
      if ((window as any).okxwallet) {
        found.push('okx');
      }
      // MetaMask injects window.ethereum
      if ((window as any).ethereum) {
        found.push('metamask');
      }
      // Station Wallet (Terra) injects window.station
      if ((window as any).station) {
        found.push('station');
      }
      // XDEFI Wallet injects window.xfi
      if ((window as any).xfi) {
        found.push('xdefi');
      }
    } catch {
      // ignore detection errors
    }

    setDetectedWallets(found);
    setIsChecked(true);
  }, []);

  return {
    isChecked,
    detectedWallets,
    hasAnyWallet: detectedWallets.length > 0,
  };
}
