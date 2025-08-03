import React from 'react';
import {
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Shield,
  Users,
  Globe,
  Zap,
  TrendingUp,
} from 'lucide-react';

interface BlockchainEducationStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export function BlockchainEducationStep({
  onNext,
  onPrevious,
}: BlockchainEducationStepProps) {
  const concepts = [
    {
      icon: <Shield className='h-8 w-8 text-blue-500' />,
      title: 'Proof of Stake',
      description:
        'A consensus mechanism where validators stake tokens to secure the network and earn rewards for their participation.',
      details:
        'Instead of mining, validators are chosen to create new blocks based on the amount of tokens they have staked.',
    },
    {
      icon: <Users className='h-8 w-8 text-purple-500' />,
      title: 'Validators',
      description:
        "Network participants who run nodes to validate transactions and maintain the blockchain's security.",
      details:
        'Validators earn rewards for their work and can charge a commission fee from delegators.',
    },
    {
      icon: <Globe className='h-8 w-8 text-emerald-500' />,
      title: 'Delegators',
      description:
        'Token holders who delegate their tokens to validators to earn staking rewards.',
      details:
        'Delegators maintain ownership of their tokens while earning passive income through staking.',
    },
    {
      icon: <Zap className='h-8 w-8 text-amber-500' />,
      title: 'Staking Rewards',
      description:
        'Incentives paid to validators and delegators for participating in network security.',
      details:
        'Rewards are typically 5-20% APY and are distributed in the native token of the network.',
    },
  ];

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='mb-8 text-center'>
        <div className='mb-6 flex justify-center'>
          <div className='pastel-glow flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500'>
            <BookOpen className='h-8 w-8 text-white' />
          </div>
        </div>
        <h2 className='mb-4 text-4xl font-bold text-gray-800'>
          Understanding Blockchain Staking
        </h2>
        <p className='mx-auto max-w-3xl text-xl text-gray-600'>
          Learn the fundamental concepts behind blockchain staking and how you
          can earn passive income while contributing to network security.
        </p>
      </div>

      {/* Concepts Grid */}
      <div className='grid gap-6 md:grid-cols-2'>
        {concepts.map((concept, index) => (
          <div
            key={index}
            className='glass-ultra-light rounded-xl p-6 transition-all duration-300 hover:scale-105'
          >
            <div className='flex items-start gap-4'>
              <div className='glass-subtle pastel-glow flex h-12 w-12 items-center justify-center rounded-xl'>
                {concept.icon}
              </div>
              <div className='flex-1'>
                <h3 className='mb-2 text-xl font-semibold text-gray-800'>
                  {concept.title}
                </h3>
                <p className='mb-3 text-gray-600'>{concept.description}</p>
                <p className='rounded-lg bg-gray-50 p-3 text-sm text-gray-500'>
                  {concept.details}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Key Benefits */}
      <div className='glass-card luxury-shadow-light rounded-xl border-0 p-8'>
        <h3 className='mb-6 text-center text-2xl font-semibold text-gray-800'>
          Why Stake Your Tokens?
        </h3>
        <div className='grid gap-6 md:grid-cols-3'>
          <div className='text-center'>
            <div className='pastel-glow mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500'>
              <TrendingUp className='h-8 w-8 text-white' />
            </div>
            <h4 className='mb-2 text-lg font-semibold text-gray-800'>
              Earn Passive Income
            </h4>
            <p className='text-gray-600'>
              Generate 5-20% APY through staking rewards
            </p>
          </div>
          <div className='text-center'>
            <div className='pastel-glow mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500'>
              <Shield className='h-8 w-8 text-white' />
            </div>
            <h4 className='mb-2 text-lg font-semibold text-gray-800'>
              Network Security
            </h4>
            <p className='text-gray-600'>Help secure the blockchain network</p>
          </div>
          <div className='text-center'>
            <div className='pastel-glow mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500'>
              <Users className='h-8 w-8 text-white' />
            </div>
            <h4 className='mb-2 text-lg font-semibold text-gray-800'>
              Governance Rights
            </h4>
            <p className='text-gray-600'>Participate in network decisions</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className='flex justify-between pt-8'>
        <button
          onClick={onPrevious}
          className='glass-button flex items-center gap-2 rounded-lg border-0 px-6 py-3'
        >
          <ChevronLeft className='h-5 w-5' />
          Previous
        </button>
        <button
          onClick={onNext}
          className='soft-shadow flex items-center gap-2 rounded-lg border-0 bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 text-white transition-all duration-300 hover:scale-105'
        >
          Next: Create Wallet
          <ChevronRight className='h-5 w-5' />
        </button>
      </div>
    </div>
  );
}
