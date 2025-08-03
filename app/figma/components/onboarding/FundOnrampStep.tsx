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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  ArrowRightLeft,
  Banknote,
  Shield,
  Clock,
  DollarSign,
} from 'lucide-react';

interface FundOnrampStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export function FundOnrampStep({ onNext, onPrevious }: FundOnrampStepProps) {
  const [fundingMethod, setFundingMethod] = useState<
    'card' | 'bank' | 'crypto'
  >('card');
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('ATOM');

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Instant purchase with your card',
      fees: '3.5%',
      time: 'Instant',
      limits: '$500 - $10,000',
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: Banknote,
      description: 'Lower fees via bank transfer',
      fees: '1.0%',
      time: '1-3 business days',
      limits: '$100 - $50,000',
    },
    {
      id: 'crypto',
      name: 'Crypto Transfer',
      icon: ArrowRightLeft,
      description: 'Transfer from another wallet',
      fees: 'Network fees only',
      time: '5-30 minutes',
      limits: 'No limits',
    },
  ];

  const tokens = [
    { symbol: 'ATOM', name: 'Cosmos Hub', price: 8.45 },
    { symbol: 'OSMO', name: 'Osmosis', price: 0.68 },
    { symbol: 'JUNO', name: 'Juno Network', price: 0.32 },
  ];

  const currentMethod = paymentMethods.find((m) => m.id === fundingMethod);
  const currentToken = tokens.find((t) => t.symbol === selectedToken);
  const calculatedTokens = amount
    ? (parseFloat(amount) / (currentToken?.price || 1)).toFixed(2)
    : '0';

  return (
    <div className='mx-auto max-w-4xl'>
      <Card className='mb-8'>
        <CardHeader className='text-center'>
          <CardTitle className='mb-4 flex items-center justify-center gap-2 text-2xl'>
            <DollarSign className='h-6 w-6' />
            Add Funds to Your Wallet
          </CardTitle>
          <CardDescription className='text-lg'>
            Choose how you'd like to fund your wallet and start your staking
            journey.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className='mb-8 grid gap-6 lg:grid-cols-3'>
        {paymentMethods.map((method) => (
          <Card
            key={method.id}
            className={`cursor-pointer transition-all duration-200 ${
              fundingMethod === method.id
                ? 'ring-primary shadow-lg ring-2'
                : 'hover:shadow-md'
            }`}
            onClick={() =>
              setFundingMethod(method.id as 'card' | 'bank' | 'crypto')
            }
          >
            <CardHeader>
              <method.icon className='text-primary mb-2 h-8 w-8' />
              <CardTitle className='text-lg'>{method.name}</CardTitle>
              <CardDescription>{method.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>Fees</span>
                  <Badge variant='secondary'>{method.fees}</Badge>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>Time</span>
                  <span className='text-sm font-medium'>{method.time}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>Limits</span>
                  <span className='text-sm font-medium'>{method.limits}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            {currentMethod?.icon && <currentMethod.icon className='h-5 w-5' />}
            Purchase Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={fundingMethod} className='w-full'>
            <TabsContent value='card'>
              <div className='space-y-6'>
                <div className='grid gap-6 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='amount'>Amount (USD)</Label>
                    <Input
                      id='amount'
                      type='number'
                      placeholder='100'
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='token'>Token to Purchase</Label>
                    <Select
                      value={selectedToken}
                      onValueChange={setSelectedToken}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {tokens.map((token) => (
                          <SelectItem key={token.symbol} value={token.symbol}>
                            {token.symbol} - {token.name} (${token.price})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {amount && (
                  <div className='bg-muted/50 rounded-lg p-4'>
                    <h4 className='mb-3 font-semibold'>Purchase Summary</h4>
                    <div className='space-y-2'>
                      <div className='flex justify-between'>
                        <span>Amount</span>
                        <span>${amount}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Fees (3.5%)</span>
                        <span>${(parseFloat(amount) * 0.035).toFixed(2)}</span>
                      </div>
                      <div className='flex justify-between border-t pt-2 font-semibold'>
                        <span>You'll receive</span>
                        <span>
                          {calculatedTokens} {selectedToken}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className='space-y-4'>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label htmlFor='cardNumber'>Card Number</Label>
                      <Input
                        id='cardNumber'
                        placeholder='1234 5678 9012 3456'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='cardName'>Cardholder Name</Label>
                      <Input id='cardName' placeholder='John Doe' />
                    </div>
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='expiry'>Expiry Date</Label>
                      <Input id='expiry' placeholder='MM/YY' />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='cvv'>CVV</Label>
                      <Input id='cvv' placeholder='123' />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value='bank'>
              <div className='space-y-6'>
                <div className='grid gap-6 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='bankAmount'>Amount (USD)</Label>
                    <Input
                      id='bankAmount'
                      type='number'
                      placeholder='500'
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='bankToken'>Token to Purchase</Label>
                    <Select
                      value={selectedToken}
                      onValueChange={setSelectedToken}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {tokens.map((token) => (
                          <SelectItem key={token.symbol} value={token.symbol}>
                            {token.symbol} - {token.name} (${token.price})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Alert>
                  <Clock className='h-4 w-4' />
                  <AlertDescription>
                    Bank transfers take 1-3 business days to process but have
                    lower fees (1.0% vs 3.5% for cards).
                  </AlertDescription>
                </Alert>

                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='bankAccount'>Bank Account Number</Label>
                    <Input
                      id='bankAccount'
                      placeholder='Enter your account number'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='routingNumber'>Routing Number</Label>
                    <Input
                      id='routingNumber'
                      placeholder='Enter routing number'
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value='crypto'>
              <div className='space-y-6'>
                <Alert>
                  <ArrowRightLeft className='h-4 w-4' />
                  <AlertDescription>
                    Transfer tokens from another wallet or exchange. Make sure
                    to use the correct network and address.
                  </AlertDescription>
                </Alert>

                <div className='space-y-2'>
                  <Label>Your Wallet Addresses</Label>
                  <div className='space-y-3'>
                    {tokens.map((token) => (
                      <div
                        key={token.symbol}
                        className='bg-muted/30 flex items-center justify-between rounded-lg p-3'
                      >
                        <div>
                          <div className='font-medium'>
                            {token.symbol} Address
                          </div>
                          <div className='text-muted-foreground font-mono text-sm'>
                            cosmos1abc...xyz789
                          </div>
                        </div>
                        <Button
                          variant='outline'
                          size='sm'
                          className='flex items-center gap-2'
                        >
                          <ArrowRightLeft className='h-4 w-4' />
                          Copy
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950/30'>
                  <h4 className='mb-2 font-semibold text-yellow-800 dark:text-yellow-200'>
                    Important:
                  </h4>
                  <ul className='space-y-1 text-sm text-yellow-700 dark:text-yellow-300'>
                    <li>
                      • Only send tokens from the same network (e.g., ATOM from
                      Cosmos Hub)
                    </li>
                    <li>• Double-check the address before sending</li>
                    <li>• Start with a small test transaction first</li>
                    <li>• Transactions are irreversible</li>
                  </ul>
                </div>
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
          {fundingMethod === 'crypto' ? 'Continue' : 'Purchase & Continue'}
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
