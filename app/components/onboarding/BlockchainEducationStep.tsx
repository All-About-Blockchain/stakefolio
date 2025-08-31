import React from 'react';
import { BookOpen, Shield, TrendingUp, Zap, Users, Globe } from 'lucide-react';

interface BlockchainEducationStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export function BlockchainEducationStep({
  onNext,
  onPrevious,
}: BlockchainEducationStepProps) {
  return (
    <div className='space-y-8 text-left'>
      <div>
        <h2 className='text-3xl font-bold text-gray-800'>
          Understanding Blockchain & Staking
        </h2>
        <p className='mt-2 text-lg text-gray-600'>
          Learn the fundamentals of blockchain technology and how staking works.
        </p>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        {/* What is Blockchain */}
        <div className='glass-card luxury-shadow-light rounded-xl border-0 p-6'>
          <div className='mb-4 flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500'>
              <Globe className='h-5 w-5 text-white' />
            </div>
            <h3 className='text-xl font-semibold text-gray-800'>
              What is Blockchain?
            </h3>
          </div>
          <p className='text-gray-600'>
            A blockchain is a distributed digital ledger that records
            transactions across a network of computers. It&apos;s secure,
            transparent, and decentralized - no single entity controls it.
          </p>
          <ul className='mt-3 space-y-1 text-sm text-gray-500'>
            <li>• Immutable transaction records</li>
            <li>• Decentralized network</li>
            <li>• Cryptographic security</li>
          </ul>
        </div>

        {/* What is Staking */}
        <div className='glass-card luxury-shadow-light rounded-xl border-0 p-6'>
          <div className='mb-4 flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500'>
              <TrendingUp className='h-5 w-5 text-white' />
            </div>
            <h3 className='text-xl font-semibold text-gray-800'>
              What is Staking?
            </h3>
          </div>
          <p className='text-gray-600'>
            Staking is the process of participating in a blockchain network by
            &quot;locking up&quot; your tokens to help secure the network and
            earn rewards in return.
          </p>
          <ul className='mt-3 space-y-1 text-sm text-gray-500'>
            <li>• Earn passive income</li>
            <li>• Help secure the network</li>
            <li>• Participate in governance</li>
          </ul>
        </div>

        {/* How Staking Works */}
        <div className='glass-card luxury-shadow-light rounded-xl border-0 p-6'>
          <div className='mb-4 flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500'>
              <Zap className='h-5 w-5 text-white' />
            </div>
            <h3 className='text-xl font-semibold text-gray-800'>
              How Staking Works
            </h3>
          </div>
          <p className='text-gray-600'>
            When you stake tokens, you delegate them to validators who process
            transactions and maintain the blockchain. In return, you earn a
            portion of the transaction fees and new tokens.
          </p>
          <ul className='mt-3 space-y-1 text-sm text-gray-500'>
            <li>• Choose a validator</li>
            <li>• Delegate your tokens</li>
            <li>• Earn rewards automatically</li>
          </ul>
        </div>

        {/* Benefits of Staking */}
        <div className='glass-card luxury-shadow-light rounded-xl border-0 p-6'>
          <div className='mb-4 flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500'>
              <Users className='h-5 w-5 text-white' />
            </div>
            <h3 className='text-xl font-semibold text-gray-800'>
              Benefits of Staking
            </h3>
          </div>
          <p className='text-gray-600'>
            Staking offers multiple benefits including earning passive income,
            participating in network governance, and supporting the blockchain
            ecosystem.
          </p>
          <ul className='mt-3 space-y-1 text-sm text-gray-500'>
            <li>• Earn 5-20% annual returns</li>
            <li>• Vote on network proposals</li>
            <li>• Support decentralization</li>
          </ul>
        </div>
      </div>

      {/* Key Concepts */}
      <div className='glass-card luxury-shadow-light rounded-xl border-0 p-6'>
        <h3 className='mb-4 text-xl font-semibold text-gray-800'>
          Key Concepts to Know
        </h3>
        <div className='grid gap-4 md:grid-cols-3'>
          <div className='space-y-2'>
            <h4 className='font-medium text-gray-800'>Validators</h4>
            <p className='text-sm text-gray-600'>
              Network participants who process transactions and maintain the
              blockchain.
            </p>
          </div>
          <div className='space-y-2'>
            <h4 className='font-medium text-gray-800'>Delegators</h4>
            <p className='text-sm text-gray-600'>
              Token holders who stake their tokens with validators to earn
              rewards.
            </p>
          </div>
          <div className='space-y-2'>
            <h4 className='font-medium text-gray-800'>APR/APY</h4>
            <p className='text-sm text-gray-600'>
              Annual Percentage Rate/Yield - the return you can expect from
              staking.
            </p>
          </div>
          <div className='space-y-2'>
            <h4 className='font-medium text-gray-800'>Unbonding Period</h4>
            <p className='text-sm text-gray-600'>
              Time required to unstake tokens (usually 21 days for Cosmos
              chains).
            </p>
          </div>
          <div className='space-y-2'>
            <h4 className='font-medium text-gray-800'>Slashing</h4>
            <p className='text-sm text-gray-600'>
              Penalty for validators who act maliciously or go offline.
            </p>
          </div>
          <div className='space-y-2'>
            <h4 className='font-medium text-gray-800'>Governance</h4>
            <p className='text-sm text-gray-600'>
              Process where stakers vote on network upgrades and proposals.
            </p>
          </div>
        </div>
      </div>

      {/* Safety Tips */}
      <div className='glass-card luxury-shadow-light rounded-xl border-0 p-6'>
        <div className='mb-4 flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500'>
            <Shield className='h-5 w-5 text-white' />
          </div>
          <h3 className='text-xl font-semibold text-gray-800'>Safety Tips</h3>
        </div>
        <div className='grid gap-4 md:grid-cols-2'>
          <div className='space-y-3'>
            <div className='flex items-start gap-3'>
              <div className='mt-1 h-2 w-2 rounded-full bg-green-500'></div>
              <div>
                <h4 className='font-medium text-gray-800'>
                  Choose Reputable Validators
                </h4>
                <p className='text-sm text-gray-600'>
                  Research validators with good uptime and commission rates.
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <div className='mt-1 h-2 w-2 rounded-full bg-green-500'></div>
              <div>
                <h4 className='font-medium text-gray-800'>
                  Diversify Your Stakes
                </h4>
                <p className='text-sm text-gray-600'>
                  Don&apos;t put all your tokens with one validator.
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <div className='mt-1 h-2 w-2 rounded-full bg-green-500'></div>
              <div>
                <h4 className='font-medium text-gray-800'>
                  Keep Your Keys Safe
                </h4>
                <p className='text-sm text-gray-600'>
                  Never share your private keys or seed phrases.
                </p>
              </div>
            </div>
          </div>
          <div className='space-y-3'>
            <div className='flex items-start gap-3'>
              <div className='mt-1 h-2 w-2 rounded-full bg-red-500'></div>
              <div>
                <h4 className='font-medium text-gray-800'>
                  Avoid High Commission
                </h4>
                <p className='text-sm text-gray-600'>
                  Validators with very high commission rates reduce your
                  earnings.
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <div className='mt-1 h-2 w-2 rounded-full bg-red-500'></div>
              <div>
                <h4 className='font-medium text-gray-800'>
                  Don&apos;t Trust Unknown Sources
                </h4>
                <p className='text-sm text-gray-600'>
                  Only use official wallets and verified applications.
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <div className='mt-1 h-2 w-2 rounded-full bg-red-500'></div>
              <div>
                <h4 className='font-medium text-gray-800'>Beware of Scams</h4>
                <p className='text-sm text-gray-600'>
                  Never send tokens to unknown addresses or suspicious links.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className='flex items-center justify-between'>
        <button
          onClick={onPrevious}
          className='glass-button rounded-lg px-6 py-3'
        >
          Previous
        </button>
        <div className='flex items-center gap-3'>
          <button
            onClick={() => window.location.assign('/')}
            className='glass-button rounded-lg px-6 py-3'
          >
            Skip to Dashboard
          </button>
          <button
            onClick={onNext}
            className='rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 text-white'
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
