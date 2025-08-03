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
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  ChevronLeft,
  TrendingUp,
  Calendar,
  DollarSign,
  Shield,
  Clock,
  CheckCircle,
  Star,
  Gift,
  Users,
  Zap,
} from 'lucide-react';

interface StakingStepProps {
  onPrevious: () => void;
  onNext?: () => void;
}

export function StakingStep({ onPrevious, onNext }: StakingStepProps) {
  const [stakeAmount, setStakeAmount] = useState('');
  const [distributionMethod, setDistributionMethod] = useState<
    'equal' | 'weighted'
  >('equal');
  const [isStaking, setIsStaking] = useState(false);
  const [stakingComplete, setStakingComplete] = useState(false);

  // Mock data
  const selectedValidators = [
    { name: 'Cosmos Validator', commission: 5.0, apy: 15.2 },
    { name: 'Staking Facilities', commission: 8.0, apy: 14.6 },
    { name: 'Figment', commission: 7.5, apy: 14.7 },
  ];

  const availableBalance = 145.67;
  const estimatedRewards = stakeAmount
    ? (parseFloat(stakeAmount) * 0.15).toFixed(2)
    : '0';
  const averageApy =
    selectedValidators.reduce((sum, v) => sum + v.apy, 0) /
    selectedValidators.length;

  const handleStake = async () => {
    setIsStaking(true);
    // Simulate staking process
    setTimeout(() => {
      setIsStaking(false);
      setStakingComplete(true);
    }, 3000);
  };

  if (stakingComplete) {
    return (
      <div className='mx-auto max-w-4xl'>
        {/* Success State */}
        <Card className='mb-8 text-center'>
          <CardContent className='pb-8 pt-8'>
            <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600'>
              <CheckCircle className='h-10 w-10 text-white' />
            </div>
            <CardTitle className='mb-4 text-3xl text-green-600'>
              Staking Successful! 🎉
            </CardTitle>
            <CardDescription className='mx-auto mb-8 max-w-2xl text-lg'>
              Congratulations! You've successfully staked {stakeAmount} ATOM
              across {selectedValidators.length} validators. Your tokens are now
              earning rewards and helping secure the Cosmos network.
            </CardDescription>

            <div className='mb-8 grid gap-6 md:grid-cols-3'>
              <div className='rounded-lg bg-green-50 p-4 dark:bg-green-900/20'>
                <DollarSign className='mx-auto mb-2 h-8 w-8 text-green-600' />
                <div className='font-semibold text-green-600'>
                  ${estimatedRewards}
                </div>
                <div className='text-muted-foreground text-sm'>
                  Estimated Annual Rewards
                </div>
              </div>
              <div className='rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20'>
                <TrendingUp className='mx-auto mb-2 h-8 w-8 text-blue-600' />
                <div className='font-semibold text-blue-600'>
                  {averageApy.toFixed(1)}%
                </div>
                <div className='text-muted-foreground text-sm'>Average APY</div>
              </div>
              <div className='rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20'>
                <Calendar className='mx-auto mb-2 h-8 w-8 text-purple-600' />
                <div className='font-semibold text-purple-600'>21 Days</div>
                <div className='text-muted-foreground text-sm'>
                  Unbonding Period
                </div>
              </div>
            </div>

            <div className='grid gap-6 md:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>What Happens Next?</CardTitle>
                </CardHeader>
                <CardContent className='space-y-3 text-left text-sm'>
                  <div className='flex items-start gap-3'>
                    <div className='flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30'>
                      <span className='text-xs font-semibold text-blue-600'>
                        1
                      </span>
                    </div>
                    <p>
                      Your staked tokens will start earning rewards within 24
                      hours
                    </p>
                  </div>
                  <div className='flex items-start gap-3'>
                    <div className='flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30'>
                      <span className='text-xs font-semibold text-purple-600'>
                        2
                      </span>
                    </div>
                    <p>
                      Rewards are automatically added to your staked balance
                    </p>
                  </div>
                  <div className='flex items-start gap-3'>
                    <div className='flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30'>
                      <span className='text-xs font-semibold text-green-600'>
                        3
                      </span>
                    </div>
                    <p>
                      You can claim rewards or restake them for compound growth
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>
                    Your Staking Portfolio
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  {selectedValidators.map((validator, index) => (
                    <div
                      key={index}
                      className='bg-muted/30 flex items-center justify-between rounded p-2'
                    >
                      <span className='text-sm font-medium'>
                        {validator.name}
                      </span>
                      <div className='text-right'>
                        <div className='text-sm font-medium'>
                          {(
                            parseFloat(stakeAmount) / selectedValidators.length
                          ).toFixed(2)}{' '}
                          ATOM
                        </div>
                        <div className='text-muted-foreground text-xs'>
                          {validator.apy}% APY
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className='mt-8 flex flex-col justify-center gap-4 sm:flex-row'>
              <Button onClick={onNext} className='flex items-center gap-2'>
                <TrendingUp className='h-4 w-4' />
                View Dashboard
              </Button>
              <Button variant='outline' className='flex items-center gap-2'>
                <Users className='h-4 w-4' />
                Join Community
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <div className='grid gap-6 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Gift className='h-5 w-5' />
                Keep Learning
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3 text-sm'>
              <div className='flex items-center gap-2'>
                <div className='bg-primary h-2 w-2 rounded-full'></div>
                <span>Join our Discord community for tips and updates</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='bg-primary h-2 w-2 rounded-full'></div>
                <span>Follow validator updates and governance proposals</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='bg-primary h-2 w-2 rounded-full'></div>
                <span>Explore other Cosmos ecosystem protocols</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='bg-primary h-2 w-2 rounded-full'></div>
                <span>Learn about liquid staking and DeFi opportunities</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Shield className='h-5 w-5' />
                Security Reminders
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3 text-sm'>
              <div className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-red-500'></div>
                <span>Never share your seed phrase with anyone</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-red-500'></div>
                <span>Keep multiple backups of your wallet in safe places</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-red-500'></div>
                <span>Use hardware wallets for large amounts</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-red-500'></div>
                <span>Be cautious of phishing attempts and fake websites</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-4xl'>
      <Card className='mb-8'>
        <CardHeader className='text-center'>
          <CardTitle className='mb-4 flex items-center justify-center gap-2 text-2xl'>
            <TrendingUp className='h-6 w-6' />
            Stake Your Tokens
          </CardTitle>
          <CardDescription className='text-lg'>
            Complete your journey by staking your ATOM tokens and start earning
            rewards.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className='grid gap-8 lg:grid-cols-2'>
        {/* Staking Form */}
        <Card>
          <CardHeader>
            <CardTitle>Stake Configuration</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='stakeAmount'>Amount to Stake (ATOM)</Label>
              <Input
                id='stakeAmount'
                type='number'
                placeholder='0.00'
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                max={availableBalance}
              />
              <div className='text-muted-foreground flex justify-between text-sm'>
                <span>Available Balance: {availableBalance} ATOM</span>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setStakeAmount(availableBalance.toString())}
                  className='text-primary h-auto p-0'
                >
                  Max
                </Button>
              </div>
            </div>

            <div className='space-y-3'>
              <Label>Distribution Method</Label>
              <div className='space-y-2'>
                <div className='flex items-center space-x-2'>
                  <input
                    type='radio'
                    id='equal'
                    name='distribution'
                    value='equal'
                    checked={distributionMethod === 'equal'}
                    onChange={(e) =>
                      setDistributionMethod(
                        e.target.value as 'equal' | 'weighted'
                      )
                    }
                    className='rounded-full'
                  />
                  <Label htmlFor='equal' className='text-sm'>
                    Equal distribution across all validators
                  </Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <input
                    type='radio'
                    id='weighted'
                    name='distribution'
                    value='weighted'
                    checked={distributionMethod === 'weighted'}
                    onChange={(e) =>
                      setDistributionMethod(
                        e.target.value as 'equal' | 'weighted'
                      )
                    }
                    className='rounded-full'
                  />
                  <Label htmlFor='weighted' className='text-sm'>
                    Weighted by validator performance
                  </Label>
                </div>
              </div>
            </div>

            {stakeAmount && (
              <div className='bg-muted/50 space-y-2 rounded-lg p-4'>
                <h4 className='font-semibold'>Staking Summary</h4>
                <div className='space-y-1 text-sm'>
                  <div className='flex justify-between'>
                    <span>Amount to Stake</span>
                    <span>{stakeAmount} ATOM</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Estimated Annual Rewards</span>
                    <span className='text-green-600'>
                      {estimatedRewards} ATOM
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Average APY</span>
                    <span className='text-green-600'>
                      {averageApy.toFixed(1)}%
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Validators</span>
                    <span>{selectedValidators.length}</span>
                  </div>
                </div>
              </div>
            )}

            <Alert>
              <Clock className='h-4 w-4' />
              <AlertDescription>
                <strong>Important:</strong> Staked tokens have a 21-day
                unbonding period. During this time, your tokens won't earn
                rewards and cannot be transferred.
              </AlertDescription>
            </Alert>

            <Button
              className='w-full'
              onClick={handleStake}
              disabled={
                !stakeAmount ||
                parseFloat(stakeAmount) <= 0 ||
                parseFloat(stakeAmount) > availableBalance ||
                isStaking
              }
            >
              {isStaking ? (
                <div className='flex items-center gap-2'>
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                  Staking in Progress...
                </div>
              ) : (
                <div className='flex items-center gap-2'>
                  <Zap className='h-4 w-4' />
                  Stake {stakeAmount || '0'} ATOM
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Information Panel */}
        <div className='space-y-6'>
          {/* Selected Validators */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Star className='h-5 w-5' />
                Selected Validators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {selectedValidators.map((validator, index) => (
                  <div
                    key={index}
                    className='bg-muted/30 flex items-center justify-between rounded-lg p-3'
                  >
                    <div>
                      <div className='font-medium'>{validator.name}</div>
                      <div className='text-muted-foreground text-sm'>
                        Commission: {validator.commission}%
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='font-medium text-green-600'>
                        {validator.apy}% APY
                      </div>
                      {stakeAmount && (
                        <div className='text-muted-foreground text-sm'>
                          {distributionMethod === 'equal'
                            ? (
                                parseFloat(stakeAmount) /
                                selectedValidators.length
                              ).toFixed(2)
                            : (
                                parseFloat(stakeAmount) *
                                (validator.apy /
                                  selectedValidators.reduce(
                                    (s, v) => s + v.apy,
                                    0
                                  ))
                              ).toFixed(2)}{' '}
                          ATOM
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Staking Progress */}
          {isStaking && (
            <Card>
              <CardHeader>
                <CardTitle>Staking Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span>Creating stake transactions...</span>
                      <span>60%</span>
                    </div>
                    <Progress value={60} />
                  </div>
                  <div className='text-muted-foreground text-sm'>
                    Please wait while we process your staking transactions. This
                    may take a few minutes.
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Staking Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Gift className='h-5 w-5' />
                Staking Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3 text-sm'>
              <div className='flex items-start gap-2'>
                <TrendingUp className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-600' />
                <p>Earn passive income through network rewards</p>
              </div>
              <div className='flex items-start gap-2'>
                <Shield className='mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600' />
                <p>Help secure the Cosmos network</p>
              </div>
              <div className='flex items-start gap-2'>
                <Users className='mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600' />
                <p>Participate in network governance</p>
              </div>
              <div className='flex items-start gap-2'>
                <DollarSign className='mt-0.5 h-4 w-4 flex-shrink-0 text-orange-600' />
                <p>Potential for compound growth</p>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Pro Tips</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2 text-sm'>
              <div className='flex items-start gap-2'>
                <div className='bg-primary mt-2 h-2 w-2 flex-shrink-0 rounded-full'></div>
                <p>
                  Regularly claim and restake rewards for maximum compound
                  growth
                </p>
              </div>
              <div className='flex items-start gap-2'>
                <div className='bg-primary mt-2 h-2 w-2 flex-shrink-0 rounded-full'></div>
                <p>
                  Monitor validator performance and adjust your delegation if
                  needed
                </p>
              </div>
              <div className='flex items-start gap-2'>
                <div className='bg-primary mt-2 h-2 w-2 flex-shrink-0 rounded-full'></div>
                <p>
                  Stay informed about network upgrades and governance proposals
                </p>
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
        <div className='text-muted-foreground flex items-center text-sm'>
          Ready to start earning rewards? Complete your staking above.
        </div>
      </div>
    </div>
  );
}
