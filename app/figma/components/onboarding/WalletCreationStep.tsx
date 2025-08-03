import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  ChevronLeft,
  ChevronRight,
  Wallet,
  Shield,
  Copy,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Download,
} from 'lucide-react';

interface WalletCreationStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export function WalletCreationStep({
  onNext,
  onPrevious,
}: WalletCreationStepProps) {
  const [walletType, setWalletType] = useState<'create' | 'import' | 'connect'>(
    'connect'
  );
  const [walletName, setWalletName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [seedPhraseBackup, setSeedPhraseBackup] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string>('');

  // Mock seed phrase generation
  const mockSeedPhrase =
    'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';

  const walletOptions = [
    {
      id: 'keplr',
      name: 'Keplr Wallet',
      description:
        'The most popular Cosmos wallet with extensive ecosystem support',
      icon: '🔮',
      features: [
        'Browser Extension',
        'Mobile App',
        'Hardware Wallet Support',
        'Staking',
      ],
      downloadUrl: 'https://www.keplr.app/',
      isInstalled: false, // In real app, check if extension is installed
    },
    {
      id: 'cosmostation',
      name: 'Cosmostation',
      description:
        'Professional-grade wallet with advanced features and multi-chain support',
      icon: '⚛️',
      features: [
        'Browser Extension',
        'Mobile App',
        'Multi-Chain',
        'Advanced Features',
      ],
      downloadUrl: 'https://cosmostation.io/',
      isInstalled: false,
    },
    {
      id: 'leap',
      name: 'Leap Cosmos Wallet',
      description:
        'Modern, user-friendly wallet designed for the next generation of users',
      icon: '🦘',
      features: [
        'Browser Extension',
        'Mobile App',
        'DeFi Integration',
        'User-Friendly',
      ],
      downloadUrl: 'https://www.leapwallet.io/',
      isInstalled: false,
    },
  ];

  const isCreateFormValid =
    walletName &&
    password &&
    confirmPassword &&
    password === confirmPassword &&
    termsAccepted;
  const isImportFormValid =
    walletName && password && seedPhrase && termsAccepted;
  const isConnectFormValid = selectedWallet && termsAccepted;

  const handleCreateWallet = () => {
    if (walletType === 'create' && !seedPhraseBackup) {
      setShowSeedPhrase(true);
      setSeedPhrase(mockSeedPhrase);
    } else {
      onNext();
    }
  };

  const handleConnectWallet = async (walletId: string) => {
    setSelectedWallet(walletId);
    // In a real app, this would attempt to connect to the wallet
    // For demo purposes, we'll simulate a successful connection
    setTimeout(() => {
      if (termsAccepted) {
        onNext();
      }
    }, 1000);
  };

  return (
    <div className='mx-auto max-w-4xl'>
      <Card className='mb-8'>
        <CardHeader className='text-center'>
          <CardTitle className='mb-4 flex items-center justify-center gap-2 text-2xl'>
            <Wallet className='h-6 w-6' />
            Set Up Your Wallet
          </CardTitle>
          <CardDescription className='text-lg'>
            Choose how you'd like to access the Cosmos ecosystem. Connect an
            existing wallet or create a new one.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className='p-6'>
          <Tabs
            value={walletType}
            onValueChange={(value) =>
              setWalletType(value as 'create' | 'import' | 'connect')
            }
          >
            <TabsList className='mb-6 grid w-full grid-cols-3'>
              <TabsTrigger value='connect'>Connect Wallet</TabsTrigger>
              <TabsTrigger value='create'>Create New Wallet</TabsTrigger>
              <TabsTrigger value='import'>Import Existing Wallet</TabsTrigger>
            </TabsList>

            <TabsContent value='connect'>
              <div className='space-y-6'>
                <div className='mb-6 text-center'>
                  <h3 className='mb-2 text-lg font-semibold'>
                    Connect Your Cosmos Wallet
                  </h3>
                  <p className='text-muted-foreground'>
                    Use your existing wallet to securely access your assets and
                    start staking.
                  </p>
                </div>

                <div className='grid gap-4'>
                  {walletOptions.map((wallet) => (
                    <Card
                      key={wallet.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedWallet === wallet.id
                          ? 'ring-primary shadow-lg ring-2'
                          : 'hover:shadow-md'
                      }`}
                    >
                      <CardContent className='p-6'>
                        <div className='mb-4 flex items-start justify-between'>
                          <div className='flex items-center gap-3'>
                            <div className='text-2xl'>{wallet.icon}</div>
                            <div>
                              <h4 className='font-semibold'>{wallet.name}</h4>
                              <p className='text-muted-foreground text-sm'>
                                {wallet.description}
                              </p>
                            </div>
                          </div>
                          <div className='flex gap-2'>
                            {!wallet.isInstalled && (
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() =>
                                  window.open(wallet.downloadUrl, '_blank')
                                }
                                className='flex items-center gap-1'
                              >
                                <Download className='h-3 w-3' />
                                Install
                              </Button>
                            )}
                            <Button
                              variant={
                                selectedWallet === wallet.id
                                  ? 'default'
                                  : 'outline'
                              }
                              size='sm'
                              onClick={() => handleConnectWallet(wallet.id)}
                              disabled={
                                !wallet.isInstalled &&
                                selectedWallet !== wallet.id
                              }
                            >
                              {selectedWallet === wallet.id
                                ? 'Selected'
                                : 'Connect'}
                            </Button>
                          </div>
                        </div>

                        <div className='flex flex-wrap gap-2'>
                          {wallet.features.map((feature, index) => (
                            <span
                              key={index}
                              className='bg-muted rounded-full px-2 py-1 text-xs'
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {!walletOptions.some((w) => w.isInstalled) && (
                  <Alert>
                    <Download className='h-4 w-4' />
                    <AlertDescription>
                      No wallets detected. Please install a Cosmos wallet
                      extension to continue. We recommend starting with Keplr
                      for the best experience.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>

            <TabsContent value='create'>
              {!showSeedPhrase ? (
                <div className='space-y-6'>
                  <div className='mb-6 text-center'>
                    <h3 className='mb-2 text-lg font-semibold'>
                      Create a New Wallet
                    </h3>
                    <p className='text-muted-foreground'>
                      Generate a new wallet with a secure seed phrase that
                      you'll need to back up safely.
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='walletName'>Wallet Name</Label>
                    <Input
                      id='walletName'
                      placeholder='My Cosmos Wallet'
                      value={walletName}
                      onChange={(e) => setWalletName(e.target.value)}
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='password'>Password</Label>
                    <div className='relative'>
                      <Input
                        id='password'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Enter a strong password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='confirmPassword'>Confirm Password</Label>
                    <Input
                      id='confirmPassword'
                      type='password'
                      placeholder='Confirm your password'
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {confirmPassword && password !== confirmPassword && (
                      <p className='text-destructive text-sm'>
                        Passwords do not match
                      </p>
                    )}
                  </div>

                  <Alert>
                    <Shield className='h-4 w-4' />
                    <AlertDescription>
                      <strong>Security Tip:</strong> Use a strong password that
                      you'll remember. We recommend using at least 12 characters
                      with a mix of letters, numbers, and symbols.
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className='space-y-6'>
                  <div className='mb-6 text-center'>
                    <h3 className='mb-2 text-lg font-semibold'>
                      Your Secret Recovery Phrase
                    </h3>
                    <p className='text-muted-foreground'>
                      Write down these 12 words in order and store them safely.
                      This is the only way to recover your wallet.
                    </p>
                  </div>

                  <Alert className='border-orange-200 bg-orange-50 dark:bg-orange-950/30'>
                    <AlertTriangle className='h-4 w-4 text-orange-600' />
                    <AlertDescription className='text-orange-800 dark:text-orange-200'>
                      <strong>Important:</strong> Your seed phrase is the key to
                      your wallet. Write it down and store it in a safe place.
                      Never share it with anyone.
                    </AlertDescription>
                  </Alert>

                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <Label>Your Seed Phrase</Label>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() =>
                          navigator.clipboard.writeText(seedPhrase)
                        }
                        className='flex items-center gap-2'
                      >
                        <Copy className='h-4 w-4' />
                        Copy
                      </Button>
                    </div>
                    <div className='bg-muted/50 grid grid-cols-3 gap-2 rounded-lg p-4'>
                      {seedPhrase.split(' ').map((word, index) => (
                        <div
                          key={index}
                          className='bg-background flex items-center gap-2 rounded border p-2'
                        >
                          <span className='text-muted-foreground w-4 text-xs'>
                            {index + 1}
                          </span>
                          <span className='font-mono'>{word}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      id='seedPhraseBackup'
                      checked={seedPhraseBackup}
                      onCheckedChange={(checked) =>
                        setSeedPhraseBackup(checked as boolean)
                      }
                    />
                    <Label htmlFor='seedPhraseBackup' className='text-sm'>
                      I have safely stored my seed phrase and understand that
                      losing it means losing access to my wallet
                    </Label>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value='import'>
              <div className='space-y-6'>
                <div className='mb-6 text-center'>
                  <h3 className='mb-2 text-lg font-semibold'>
                    Import Existing Wallet
                  </h3>
                  <p className='text-muted-foreground'>
                    Restore your wallet using your 12 or 24-word seed phrase.
                  </p>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='importWalletName'>Wallet Name</Label>
                  <Input
                    id='importWalletName'
                    placeholder='My Imported Wallet'
                    value={walletName}
                    onChange={(e) => setWalletName(e.target.value)}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='importSeedPhrase'>Seed Phrase</Label>
                  <textarea
                    id='importSeedPhrase'
                    className='border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                    placeholder='Enter your 12 or 24 word seed phrase'
                    value={seedPhrase}
                    onChange={(e) => setSeedPhrase(e.target.value)}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='importPassword'>New Password</Label>
                  <Input
                    id='importPassword'
                    type='password'
                    placeholder='Enter a strong password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <Alert>
                  <Shield className='h-4 w-4' />
                  <AlertDescription>
                    Your seed phrase will be encrypted with your password. Make
                    sure to use a strong password to protect your wallet.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>

          <div className='mt-6 space-y-4'>
            <div className='flex items-center space-x-2'>
              <Checkbox
                id='terms'
                checked={termsAccepted}
                onCheckedChange={(checked) =>
                  setTermsAccepted(checked as boolean)
                }
              />
              <Label htmlFor='terms' className='text-sm'>
                I accept the{' '}
                <a href='#' className='text-primary hover:underline'>
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href='#' className='text-primary hover:underline'>
                  Privacy Policy
                </a>
              </Label>
            </div>

            {((walletType === 'create' && isCreateFormValid) ||
              (walletType === 'import' && isImportFormValid) ||
              (walletType === 'connect' && isConnectFormValid)) && (
              <Alert className='border-green-200 bg-green-50 dark:bg-green-950/30'>
                <CheckCircle className='h-4 w-4 text-green-600' />
                <AlertDescription className='text-green-800 dark:text-green-200'>
                  Ready to{' '}
                  {walletType === 'create'
                    ? 'create'
                    : walletType === 'import'
                      ? 'import'
                      : 'connect'}{' '}
                  your wallet!
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      <div className='mt-8 flex justify-between'>
        <Button
          variant='outline'
          onClick={onPrevious}
          className='flex items-center gap-2'
        >
          <ChevronLeft className='h-4 w-4' />
          Previous
        </Button>
        <Button
          onClick={handleCreateWallet}
          disabled={
            (walletType === 'create' &&
              (!isCreateFormValid || (showSeedPhrase && !seedPhraseBackup))) ||
            (walletType === 'import' && !isImportFormValid) ||
            (walletType === 'connect' && !isConnectFormValid)
          }
          className='flex items-center gap-2'
        >
          {walletType === 'create'
            ? showSeedPhrase
              ? 'Create Wallet'
              : 'Generate Seed Phrase'
            : walletType === 'import'
              ? 'Import Wallet'
              : 'Continue with Wallet'}
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
