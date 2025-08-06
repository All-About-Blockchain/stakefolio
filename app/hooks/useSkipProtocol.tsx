import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAllBalances } from './useAllBalances';

interface Token {
  symbol: string;
  name: string;
  chain: string;
  denom: string;
  logo?: string;
  balance?: number;
  price?: number;
}

interface Route {
  id: string;
  fromToken: Token;
  toToken: Token;
  amount: number;
  expectedOutput: number;
  fee: number;
  slippage: number;
  route: string[];
  estimatedTime: number;
  ibcPath: string[];
  gasEstimate: number;
}

interface SkipQuote {
  route: {
    sourceAssetDenom: string;
    sourceAssetChainID: string;
    destAssetDenom: string;
    destAssetChainID: string;
    amountIn: string;
    amountOut: string;
    operations: any[];
    chainIDs: string[];
    doesSwap: boolean;
    estimatedAmountOut: string;
    swapVenue: {
      name: string;
      chainID: string;
    };
  };
  inAmount: string;
  outAmount: string;
  amountIn: string;
  amountOut: string;
  swapVenue: {
    name: string;
    chainID: string;
  };
  sourceAssetDenom: string;
  sourceAssetChainID: string;
  destAssetDenom: string;
  destAssetChainID: string;
  estimatedAmountOut: string;
  estimatedAmountIn: string;
  estimatedAmountOutMin: string;
  estimatedAmountInMax: string;
  estimatedGas: string;
  estimatedGasUSD: string;
  estimatedTime: number;
  doesSwap: boolean;
  operations: any[];
  chainIDs: string[];
}

interface SkipTransaction {
  id: string;
  status: 'pending' | 'completed' | 'failed';
  fromToken: Token;
  toToken: Token;
  amount: number;
  expectedOutput: number;
  timestamp: number;
  txHash?: string;
  error?: string;
}

export function useSkipProtocol() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quotes, setQuotes] = useState<SkipQuote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<SkipQuote | null>(null);
  const [transactions, setTransactions] = useState<SkipTransaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Get real wallet balances
  const { assets: walletBalances, loading: balancesLoading } = useAllBalances();

  // Skip Protocol API endpoints
  const SKIP_API_BASE = 'https://api.skip.money';
  const SKIP_QUOTE_ENDPOINT = `${SKIP_API_BASE}/v1/fungible/quote`;
  const SKIP_TRANSACTION_ENDPOINT = `${SKIP_API_BASE}/v1/fungible/msgs_direct`;

  // Generate available tokens from real wallet data
  const availableTokens: Token[] = useMemo(() => {
    const tokens: Token[] = [];
    const tokenMap = new Map<string, Token>();

    // Process wallet balances to create token list
    walletBalances.forEach((chain) => {
      chain.balances.forEach((balance) => {
        const symbol = balance.symbol.toUpperCase();
        const existingToken = tokenMap.get(symbol);

        if (existingToken) {
          // Add balance to existing token
          existingToken.balance =
            (existingToken.balance || 0) + parseFloat(balance.displayAmount);
        } else {
          // Create new token
          const token: Token = {
            symbol,
            name: balance.displayName,
            chain: chain.chainName,
            denom: balance.denom,
            logo: `https://raw.githubusercontent.com/cosmos/chain-registry/master/${chain.chainName}/images/${symbol.toLowerCase()}.png`,
            balance: parseFloat(balance.displayAmount),
            price: balance.price,
          };
          tokenMap.set(symbol, token);
        }
      });
    });

    // Convert map to array and add fallback tokens if no wallet data
    const result = Array.from(tokenMap.values());

    // Add fallback tokens if no wallet data is available
    if (result.length === 0) {
      return [
        {
          symbol: 'ATOM',
          name: 'Cosmos Hub',
          chain: 'cosmoshub-4',
          denom: 'UATOM',
          logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.png',
          balance: 0,
          price: 8.45,
        },
        {
          symbol: 'OSMO',
          name: 'Osmosis',
          chain: 'osmosis-1',
          denom: 'UOSMO',
          logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.png',
          balance: 0,
          price: 0.85,
        },
        {
          symbol: 'JUNO',
          name: 'Juno',
          chain: 'juno-1',
          denom: 'UJUNO',
          logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/juno/images/juno.png',
          balance: 0,
          price: 0.45,
        },
        {
          symbol: 'STARS',
          name: 'Stargaze',
          chain: 'stargaze-1',
          denom: 'USTARS',
          logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stargaze/images/stars.png',
          balance: 0,
          price: 0.12,
        },
        {
          symbol: 'SCRT',
          name: 'Secret Network',
          chain: 'secret-4',
          denom: 'USCRT',
          logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/secret/images/scrt.png',
          balance: 0,
          price: 0.35,
        },
        {
          symbol: 'AKT',
          name: 'Akash',
          chain: 'akashnet-2',
          denom: 'UAKT',
          logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/akash/images/akt.png',
          balance: 0,
          price: 0.25,
        },
      ];
    }

    return result;
  }, [walletBalances]);

  // Connect to Skip Protocol
  const connectToSkip = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if wallet is connected
      if (walletBalances.length === 0) {
        setError('Please connect your wallet first');
        return;
      }

      // Simulate connection to Skip Protocol
      // In a real implementation, this would involve wallet connection
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsConnected(true);
    } catch (err) {
      setError('Failed to connect to Skip Protocol');
      console.error('Skip connection error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [walletBalances]);

  // Get quote from Skip Protocol
  const getQuote = useCallback(
    async (
      fromToken: Token,
      toToken: Token,
      amount: number
    ): Promise<SkipQuote[]> => {
      if (!isConnected) {
        throw new Error('Not connected to Skip Protocol');
      }

      setIsLoading(true);
      setError(null);

      try {
        // Convert amount to micro units (e.g., ATOM -> uatom)
        const amountInMicro = Math.floor(amount * 1000000);

        const quoteParams = {
          sourceAssetDenom: fromToken.denom,
          sourceAssetChainID: fromToken.chain,
          destAssetDenom: toToken.denom,
          destAssetChainID: toToken.chain,
          amountIn: amountInMicro.toString(),
          allowMultiHop: true,
          allowSwap: true,
          allowSplit: false,
          maxRoutes: 3,
        };

        // In a real implementation, this would be an actual API call
        // const response = await fetch(SKIP_QUOTE_ENDPOINT, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(quoteParams),
        // });
        // const quotes = await response.json();

        // Simulate API response with realistic data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockQuotes: SkipQuote[] = [
          {
            route: {
              sourceAssetDenom: fromToken.denom,
              sourceAssetChainID: fromToken.chain,
              destAssetDenom: toToken.denom,
              destAssetChainID: toToken.chain,
              amountIn: amountInMicro.toString(),
              amountOut: Math.floor(amount * 1.234 * 1000000).toString(),
              operations: [],
              chainIDs: [fromToken.chain, toToken.chain],
              doesSwap: true,
              estimatedAmountOut: Math.floor(
                amount * 1.234 * 1000000
              ).toString(),
              swapVenue: { name: 'osmosis', chainID: 'osmosis-1' },
            },
            inAmount: amountInMicro.toString(),
            outAmount: Math.floor(amount * 1.234 * 1000000).toString(),
            amountIn: amountInMicro.toString(),
            amountOut: Math.floor(amount * 1.234 * 1000000).toString(),
            swapVenue: { name: 'osmosis', chainID: 'osmosis-1' },
            sourceAssetDenom: fromToken.denom,
            sourceAssetChainID: fromToken.chain,
            destAssetDenom: toToken.denom,
            destAssetChainID: toToken.chain,
            estimatedAmountOut: Math.floor(amount * 1.234 * 1000000).toString(),
            estimatedAmountIn: amountInMicro.toString(),
            estimatedAmountOutMin: Math.floor(
              amount * 1.228 * 1000000
            ).toString(),
            estimatedAmountInMax: amountInMicro.toString(),
            estimatedGas: '200000',
            estimatedGasUSD: '0.50',
            estimatedTime: 30,
            doesSwap: true,
            operations: [],
            chainIDs: [fromToken.chain, toToken.chain],
          },
          {
            route: {
              sourceAssetDenom: fromToken.denom,
              sourceAssetChainID: fromToken.chain,
              destAssetDenom: toToken.denom,
              destAssetChainID: toToken.chain,
              amountIn: amountInMicro.toString(),
              amountOut: Math.floor(amount * 1.228 * 1000000).toString(),
              operations: [],
              chainIDs: [fromToken.chain, 'juno-1', toToken.chain],
              doesSwap: true,
              estimatedAmountOut: Math.floor(
                amount * 1.228 * 1000000
              ).toString(),
              swapVenue: { name: 'juno', chainID: 'juno-1' },
            },
            inAmount: amountInMicro.toString(),
            outAmount: Math.floor(amount * 1.228 * 1000000).toString(),
            amountIn: amountInMicro.toString(),
            amountOut: Math.floor(amount * 1.228 * 1000000).toString(),
            swapVenue: { name: 'juno', chainID: 'juno-1' },
            sourceAssetDenom: fromToken.denom,
            sourceAssetChainID: fromToken.chain,
            destAssetDenom: toToken.denom,
            destAssetChainID: toToken.chain,
            estimatedAmountOut: Math.floor(amount * 1.228 * 1000000).toString(),
            estimatedAmountIn: amountInMicro.toString(),
            estimatedAmountOutMin: Math.floor(
              amount * 1.222 * 1000000
            ).toString(),
            estimatedAmountInMax: amountInMicro.toString(),
            estimatedGas: '300000',
            estimatedGasUSD: '0.75',
            estimatedTime: 45,
            doesSwap: true,
            operations: [],
            chainIDs: [fromToken.chain, 'juno-1', toToken.chain],
          },
        ];

        setQuotes(mockQuotes);
        setSelectedQuote(mockQuotes[0]);
        return mockQuotes;
      } catch (err) {
        const errorMessage = 'Failed to get quote from Skip Protocol';
        setError(errorMessage);
        console.error('Skip quote error:', err);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [isConnected]
  );

  // Execute swap transaction
  const executeSwap = useCallback(
    async (quote: SkipQuote, userAddress: string): Promise<SkipTransaction> => {
      if (!isConnected) {
        throw new Error('Not connected to Skip Protocol');
      }

      setIsLoading(true);
      setError(null);

      try {
        const transactionParams = {
          sourceAssetDenom: quote.sourceAssetDenom,
          sourceAssetChainID: quote.sourceAssetChainID,
          destAssetDenom: quote.destAssetDenom,
          destAssetChainID: quote.destAssetChainID,
          amountIn: quote.amountIn,
          userAddress,
          estimatedAmountOut: quote.estimatedAmountOut,
          estimatedAmountOutMin: quote.estimatedAmountOutMin,
          estimatedGas: quote.estimatedGas,
          operations: quote.operations,
          chainIDs: quote.chainIDs,
        };

        // In a real implementation, this would be an actual API call
        // const response = await fetch(SKIP_TRANSACTION_ENDPOINT, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(transactionParams),
        // });
        // const transaction = await response.json();

        // Simulate transaction execution
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const fromToken = availableTokens.find(
          (t) => t.denom === quote.sourceAssetDenom
        )!;
        const toToken = availableTokens.find(
          (t) => t.denom === quote.destAssetDenom
        )!;

        const newTransaction: SkipTransaction = {
          id: `tx_${Date.now()}`,
          status: 'completed',
          fromToken,
          toToken,
          amount: parseFloat(quote.amountIn) / 1000000,
          expectedOutput: parseFloat(quote.estimatedAmountOut) / 1000000,
          timestamp: Date.now(),
          txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        };

        setTransactions((prev) => [newTransaction, ...prev]);
        return newTransaction;
      } catch (err) {
        const errorMessage = 'Failed to execute swap transaction';
        setError(errorMessage);
        console.error('Skip transaction error:', err);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [isConnected, availableTokens]
  );

  // Get transaction status
  const getTransactionStatus = useCallback(async (txHash: string) => {
    try {
      // In a real implementation, this would query the blockchain
      // const response = await fetch(`${SKIP_API_BASE}/v1/transaction/${txHash}`);
      // return await response.json();

      // Simulate status check
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { status: 'completed', confirmed: true };
    } catch (err) {
      console.error('Transaction status error:', err);
      throw err;
    }
  }, []);

  // Get supported tokens
  const getSupportedTokens = useCallback(() => {
    return availableTokens;
  }, []);

  // Get token balance
  const getTokenBalance = useCallback(
    async (token: Token, address: string) => {
      try {
        // Find the token balance from wallet data
        const balance = walletBalances
          .flatMap((chain) => chain.balances)
          .find((b) => b.symbol.toUpperCase() === token.symbol);

        if (balance) {
          return parseFloat(balance.displayAmount);
        }

        // Fallback to token.balance if not found in wallet data
        return token.balance || 0;
      } catch (err) {
        console.error('Balance fetch error:', err);
        return 0;
      }
    },
    [walletBalances]
  );

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Disconnect
  const disconnect = useCallback(() => {
    setIsConnected(false);
    setQuotes([]);
    setSelectedQuote(null);
    setError(null);
  }, []);

  return {
    // State
    isConnected,
    isLoading,
    quotes,
    selectedQuote,
    transactions,
    error,

    // Actions
    connectToSkip,
    getQuote,
    executeSwap,
    getTransactionStatus,
    getSupportedTokens,
    getTokenBalance,
    setSelectedQuote,
    clearError,
    disconnect,

    // Data
    availableTokens,
  };
}
