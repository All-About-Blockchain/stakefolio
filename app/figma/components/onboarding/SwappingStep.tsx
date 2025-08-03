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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowRightLeft,
  Zap,
  Clock,
  DollarSign,
  Info,
} from 'lucide-react';

interface SwappingStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export function SwappingStep({ onNext, onPrevious }: SwappingStepProps) {
  const [fromToken, setFromToken] = useState('ATOM');
  const [toToken, setToToken] = useState('OSMO');
  const [fromAmount, setFromAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');

  const tokens = [
    { symbol: 'ATOM', name: 'Cosmos Hub', balance: 145.67, price: 8.47 },
    { symbol: 'OSMO', name: 'Osmosis', balance: 890.34, price: 0.68 },
    { symbol: 'JUNO', name: 'Juno Network', balance: 1923.45, price: 0.32 },
    { symbol: 'AKT', name: 'Akash Network', balance: 0, price: 2.14 },
    { symbol: 'SCRT', name: 'Secret Network', balance: 0, price: 0.89 },
  ];

  const fromTokenData = tokens.find((t) => t.symbol === fromToken);
  const toTokenData = tokens.find((t) => t.symbol === toToken);

  const calculateSwap = () => {
    if (!fromAmount || !fromTokenData || !toTokenData)
      return { toAmount: '0', rate: '0', fee: '0' };

    const fromValue = parseFloat(fromAmount) * fromTokenData.price;
    const fee = fromValue * 0.003; // 0.3% swap fee
    const netValue = fromValue - fee;
    const toAmount = netValue / toTokenData.price;
    const rate = (toAmount / parseFloat(fromAmount)).toFixed(6);

    return {
      toAmount: toAmount.toFixed(6),
      rate,
      fee: fee.toFixed(2),
    };
  };

  const swapData = calculateSwap();

  const swapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const poolInfo = [
    { pair: 'ATOM/OSMO', liquidity: '$12.4M', volume24h: '$2.1M', fee: '0.3%' },
    { pair: 'ATOM/JUNO', liquidity: '$8.7M', volume24h: '$1.2M', fee: '0.3%' },
    { pair: 'OSMO/JUNO', liquidity: '$5.2M', volume24h: '$890K', fee: '0.3%' },
  ];

  return (
    <div className='mx-auto max-w-4xl'>
      <Card className='mb-8'>
        <CardHeader className='text-center'>
          <CardTitle className='mb-4 flex items-center justify-center gap-2 text-2xl'>
            <ArrowRightLeft className='h-6 w-6' />
            Token Swapping
          </CardTitle>
          <CardDescription className='text-lg'>
            Exchange between different Cosmos ecosystem tokens using
            decentralized liquidity pools.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className='grid gap-8 lg:grid-cols-2'>
        {/* Swap Interface */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <ArrowRightLeft className='h-5 w-5' />
              Swap Tokens
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* From Token */}
            <div className='space-y-2'>
              <Label>From</Label>
              <div className='flex gap-2'>
                <Select value={fromToken} onValueChange={setFromToken}>
                  <SelectTrigger className='w-32'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens
                      .filter((t) => t.symbol !== toToken)
                      .map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          {token.symbol}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Input
                  type='number'
                  placeholder='0.00'
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className='flex-1'
                />
              </div>
              <div className='text-muted-foreground flex justify-between text-sm'>
                <span>
                  Balance: {fromTokenData?.balance.toFixed(2)} {fromToken}
                </span>
                <span>
                  $
                  {(
                    fromTokenData?.balance ||
                    0 * fromTokenData?.price ||
                    0
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Swap Button */}
            <div className='flex justify-center'>
              <Button
                variant='outline'
                size='sm'
                onClick={swapTokens}
                className='h-10 w-10 rounded-full p-0'
              >
                <ArrowUpDown className='h-4 w-4' />
              </Button>
            </div>

            {/* To Token */}
            <div className='space-y-2'>
              <Label>To</Label>
              <div className='flex gap-2'>
                <Select value={toToken} onValueChange={setToToken}>
                  <SelectTrigger className='w-32'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens
                      .filter((t) => t.symbol !== fromToken)
                      .map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          {token.symbol}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Input
                  type='number'
                  placeholder='0.00'
                  value={swapData.toAmount}
                  readOnly
                  className='bg-muted flex-1'
                />
              </div>
              <div className='text-muted-foreground flex justify-between text-sm'>
                <span>
                  Balance: {toTokenData?.balance.toFixed(2)} {toToken}
                </span>
                <span>
                  $
                  {(
                    toTokenData?.balance ||
                    0 * toTokenData?.price ||
                    0
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Swap Details */}
            {fromAmount && (
              <div className='bg-muted/50 space-y-2 rounded-lg p-4'>
                <div className='flex justify-between text-sm'>
                  <span>Exchange Rate</span>
                  <span>
                    1 {fromToken} = {swapData.rate} {toToken}
                  </span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span>Network Fee</span>
                  <span>~$0.05</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span>Swap Fee (0.3%)</span>
                  <span>${swapData.fee}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span>Slippage Tolerance</span>
                  <span>{slippage}%</span>
                </div>
              </div>
            )}

            {/* Slippage Settings */}
            <div className='space-y-2'>
              <Label>Slippage Tolerance</Label>
              <div className='flex gap-2'>
                {['0.1', '0.5', '1.0'].map((value) => (
                  <Button
                    key={value}
                    variant={slippage === value ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => setSlippage(value)}
                  >
                    {value}%
                  </Button>
                ))}
                <Input
                  type='number'
                  placeholder='Custom'
                  value={slippage}
                  onChange={(e) => setSlippage(e.target.value)}
                  className='w-20'
                />
              </div>
            </div>

            <Button
              className='w-full'
              disabled={!fromAmount || parseFloat(fromAmount) <= 0}
            >
              <Zap className='mr-2 h-4 w-4' />
              Swap Tokens
            </Button>

            <Alert>
              <Info className='h-4 w-4' />
              <AlertDescription>
                This is a demo interface. In a real application, you would
                connect to a DEX like Osmosis to execute swaps.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Information Panel */}
        <div className='space-y-6'>
          {/* How Swapping Works */}
          <Card>
            <CardHeader>
              <CardTitle>How Token Swapping Works</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-start gap-3'>
                <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30'>
                  <span className='text-sm font-semibold text-blue-600'>1</span>
                </div>
                <div>
                  <h4 className='font-semibold'>Liquidity Pools</h4>
                  <p className='text-muted-foreground text-sm'>
                    Swaps happen through liquidity pools where users provide
                    token pairs for trading.
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30'>
                  <span className='text-sm font-semibold text-purple-600'>
                    2
                  </span>
                </div>
                <div>
                  <h4 className='font-semibold'>Automated Market Making</h4>
                  <p className='text-muted-foreground text-sm'>
                    Prices are determined automatically based on supply and
                    demand in the pools.
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30'>
                  <span className='text-sm font-semibold text-green-600'>
                    3
                  </span>
                </div>
                <div>
                  <h4 className='font-semibold'>Instant Settlement</h4>
                  <p className='text-muted-foreground text-sm'>
                    Transactions settle within seconds on the Cosmos network.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Popular Pools */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <DollarSign className='h-5 w-5' />
                Popular Trading Pairs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {poolInfo.map((pool, index) => (
                  <div
                    key={index}
                    className='bg-muted/30 flex items-center justify-between rounded-lg p-3'
                  >
                    <div>
                      <div className='font-medium'>{pool.pair}</div>
                      <div className='text-muted-foreground text-sm'>
                        Fee: {pool.fee}
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='text-sm font-medium'>
                        {pool.liquidity}
                      </div>
                      <div className='text-muted-foreground text-xs'>
                        {pool.volume24h} 24h vol
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Clock className='h-5 w-5' />
                Swapping Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3 text-sm'>
                <div className='flex items-start gap-2'>
                  <div className='bg-primary mt-2 h-2 w-2 flex-shrink-0 rounded-full'></div>
                  <p>
                    Check slippage tolerance for large trades to avoid
                    unexpected price changes.
                  </p>
                </div>
                <div className='flex items-start gap-2'>
                  <div className='bg-primary mt-2 h-2 w-2 flex-shrink-0 rounded-full'></div>
                  <p>
                    Compare rates across different DEXs to get the best price
                    for your swap.
                  </p>
                </div>
                <div className='flex items-start gap-2'>
                  <div className='bg-primary mt-2 h-2 w-2 flex-shrink-0 rounded-full'></div>
                  <p>
                    Consider network congestion - fees may be higher during peak
                    times.
                  </p>
                </div>
                <div className='flex items-start gap-2'>
                  <div className='bg-primary mt-2 h-2 w-2 flex-shrink-0 rounded-full'></div>
                  <p>Start with small amounts when trying new trading pairs.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className='mt-8 flex justify-between'>
        <Button
          variant='outline'
          onClick={onPrevious}
          className='flex items-center gap-2'
        >
          <ChevronLeft className='h-4 w-4' />
          Previous
        </Button>
        <Button onClick={onNext} className='flex items-center gap-2'>
          Continue to Validator Selection
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
