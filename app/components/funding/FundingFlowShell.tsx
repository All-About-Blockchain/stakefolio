import { useMemo, useState } from 'react';
import {
  SUPPORTED_CHAINS,
  getAssetsForChain,
  getChainById,
  getRampAssetParams,
  rampUserAddressForChainFamily,
} from '@/app/config/funding';
import { useWallet } from '@/app/contexts/WalletContext';
import { getStrategyForChainFamily } from '@/app/lib/funding/chainStrategies';
import RampWidgetFrame from './RampWidgetFrame';

type FundingTab = 'deposit' | 'withdraw';
type FundingMethod = 'bank' | 'wallet';

type FundingFlowShellProps = {
  initialTab?: FundingTab;
  initialChainId?: string;
  initialAssetSymbol?: string;
};

export default function FundingFlowShell({
  initialTab = 'deposit',
  initialChainId = 'ethereum-mainnet',
  initialAssetSymbol,
}: FundingFlowShellProps) {
  const { address, connectPrivy } = useWallet();
  const [tab, setTab] = useState<FundingTab>(initialTab);
  const [method, setMethod] = useState<FundingMethod>('bank');
  const [chainId, setChainId] = useState(initialChainId);
  const [amount, setAmount] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedChain = useMemo(() => getChainById(chainId), [chainId]);
  const chainAssets = useMemo(() => getAssetsForChain(chainId), [chainId]);
  const [assetSymbol, setAssetSymbol] = useState(
    initialAssetSymbol || chainAssets[0]?.symbol || 'ETH'
  );

  const selectedAsset = useMemo(
    () => chainAssets.find((asset) => asset.symbol === assetSymbol),
    [chainAssets, assetSymbol]
  );
  const strategy = selectedChain
    ? getStrategyForChainFamily(selectedChain.family)
    : null;
  const receiveAddress =
    strategy?.resolveReceiveAddress(address || null) || null;

  const rampParams = useMemo(
    () => getRampAssetParams(chainId, assetSymbol),
    [chainId, assetSymbol]
  );

  const rampPrefillAddress = useMemo(() => {
    if (!selectedChain) return undefined;
    return rampUserAddressForChainFamily(selectedChain.family, address);
  }, [selectedChain, address]);

  const handleWithdraw = async () => {
    if (!strategy || !selectedChain || !selectedAsset || !address) {
      setError('Missing chain, asset, or connected wallet.');
      return;
    }

    setLoading(true);
    setError(null);
    setTxHash(null);
    try {
      const result = await strategy.sendTransaction({
        fromAddress: address,
        toAddress: destinationAddress,
        amount,
        assetSymbol: selectedAsset.symbol,
      });
      setTxHash(result.txHash);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='mx-auto w-full max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
      <div className='mb-6 flex flex-wrap items-center justify-between gap-3'>
        <h1 className='text-2xl font-semibold text-gray-900'>
          Deposit, withdraw, and bank transfers
        </h1>
        <div className='flex gap-2'>
          <button
            type='button'
            onClick={() => setTab('deposit')}
            className={`rounded-md px-4 py-2 text-sm ${tab === 'deposit' ? 'bg-black text-white' : 'border border-gray-200 text-gray-700'}`}
          >
            Deposit
          </button>
          <button
            type='button'
            onClick={() => setTab('withdraw')}
            className={`rounded-md px-4 py-2 text-sm ${tab === 'withdraw' ? 'bg-black text-white' : 'border border-gray-200 text-gray-700'}`}
          >
            Withdraw
          </button>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        <label className='text-sm text-gray-700'>
          <span className='mb-1 block'>Network</span>
          <select
            value={chainId}
            onChange={(e) => setChainId(e.target.value)}
            className='w-full rounded-md border border-gray-200 px-3 py-2'
          >
            {SUPPORTED_CHAINS.map((chain) => (
              <option key={chain.id} value={chain.id}>
                {chain.name} ({chain.networkLabel})
              </option>
            ))}
          </select>
        </label>
        <label className='text-sm text-gray-700'>
          <span className='mb-1 block'>Asset</span>
          <select
            value={assetSymbol}
            onChange={(e) => setAssetSymbol(e.target.value)}
            className='w-full rounded-md border border-gray-200 px-3 py-2'
          >
            {chainAssets.map((asset) => (
              <option key={asset.id} value={asset.symbol}>
                {asset.symbol} {asset.isStakingDerivative ? '• Derivative' : ''}
              </option>
            ))}
          </select>
        </label>
        <label className='text-sm text-gray-700'>
          <span className='mb-1 block'>Method</span>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as FundingMethod)}
            className='w-full rounded-md border border-gray-200 px-3 py-2'
          >
            <option value='bank'>Ramp — bank (default)</option>
            <option value='wallet'>Native wallet</option>
          </select>
        </label>
      </div>

      {method === 'bank' && (
        <div className='mt-6 space-y-3'>
          <p className='text-sm text-gray-600'>
            {tab === 'deposit'
              ? 'Buy crypto with your bank. Ramp opens below — you can complete KYC and payment in the widget.'
              : 'Sell crypto to your bank where supported. Fiat payout defaults to USD in Ramp; you can change it in the widget.'}
          </p>
          {!address && tab === 'deposit' && (
            <p className='text-sm text-gray-500'>
              Optional: connect an Ethereum wallet to pre-fill a receive address
              for EVM assets. Otherwise enter your address inside Ramp.
            </p>
          )}
          {tab === 'withdraw' && !rampPrefillAddress && (
            <p className='text-sm text-amber-800'>
              Connect a wallet whose address matches this network, or specify
              your source wallet inside Ramp for off-ramp.
            </p>
          )}
          {!address && (
            <button
              type='button'
              onClick={connectPrivy}
              className='rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 hover:bg-gray-50'
            >
              Connect wallet (optional)
            </button>
          )}
          <RampWidgetFrame
            mode={tab === 'deposit' ? 'onramp' : 'offramp'}
            enabledCryptoAssets={rampParams.enabledCryptoAssets}
            onrampOutAsset={rampParams.onrampOutAsset}
            offrampInAsset={rampParams.offrampInAsset}
            userAddress={rampPrefillAddress}
          />
        </div>
      )}

      {method === 'wallet' && !address && (
        <div className='mt-6 rounded-md border border-amber-200 bg-amber-50 p-4'>
          <p className='mb-2 text-sm text-amber-800'>
            Connect your wallet for on-chain deposit or withdraw.
          </p>
          <button
            type='button'
            onClick={connectPrivy}
            className='rounded-md bg-black px-4 py-2 text-sm text-white'
          >
            Connect wallet
          </button>
        </div>
      )}

      {method === 'wallet' && address && tab === 'deposit' && (
        <div className='mt-6 rounded-md border border-gray-200 p-4'>
          <p className='text-sm text-gray-600'>
            Share this receiving address to deposit {selectedAsset?.symbol}.
          </p>
          <code className='mt-2 block overflow-x-auto rounded bg-gray-50 p-3 text-sm'>
            {receiveAddress ||
              'No compatible address for this chain family yet.'}
          </code>
        </div>
      )}

      {method === 'wallet' && address && tab === 'withdraw' && (
        <div className='mt-6 space-y-4 rounded-md border border-gray-200 p-4'>
          <label className='block text-sm text-gray-700'>
            Destination address
            <input
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
              className='mt-1 w-full rounded-md border border-gray-200 px-3 py-2'
              placeholder='Paste destination address'
            />
          </label>
          <label className='block text-sm text-gray-700'>
            Amount ({selectedAsset?.symbol})
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className='mt-1 w-full rounded-md border border-gray-200 px-3 py-2'
              placeholder='0.00'
            />
          </label>
          <button
            type='button'
            disabled={!strategy?.supportsSend || loading}
            onClick={handleWithdraw}
            className='rounded-md bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:bg-gray-300'
          >
            {loading
              ? 'Submitting…'
              : strategy?.supportsSend
                ? 'Send transaction'
                : 'Send coming soon'}
          </button>
          {txHash && selectedChain && (
            <a
              href={`${selectedChain.explorerTxBaseUrl}${txHash}`}
              target='_blank'
              rel='noreferrer'
              className='block text-sm text-blue-600 underline'
            >
              View transaction
            </a>
          )}
          {error && <p className='text-sm text-red-600'>{error}</p>}
        </div>
      )}
    </section>
  );
}
