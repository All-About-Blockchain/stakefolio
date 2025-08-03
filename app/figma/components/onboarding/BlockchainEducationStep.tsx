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
import {
  ChevronLeft,
  ChevronRight,
  Network,
  TrendingUp,
  Coins,
  Users,
} from 'lucide-react';

interface BlockchainEducationStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export function BlockchainEducationStep({
  onNext,
  onPrevious,
}: BlockchainEducationStepProps) {
  const [selectedNetwork, setSelectedNetwork] = useState('cosmos-hub');

  const networks = [
    {
      id: 'cosmos-hub',
      name: 'Cosmos Hub',
      symbol: 'ATOM',
      apy: '15.2%',
      description:
        'The heart of the Cosmos ecosystem, securing the network and enabling cross-chain communication.',
      features: [
        'Inter-Blockchain Communication',
        'Governance Participation',
        'High Security',
      ],
      totalStaked: '$2.1B',
      validators: 180,
      color: 'from-blue-500 to-purple-600',
    },
    {
      id: 'osmosis',
      name: 'Osmosis',
      symbol: 'OSMO',
      apy: '18.5%',
      description:
        'The premier DEX and AMM protocol in Cosmos, enabling seamless token swaps and liquidity provision.',
      features: [
        'Decentralized Exchange',
        'Liquidity Pools',
        'Cross-Chain Swaps',
      ],
      totalStaked: '$890M',
      validators: 150,
      color: 'from-purple-500 to-pink-600',
    },
    {
      id: 'juno',
      name: 'Juno',
      symbol: 'JUNO',
      apy: '12.8%',
      description:
        'A permissionless smart contract platform in the Cosmos ecosystem, built for DeFi and NFTs.',
      features: ['Smart Contracts', 'DeFi Applications', 'NFT Marketplace'],
      totalStaked: '$145M',
      validators: 125,
      color: 'from-orange-500 to-red-600',
    },
  ];

  const currentNetwork =
    networks.find((n) => n.id === selectedNetwork) || networks[0];

  return (
    <div className='mx-auto max-w-4xl'>
      <Card className='mb-8'>
        <CardHeader className='text-center'>
          <CardTitle className='mb-4 flex items-center justify-center gap-2 text-2xl'>
            <Network className='h-6 w-6' />
            Choose Your Blockchain Network
          </CardTitle>
          <CardDescription className='text-lg'>
            Each Cosmos network offers unique features and staking rewards.
            Learn about the different options to find the best fit for your
            goals.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className='mb-8 grid gap-6 lg:grid-cols-3'>
        {networks.map((network) => (
          <Card
            key={network.id}
            className={`cursor-pointer transition-all duration-200 ${
              selectedNetwork === network.id
                ? 'ring-primary shadow-lg ring-2'
                : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedNetwork(network.id)}
          >
            <CardHeader>
              <div
                className={`h-12 w-12 rounded-lg bg-gradient-to-br ${network.color} mb-3 flex items-center justify-center`}
              >
                <Coins className='h-6 w-6 text-white' />
              </div>
              <CardTitle className='flex items-center justify-between'>
                {network.name}
                <Badge variant='secondary'>{network.symbol}</Badge>
              </CardTitle>
              <CardDescription>{network.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>APY</span>
                  <span className='font-semibold text-green-600'>
                    {network.apy}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>
                    Total Staked
                  </span>
                  <span className='font-semibold'>{network.totalStaked}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>
                    Validators
                  </span>
                  <span className='font-semibold'>{network.validators}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Network Information */}
      <Card className='mb-8'>
        <CardHeader>
          <CardTitle className='flex items-center gap-3'>
            <div
              className={`h-10 w-10 rounded-lg bg-gradient-to-br ${currentNetwork.color} flex items-center justify-center`}
            >
              <Coins className='h-5 w-5 text-white' />
            </div>
            {currentNetwork.name} Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='overview' className='w-full'>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='features'>Features</TabsTrigger>
              <TabsTrigger value='staking'>Staking Info</TabsTrigger>
            </TabsList>

            <TabsContent value='overview' className='mt-6'>
              <div className='space-y-4'>
                <p className='text-muted-foreground'>
                  {currentNetwork.description}
                </p>
                <div className='grid gap-4 sm:grid-cols-3'>
                  <div className='bg-muted/50 rounded-lg p-4 text-center'>
                    <TrendingUp className='mx-auto mb-2 h-6 w-6 text-green-600' />
                    <div className='font-semibold text-green-600'>
                      {currentNetwork.apy}
                    </div>
                    <div className='text-muted-foreground text-sm'>
                      Annual Yield
                    </div>
                  </div>
                  <div className='bg-muted/50 rounded-lg p-4 text-center'>
                    <Coins className='text-primary mx-auto mb-2 h-6 w-6' />
                    <div className='font-semibold'>
                      {currentNetwork.totalStaked}
                    </div>
                    <div className='text-muted-foreground text-sm'>
                      Total Staked
                    </div>
                  </div>
                  <div className='bg-muted/50 rounded-lg p-4 text-center'>
                    <Users className='text-primary mx-auto mb-2 h-6 w-6' />
                    <div className='font-semibold'>
                      {currentNetwork.validators}
                    </div>
                    <div className='text-muted-foreground text-sm'>
                      Active Validators
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value='features' className='mt-6'>
              <div className='space-y-3'>
                {currentNetwork.features.map((feature, index) => (
                  <div
                    key={index}
                    className='bg-muted/30 flex items-center gap-3 rounded-lg p-3'
                  >
                    <div className='bg-primary h-2 w-2 rounded-full'></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value='staking' className='mt-6'>
              <div className='space-y-4'>
                <div className='rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30'>
                  <h4 className='mb-2 font-semibold'>How Staking Works</h4>
                  <p className='text-muted-foreground text-sm'>
                    By staking your {currentNetwork.symbol} tokens, you help
                    secure the network and earn rewards. Your tokens are
                    delegated to validators who process transactions and
                    maintain the blockchain.
                  </p>
                </div>
                <div className='grid gap-4 text-sm sm:grid-cols-2'>
                  <div>
                    <h5 className='mb-2 font-semibold'>Benefits:</h5>
                    <ul className='text-muted-foreground space-y-1'>
                      <li>• Earn passive income</li>
                      <li>• Help secure the network</li>
                      <li>• Participate in governance</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className='mb-2 font-semibold'>Considerations:</h5>
                    <ul className='text-muted-foreground space-y-1'>
                      <li>• 21-day unbonding period</li>
                      <li>• Choose validators carefully</li>
                      <li>• Rewards vary by validator</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className='flex justify-between'>
        <Button
          variant='outline'
          onClick={onPrevious}
          className='flex items-center gap-2'
        >
          <ChevronLeft className='h-4 w-4' />
          Previous
        </Button>
        <Button onClick={onNext} className='flex items-center gap-2'>
          Continue with {currentNetwork.name}
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
