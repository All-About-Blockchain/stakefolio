import React from 'react';
import {
  ChevronRight,
  Rocket,
  Star,
  Zap,
  TrendingUp,
  Shield,
  Users,
  Award,
  Sparkles,
  DollarSign,
} from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  const features = [
    {
      icon: <DollarSign className='h-6 w-6 text-amber-500' />,
      title: 'Earn Passive Income',
      description: 'Generate returns of 10-20% APY through staking rewards',
    },
    {
      icon: <Shield className='h-6 w-6 text-blue-500' />,
      title: 'Secure & Decentralized',
      description:
        'Help secure blockchain networks while maintaining full custody',
    },
    {
      icon: <Users className='h-6 w-6 text-purple-500' />,
      title: 'Community Driven',
      description: 'Join a global community of validators and delegators',
    },
    {
      icon: <Award className='h-6 w-6 text-emerald-500' />,
      title: 'Governance Rights',
      description: 'Participate in network governance and protocol decisions',
    },
  ];

  const stats = [
    {
      label: 'Total Value Staked',
      value: '$45B+',
      gradient: 'from-purple-500 to-blue-500',
    },
    {
      label: 'Active Networks',
      value: '50+',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      label: 'Average APY',
      value: '15%',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      label: 'Global Users',
      value: '2M+',
      gradient: 'from-emerald-500 to-cyan-500',
    },
  ];

  return (
    <div className='space-y-8'>
      {/* Hero Section */}
      <div className='glass-card luxury-shadow-light relative overflow-hidden rounded-xl border-0'>
        <div className='gradient-cosmic absolute right-0 top-0 h-64 w-64 rounded-full opacity-30 blur-3xl'></div>
        <div className='relative z-10 p-12 text-center'>
          <div className='mb-6 flex justify-center'>
            <div className='pastel-glow floating-card flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500'>
              <Rocket className='h-10 w-10 text-white' />
            </div>
          </div>

          <h1 className='mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-5xl font-bold text-transparent'>
            Welcome to Cosmos Staking
          </h1>

          <p className='mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-gray-600'>
            Discover the world of blockchain staking and start earning passive
            income while contributing to network security. Our comprehensive
            guide will take you from beginner to staking expert.
          </p>

          <div className='mb-8 flex flex-wrap justify-center gap-4'>
            <span className='flex items-center gap-2 rounded-full border-0 bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-lg text-white'>
              <Star className='h-4 w-4' />
              Beginner Friendly
            </span>
            <span className='flex items-center gap-2 rounded-full border-0 bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 text-lg text-white'>
              <Zap className='h-4 w-4' />
              Step-by-Step Guide
            </span>
            <span className='flex items-center gap-2 rounded-full border-0 bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-lg text-white'>
              <TrendingUp className='h-4 w-4' />
              High Rewards
            </span>
          </div>

          <button
            onClick={onNext}
            className='soft-shadow mx-auto flex items-center gap-2 rounded-lg border-0 bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-4 text-lg text-white transition-all duration-300 hover:scale-105'
          >
            Start Your Journey
            <ChevronRight className='h-5 w-5' />
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className='grid gap-6 md:grid-cols-2'>
        {features.map((feature, index) => (
          <div
            key={index}
            className='glass-card luxury-shadow-light rounded-xl border-0 p-8 transition-all duration-300 hover:scale-105'
          >
            <div className='flex items-start gap-4'>
              <div className='glass-subtle pastel-glow flex h-14 w-14 items-center justify-center rounded-xl'>
                {feature.icon}
              </div>
              <div className='flex-1'>
                <h3 className='mb-2 text-xl font-semibold text-gray-800'>
                  {feature.title}
                </h3>
                <p className='leading-relaxed text-gray-600'>
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className='glass-card luxury-shadow-light rounded-xl border-0 p-8'>
        <div className='mb-8 text-center'>
          <h2 className='mb-2 flex items-center justify-center gap-3 text-3xl font-bold text-gray-800'>
            <Sparkles className='h-8 w-8 text-purple-500' />
            Ecosystem Overview
          </h2>
          <p className='text-lg text-gray-600'>
            Join the thriving Cosmos staking ecosystem
          </p>
        </div>

        <div className='grid grid-cols-2 gap-6 lg:grid-cols-4'>
          {stats.map((stat, index) => (
            <div key={index} className='text-center'>
              <div
                className={`h-16 w-16 bg-gradient-to-r ${stat.gradient} pastel-glow mx-auto mb-4 flex items-center justify-center rounded-full`}
              >
                <TrendingUp className='h-8 w-8 text-white' />
              </div>
              <div className='mb-2 text-3xl font-bold text-gray-800'>
                {stat.value}
              </div>
              <div className='text-gray-500'>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className='glass-card luxury-shadow-light rounded-xl border-0 p-8 text-center'>
        <h3 className='mb-4 text-2xl font-semibold text-gray-800'>
          Ready to Start Earning?
        </h3>
        <p className='mb-6 text-lg text-gray-600'>
          This comprehensive guide will walk you through everything you need to
          know about Cosmos staking, from wallet setup to validator selection
          and beyond.
        </p>
        <div className='flex flex-col justify-center gap-4 sm:flex-row'>
          <button
            onClick={onNext}
            className='soft-shadow flex items-center gap-2 rounded-lg border-0 bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-4 text-lg text-white transition-all duration-300 hover:scale-105'
          >
            Begin Learning
            <ChevronRight className='h-5 w-5' />
          </button>
          <button className='glass-button flex items-center gap-2 rounded-lg border-0 px-8 py-4 text-lg'>
            <Star className='h-5 w-5' />
            View Demo
          </button>
        </div>
      </div>
    </div>
  );
}
