import { useState } from 'react';
import {
  Zap,
  Download,
  Copy,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { useBrowserWallet } from '../../hooks/useBrowserWallet';
import { useWallet } from '../../contexts/WalletContext';
import { useToast } from '../../contexts/ToastContext';

interface QuickWalletSetupProps {
  onComplete: () => void;
  onBack: () => void;
}

export function QuickWalletSetup({
  onComplete,
  onBack,
}: QuickWalletSetupProps) {
  const { addToast } = useToast();
  const { connectBrowserWallet } = useWallet();
  const {
    wallets,
    activeWallet,
    isCreating,
    createWallet,
    importWallet,
    selectWallet,
  } = useBrowserWallet();

  const [step, setStep] = useState<
    'choice' | 'create' | 'import' | 'backup' | 'complete'
  >('choice');
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [newWallet, setNewWallet] = useState<any>(null);
  const [importMnemonic, setImportMnemonic] = useState('');
  const [walletName, setWalletName] = useState('Quick Wallet');
  const [hasConfirmedBackup, setHasConfirmedBackup] = useState(false);

  const handleCreateWallet = async () => {
    try {
      const wallet = await createWallet(walletName);
      setNewWallet(wallet);
      setStep('backup');
    } catch (error) {
      addToast('Failed to create wallet. Please try again.', 'error');
    }
  };

  const handleImportWallet = async () => {
    if (!importMnemonic.trim()) {
      addToast('Please enter a valid mnemonic phrase', 'warning');
      return;
    }

    try {
      await importWallet(importMnemonic, walletName);
      setStep('complete');
      addToast('Wallet imported successfully!', 'success');
    } catch (error) {
      addToast('Invalid mnemonic phrase. Please check and try again.', 'error');
    }
  };

  const handleConnectWallet = async (wallet: any) => {
    try {
      await connectBrowserWallet(wallet.address);
      selectWallet(wallet);
      onComplete();
    } catch (error) {
      addToast('Failed to connect wallet', 'error');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      addToast('Copied to clipboard!', 'success');
    } catch (error) {
      addToast('Failed to copy to clipboard', 'error');
    }
  };

  const handleComplete = async () => {
    if (newWallet) {
      await handleConnectWallet(newWallet);
    } else if (activeWallet) {
      await handleConnectWallet(activeWallet);
    }
  };

  if (step === 'create') {
    return (
      <div className='space-y-6'>
        <div className='text-center'>
          <h3 className='text-2xl font-bold text-gray-800'>
            Create Quick Wallet
          </h3>
          <p className='mt-2 text-gray-600'>
            Generate a new wallet instantly in your browser
          </p>
        </div>

        <div className='space-y-4'>
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Wallet Name
            </label>
            <input
              type='text'
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
              placeholder='My Quick Wallet'
              className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:outline-none'
            />
          </div>

          <div className='rounded-lg bg-blue-50 p-4'>
            <div className='flex items-start gap-3'>
              <AlertTriangle className='mt-0.5 h-5 w-5 text-blue-600' />
              <div className='text-sm text-blue-800'>
                <p className='mb-1 font-medium'>Important Security Note</p>
                <p>
                  This wallet is stored locally in your browser. Make sure to:
                </p>
                <ul className='mt-2 list-inside list-disc space-y-1'>
                  <li>Back up your recovery phrase securely</li>
                  <li>Don&apos;t share your private keys with anyone</li>
                  <li>Consider using a hardware wallet for large amounts</li>
                </ul>
              </div>
            </div>
          </div>

          <div className='flex gap-3'>
            <button
              onClick={onBack}
              className='flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-700 hover:bg-gray-50'
            >
              Back
            </button>
            <button
              onClick={handleCreateWallet}
              disabled={isCreating || !walletName.trim()}
              className='flex-1 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-3 text-white disabled:opacity-50'
            >
              {isCreating ? 'Creating...' : 'Create Wallet'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'import') {
    return (
      <div className='space-y-6'>
        <div className='text-center'>
          <h3 className='text-2xl font-bold text-gray-800'>
            Import Existing Wallet
          </h3>
          <p className='mt-2 text-gray-600'>
            Import your wallet using a recovery phrase
          </p>
        </div>

        <div className='space-y-4'>
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Wallet Name
            </label>
            <input
              type='text'
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
              placeholder='Imported Wallet'
              className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:outline-none'
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Recovery Phrase (24 words)
            </label>
            <textarea
              value={importMnemonic}
              onChange={(e) => setImportMnemonic(e.target.value)}
              placeholder='Enter your 24-word recovery phrase...'
              rows={4}
              className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:outline-none'
            />
          </div>

          <div className='flex gap-3'>
            <button
              onClick={onBack}
              className='flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-700 hover:bg-gray-50'
            >
              Back
            </button>
            <button
              onClick={handleImportWallet}
              disabled={isCreating || !importMnemonic.trim()}
              className='flex-1 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-3 text-white disabled:opacity-50'
            >
              {isCreating ? 'Importing...' : 'Import Wallet'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'backup' && newWallet) {
    return (
      <div className='space-y-6'>
        <div className='text-center'>
          <h3 className='text-2xl font-bold text-gray-800'>
            Backup Your Wallet
          </h3>
          <p className='mt-2 text-gray-600'>
            Save your recovery phrase in a secure location
          </p>
        </div>

        <div className='rounded-lg border border-amber-200 bg-amber-50 p-4'>
          <div className='flex items-start gap-3'>
            <AlertTriangle className='mt-0.5 h-5 w-5 text-amber-600' />
            <div className='text-sm text-amber-800'>
              <p className='mb-1 font-medium'>⚠️ Critical Security Step</p>
              <p>
                Write down these 24 words and store them securely. Anyone with
                this phrase can access your funds.
              </p>
            </div>
          </div>
        </div>

        <div className='space-y-4'>
          <div className='relative'>
            <div className='mb-2 flex items-center justify-between'>
              <label className='text-sm font-medium text-gray-700'>
                Recovery Phrase
              </label>
              <div className='flex gap-2'>
                <button
                  onClick={() => setShowMnemonic(!showMnemonic)}
                  className='flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800'
                >
                  {showMnemonic ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                  {showMnemonic ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={() => copyToClipboard(newWallet.mnemonic)}
                  className='flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800'
                >
                  <Copy className='h-4 w-4' />
                  Copy
                </button>
              </div>
            </div>

            {showMnemonic ? (
              <div className='grid grid-cols-3 gap-2 rounded-lg border bg-gray-50 p-4'>
                {newWallet.mnemonic
                  .split(' ')
                  .map((word: string, index: number) => (
                    <div key={index} className='font-mono text-sm'>
                      <span className='text-xs text-gray-500'>
                        {index + 1}.
                      </span>{' '}
                      {word}
                    </div>
                  ))}
              </div>
            ) : (
              <div className='rounded-lg border bg-gray-50 p-4 text-center text-gray-500'>
                Click &ldquo;Show&ldquo; to reveal your recovery phrase
              </div>
            )}
          </div>

          <div className='flex items-start gap-3'>
            <input
              type='checkbox'
              id='confirm-backup'
              checked={hasConfirmedBackup}
              onChange={(e) => setHasConfirmedBackup(e.target.checked)}
              className='mt-1'
            />
            <label htmlFor='confirm-backup' className='text-sm text-gray-700'>
              I have written down my recovery phrase and stored it securely
            </label>
          </div>

          <div className='flex gap-3'>
            <button
              onClick={() => setStep('create')}
              className='flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-700 hover:bg-gray-50'
            >
              Back
            </button>
            <button
              onClick={() => setStep('complete')}
              disabled={!hasConfirmedBackup}
              className='flex-1 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-3 text-white disabled:opacity-50'
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className='space-y-6'>
        <div className='text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500'>
            <CheckCircle className='h-8 w-8 text-white' />
          </div>
          <h3 className='text-2xl font-bold text-gray-800'>Wallet Ready!</h3>
          <p className='mt-2 text-gray-600'>
            Your browser wallet is ready to use
          </p>
        </div>

        <div className='rounded-lg bg-emerald-50 p-4'>
          <div className='flex items-center gap-3'>
            <CheckCircle className='h-5 w-5 text-emerald-600' />
            <div className='text-sm text-emerald-800'>
              <p className='font-medium'>Wallet Address</p>
              <p className='mt-1 font-mono text-xs'>
                {(newWallet || activeWallet)?.address}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleComplete}
          className='w-full rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-4 font-semibold text-white transition-all hover:scale-105'
        >
          Connect Wallet & Continue
        </button>
      </div>
    );
  }

  // Default choice step
  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <h3 className='text-2xl font-bold text-gray-800'>Quick Wallet Setup</h3>
        <p className='mt-2 text-gray-600'>
          Create a wallet instantly or import an existing one
        </p>
      </div>

      {/* Existing wallets */}
      {wallets.length > 0 && (
        <div className='space-y-4'>
          <h4 className='font-semibold text-gray-800'>Your Wallets</h4>
          <div className='space-y-3'>
            {wallets.map((wallet) => (
              <div
                key={wallet.address}
                className='flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:border-purple-300'
              >
                <div>
                  <p className='font-medium text-gray-800'>{wallet.name}</p>
                  <p className='font-mono text-sm text-gray-500'>
                    {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
                  </p>
                </div>
                <button
                  onClick={() => handleConnectWallet(wallet)}
                  className='rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 text-sm text-white transition-all hover:scale-105'
                >
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className='grid gap-4 md:grid-cols-2'>
        {/* Create new wallet */}
        <button
          onClick={() => setStep('create')}
          className='flex flex-col items-center gap-4 rounded-xl border border-gray-200 p-6 text-left transition-all hover:scale-[1.02] hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500'
        >
          <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500'>
            <Zap className='h-6 w-6 text-white' />
          </div>
          <div className='text-center'>
            <h4 className='font-semibold text-gray-800'>Create New Wallet</h4>
            <p className='text-sm text-gray-600'>
              Generate a new wallet instantly
            </p>
          </div>
        </button>

        {/* Import wallet */}
        <button
          onClick={() => setStep('import')}
          className='flex flex-col items-center gap-4 rounded-xl border border-gray-200 p-6 text-left transition-all hover:scale-[1.02] hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500'
        >
          <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500'>
            <Download className='h-6 w-6 text-white' />
          </div>
          <div className='text-center'>
            <h4 className='font-semibold text-gray-800'>Import Wallet</h4>
            <p className='text-sm text-gray-600'>
              Import using recovery phrase
            </p>
          </div>
        </button>
      </div>

      <div className='rounded-lg bg-blue-50 p-4'>
        <div className='flex items-start gap-3'>
          <Zap className='mt-0.5 h-5 w-5 text-blue-600' />
          <div className='text-sm text-blue-800'>
            <p className='mb-1 font-medium'>Quick & Secure</p>
            <p>
              Browser wallets are perfect for getting started quickly. Your keys
              are stored locally and never leave your device.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onBack}
        className='w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 hover:bg-gray-50'
      >
        Back to Wallet Options
      </button>
    </div>
  );
}
