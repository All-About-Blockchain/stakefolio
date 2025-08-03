import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import {
  ChevronLeft,
  ChevronRight,
  Wallet,
  Eye,
  EyeOff,
  Send,
  Download,
  History,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';

interface WalletManagementStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export function WalletManagementStep({
  onNext,
  onPrevious,
}: WalletManagementStepProps) {
  const [balanceVisible, setBalanceVisible] = useState(true);

  // Mock wallet data
  const walletBalance = {
    totalValue: 2456.78,
    tokens: [
      {
        symbol: 'ATOM',
        amount: 145.67,
        value: 1234.56,
        price: 8.47,
        change24h: 5.2,
        staked: 120.5,
      },
      {
        symbol: 'OSMO',
        amount: 890.34,
        value: 605.43,
        price: 0.68,
        change24h: -2.1,
        staked: 0,
      },
      {
        symbol: 'JUNO',
        amount: 1923.45,
        value: 616.79,
        price: 0.32,
        change24h: 8.7,
        staked: 500.0,
      },
    ],
  };

  const recentTransactions = [
    {
      type: 'receive',
      token: 'ATOM',
      amount: 25.5,
      value: 215.84,
      time: '2 hours ago',
      hash: '0xabc...def',
    },
    {
      type: 'stake',
      token: 'ATOM',
      amount: 50.0,
      value: 423.5,
      time: '1 day ago',
      hash: '0x123...456',
    },
    {
      type: 'send',
      token: 'OSMO',
      amount: 150.0,
      value: 102.0,
      time: '3 days ago',
      hash: '0x789...012',
    },
    {
      type: 'receive',
      token: 'JUNO',
      amount: 500.0,
      value: 160.0,
      time: '5 days ago',
      hash: '0xdef...789',
    },
  ];

  const stakingRewards = [
    {
      validator: 'Cosmos Validator 1',
      token: 'ATOM',
      amount: 2.34,
      value: 19.82,
      period: 'Last 7 days',
    },
    {
      validator: 'Juno Network Validator',
      token: 'JUNO',
      amount: 12.45,
      value: 3.98,
      period: 'Last 7 days',
    },
  ];

  return (
    <div className='mx-auto max-w-5xl'>
      <Card className='mb-8'>
        <CardHeader className='text-center'>
          <CardTitle className='mb-4 flex items-center justify-center gap-2 text-2xl'>
            <Wallet className='h-6 w-6' />
            Your Wallet Dashboard
          </CardTitle>
          <CardDescription className='text-lg'>
            Monitor your assets, track transactions, and view your staking
            rewards all in one place.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Portfolio Overview */}
      <Card className='mb-8'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>Portfolio Overview</CardTitle>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setBalanceVisible(!balanceVisible)}
              className='flex items-center gap-2'
            >
              {balanceVisible ? (
                <EyeOff className='h-4 w-4' />
              ) : (
                <Eye className='h-4 w-4' />
              )}
              {balanceVisible ? 'Hide' : 'Show'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className='mb-6 text-center'>
            <div className='mb-2 text-3xl font-bold'>
              {balanceVisible
                ? `$${walletBalance.totalValue.toLocaleString()}`
                : '••••••'}
            </div>
            <p className='text-muted-foreground'>Total Portfolio Value</p>
          </div>

          <div className='grid gap-4 md:grid-cols-3'>
            {walletBalance.tokens.map((token) => (
              <Card key={token.symbol} className='p-4'>
                <div className='mb-3 flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600'>
                      <span className='text-xs font-semibold text-white'>
                        {token.symbol[0]}
                      </span>
                    </div>
                    <span className='font-semibold'>{token.symbol}</span>
                  </div>
                  <Badge
                    variant={token.change24h >= 0 ? 'secondary' : 'destructive'}
                    className='text-xs'
                  >
                    {token.change24h >= 0 ? '+' : ''}
                    {token.change24h}%
                  </Badge>
                </div>
                <div className='space-y-1'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground text-sm'>
                      Balance
                    </span>
                    <span className='text-sm font-medium'>
                      {balanceVisible
                        ? `${token.amount.toFixed(2)} ${token.symbol}`
                        : '••••••'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground text-sm'>Value</span>
                    <span className='text-sm font-medium'>
                      {balanceVisible ? `$${token.value.toFixed(2)}` : '••••••'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground text-sm'>
                      Staked
                    </span>
                    <span className='text-sm font-medium'>
                      {balanceVisible
                        ? `${token.staked.toFixed(1)} ${token.symbol}`
                        : '••••••'}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className='mb-8 grid grid-cols-2 gap-4 md:grid-cols-4'>
        <Button variant='outline' className='flex h-16 items-center gap-2'>
          <Download className='h-5 w-5 text-green-600' />
          <div className='text-left'>
            <div className='font-medium'>Receive</div>
            <div className='text-muted-foreground text-xs'>Get tokens</div>
          </div>
        </Button>
        <Button variant='outline' className='flex h-16 items-center gap-2'>
          <Send className='h-5 w-5 text-blue-600' />
          <div className='text-left'>
            <div className='font-medium'>Send</div>
            <div className='text-muted-foreground text-xs'>Transfer tokens</div>
          </div>
        </Button>
        <Button variant='outline' className='flex h-16 items-center gap-2'>
          <TrendingUp className='h-5 w-5 text-purple-600' />
          <div className='text-left'>
            <div className='font-medium'>Stake</div>
            <div className='text-muted-foreground text-xs'>Earn rewards</div>
          </div>
        </Button>
        <Button variant='outline' className='flex h-16 items-center gap-2'>
          <History className='h-5 w-5 text-orange-600' />
          <div className='text-left'>
            <div className='font-medium'>History</div>
            <div className='text-muted-foreground text-xs'>
              View transactions
            </div>
          </div>
        </Button>
      </div>

      {/* Detailed Information */}
      <Card>
        <CardContent className='p-6'>
          <Tabs defaultValue='transactions' className='w-full'>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='transactions'>
                Recent Transactions
              </TabsTrigger>
              <TabsTrigger value='rewards'>Staking Rewards</TabsTrigger>
              <TabsTrigger value='analytics'>Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value='transactions' className='mt-6'>
              <div className='space-y-4'>
                {recentTransactions.map((tx, index) => (
                  <div
                    key={index}
                    className='bg-muted/30 flex items-center justify-between rounded-lg p-4'
                  >
                    <div className='flex items-center gap-3'>
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          tx.type === 'receive'
                            ? 'bg-green-100 dark:bg-green-900/30'
                            : tx.type === 'send'
                              ? 'bg-red-100 dark:bg-red-900/30'
                              : 'bg-blue-100 dark:bg-blue-900/30'
                        }`}
                      >
                        {tx.type === 'receive' ? (
                          <ArrowDownLeft className='h-5 w-5 text-green-600' />
                        ) : tx.type === 'send' ? (
                          <ArrowUpRight className='h-5 w-5 text-red-600' />
                        ) : (
                          <TrendingUp className='h-5 w-5 text-blue-600' />
                        )}
                      </div>
                      <div>
                        <div className='font-medium capitalize'>
                          {tx.type} {tx.token}
                        </div>
                        <div className='text-muted-foreground text-sm'>
                          {tx.time}
                        </div>
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='font-medium'>
                        {tx.type === 'send' ? '-' : '+'}
                        {tx.amount} {tx.token}
                      </div>
                      <div className='text-muted-foreground text-sm'>
                        ${tx.value.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value='rewards' className='mt-6'>
              <div className='space-y-4'>
                {stakingRewards.map((reward, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20'
                  >
                    <div>
                      <div className='font-medium'>{reward.validator}</div>
                      <div className='text-muted-foreground text-sm'>
                        {reward.period}
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='font-medium text-green-600'>
                        +{reward.amount} {reward.token}
                      </div>
                      <div className='text-muted-foreground text-sm'>
                        ${reward.value.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}

                <Alert>
                  <TrendingUp className='h-4 w-4' />
                  <AlertDescription>
                    Staking rewards are automatically added to your wallet. You
                    can claim and restake them to compound your earnings.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            <TabsContent value='analytics' className='mt-6'>
              <div className='grid gap-6 md:grid-cols-2'>
                <Card className='p-4'>
                  <h4 className='mb-4 font-semibold'>Portfolio Allocation</h4>
                  <div className='space-y-3'>
                    {walletBalance.tokens.map((token) => {
                      const percentage = (
                        (token.value / walletBalance.totalValue) *
                        100
                      ).toFixed(1);
                      return (
                        <div
                          key={token.symbol}
                          className='flex items-center justify-between'
                        >
                          <span className='text-sm'>{token.symbol}</span>
                          <div className='flex items-center gap-2'>
                            <div className='bg-muted h-2 w-16 rounded-full'>
                              <div
                                className='h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600'
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className='w-12 text-sm font-medium'>
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                <Card className='p-4'>
                  <h4 className='mb-4 font-semibold'>Staking Summary</h4>
                  <div className='space-y-3'>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground text-sm'>
                        Total Staked Value
                      </span>
                      <span className='font-medium'>$1,987.34</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground text-sm'>
                        Annual Rewards (Est.)
                      </span>
                      <span className='font-medium text-green-600'>
                        $298.10
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground text-sm'>
                        Average APY
                      </span>
                      <span className='font-medium'>15.0%</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground text-sm'>
                        Active Validators
                      </span>
                      <span className='font-medium'>3</span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
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
        <Button onClick={onNext} className='flex items-center gap-2'>
          Continue to Swapping
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
