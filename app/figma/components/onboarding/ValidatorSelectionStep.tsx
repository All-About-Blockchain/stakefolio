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
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Shield,
  TrendingUp,
  Search,
  Filter,
  Star,
  AlertTriangle,
  CheckCircle,
  Info,
} from 'lucide-react';

interface ValidatorSelectionStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

interface Validator {
  name: string;
  address: string;
  commission: number;
  apy: number;
  votingPower: number;
  uptime: number;
  delegators: number;
  status: 'active' | 'jailed' | 'inactive';
  description: string;
  website?: string;
  security_contact?: string;
  self_bonded: number;
  rank: number;
}

export function ValidatorSelectionStep({
  onNext,
  onPrevious,
}: ValidatorSelectionStepProps) {
  const [selectedValidators, setSelectedValidators] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rank');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'top50'>(
    'active'
  );

  const validators: Validator[] = [
    {
      name: 'Cosmos Validator',
      address: 'cosmosvaloper1abc...',
      commission: 5.0,
      apy: 15.2,
      votingPower: 2.8,
      uptime: 99.9,
      delegators: 12453,
      status: 'active',
      description:
        'Professional validator with 24/7 monitoring and high security standards.',
      website: 'https://cosmos-validator.com',
      security_contact: 'security@cosmos-validator.com',
      self_bonded: 10000,
      rank: 1,
    },
    {
      name: 'Staking Facilities',
      address: 'cosmosvaloper1def...',
      commission: 8.0,
      apy: 14.6,
      votingPower: 2.1,
      uptime: 99.8,
      delegators: 8934,
      status: 'active',
      description:
        'Institutional-grade validator with enterprise security and governance participation.',
      website: 'https://stakingfacilities.com',
      security_contact: 'hello@stakingfacilities.com',
      self_bonded: 8500,
      rank: 2,
    },
    {
      name: 'Polychain Labs',
      address: 'cosmosvaloper1ghi...',
      commission: 10.0,
      apy: 14.3,
      votingPower: 1.9,
      uptime: 99.7,
      delegators: 7821,
      status: 'active',
      description:
        'Leading blockchain investment firm providing secure validation services.',
      website: 'https://polychain.capital',
      self_bonded: 12000,
      rank: 3,
    },
    {
      name: 'Figment',
      address: 'cosmosvaloper1jkl...',
      commission: 7.5,
      apy: 14.7,
      votingPower: 1.7,
      uptime: 99.9,
      delegators: 9234,
      status: 'active',
      description:
        'Professional staking infrastructure with educational resources and support.',
      website: 'https://figment.io',
      security_contact: 'security@figment.io',
      self_bonded: 9500,
      rank: 4,
    },
    {
      name: 'Binance Staking',
      address: 'cosmosvaloper1mno...',
      commission: 5.0,
      apy: 15.2,
      votingPower: 6.2,
      uptime: 99.5,
      delegators: 24567,
      status: 'active',
      description:
        'Large exchange validator with high voting power but centralization concerns.',
      website: 'https://binance.com',
      self_bonded: 15000,
      rank: 5,
    },
    {
      name: 'Sentinel',
      address: 'cosmosvaloper1pqr...',
      commission: 12.0,
      apy: 14.0,
      votingPower: 0.8,
      uptime: 98.9,
      delegators: 3421,
      status: 'active',
      description:
        'Community-focused validator with strong governance participation.',
      website: 'https://sentinel.co',
      self_bonded: 5000,
      rank: 15,
    },
  ];

  const filteredValidators = validators
    .filter((v) => {
      if (filterStatus === 'active') return v.status === 'active';
      if (filterStatus === 'top50') return v.rank <= 50;
      return true;
    })
    .filter((v) => v.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'rank':
          return a.rank - b.rank;
        case 'commission':
          return a.commission - b.commission;
        case 'apy':
          return b.apy - a.apy;
        case 'uptime':
          return b.uptime - a.uptime;
        case 'voting_power':
          return b.votingPower - a.votingPower;
        default:
          return a.rank - b.rank;
      }
    });

  const toggleValidator = (address: string) => {
    setSelectedValidators((prev) =>
      prev.includes(address)
        ? prev.filter((v) => v !== address)
        : [...prev, address]
    );
  };

  const getValidatorRisk = (validator: Validator) => {
    if (validator.votingPower > 5) return 'high';
    if (validator.uptime < 99.5) return 'medium';
    if (validator.commission > 10) return 'medium';
    return 'low';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'low':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  return (
    <div className='mx-auto max-w-6xl'>
      <Card className='mb-8'>
        <CardHeader className='text-center'>
          <CardTitle className='mb-4 flex items-center justify-center gap-2 text-2xl'>
            <Users className='h-6 w-6' />
            Choose Your Validators
          </CardTitle>
          <CardDescription className='text-lg'>
            Select reliable validators to stake your tokens with.
            Diversification across multiple validators reduces risk.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className='grid gap-8 lg:grid-cols-4'>
        {/* Main Content */}
        <div className='space-y-6 lg:col-span-3'>
          {/* Filters and Search */}
          <Card>
            <CardContent className='p-4'>
              <div className='flex flex-wrap items-center gap-4'>
                <div className='min-w-64 flex-1'>
                  <div className='relative'>
                    <Search className='text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform' />
                    <Input
                      placeholder='Search validators...'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className='pl-10'
                    />
                  </div>
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className='w-48'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='rank'>Sort by Rank</SelectItem>
                    <SelectItem value='commission'>
                      Sort by Commission
                    </SelectItem>
                    <SelectItem value='apy'>Sort by APY</SelectItem>
                    <SelectItem value='uptime'>Sort by Uptime</SelectItem>
                    <SelectItem value='voting_power'>
                      Sort by Voting Power
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filterStatus}
                  onValueChange={(value) => setFilterStatus(value as any)}
                >
                  <SelectTrigger className='w-32'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All</SelectItem>
                    <SelectItem value='active'>Active</SelectItem>
                    <SelectItem value='top50'>Top 50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Validator List */}
          <Card>
            <CardContent className='p-0'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-12'></TableHead>
                    <TableHead>Validator</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>APY</TableHead>
                    <TableHead>Uptime</TableHead>
                    <TableHead>Voting Power</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredValidators.map((validator) => {
                    const isSelected = selectedValidators.includes(
                      validator.address
                    );
                    const risk = getValidatorRisk(validator);

                    return (
                      <TableRow
                        key={validator.address}
                        className={isSelected ? 'bg-muted/50' : ''}
                      >
                        <TableCell>
                          <div className='flex items-center justify-center'>
                            <span className='text-muted-foreground text-sm'>
                              #{validator.rank}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className='font-medium'>{validator.name}</div>
                            <div className='text-muted-foreground max-w-32 truncate text-sm'>
                              {validator.address}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant='outline'>
                            {validator.commission}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className='font-medium text-green-600'>
                            {validator.apy}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              validator.uptime >= 99.5
                                ? 'text-green-600'
                                : 'text-yellow-600'
                            }
                          >
                            {validator.uptime}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              validator.votingPower > 5
                                ? 'text-red-600'
                                : 'text-green-600'
                            }
                          >
                            {validator.votingPower}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getRiskColor(risk)}
                            variant='secondary'
                          >
                            {risk}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant={isSelected ? 'default' : 'outline'}
                            size='sm'
                            onClick={() => toggleValidator(validator.address)}
                          >
                            {isSelected ? 'Selected' : 'Select'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Selected Validators */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Selected Validators</CardTitle>
              <CardDescription>
                {selectedValidators.length}/5 validators selected
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedValidators.length === 0 ? (
                <p className='text-muted-foreground text-sm'>
                  No validators selected yet
                </p>
              ) : (
                <div className='space-y-2'>
                  {selectedValidators.map((address) => {
                    const validator = validators.find(
                      (v) => v.address === address
                    );
                    return validator ? (
                      <div
                        key={address}
                        className='bg-muted/30 flex items-center justify-between rounded p-2'
                      >
                        <span className='text-sm font-medium'>
                          {validator.name}
                        </span>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => toggleValidator(address)}
                          className='h-6 w-6 p-0'
                        >
                          ×
                        </Button>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Validator Selection Tips */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <Shield className='h-5 w-5' />
                Selection Tips
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3 text-sm'>
              <div className='flex items-start gap-2'>
                <CheckCircle className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-600' />
                <p>Choose 3-5 validators to diversify risk</p>
              </div>
              <div className='flex items-start gap-2'>
                <CheckCircle className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-600' />
                <p>Prefer validators with 99.5%+ uptime</p>
              </div>
              <div className='flex items-start gap-2'>
                <CheckCircle className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-600' />
                <p>Avoid validators with &gt;10% voting power</p>
              </div>
              <div className='flex items-start gap-2'>
                <CheckCircle className='mt-0.5 h-4 w-4 flex-shrink-0 text-green-600' />
                <p>Consider commission rates (5-10% is typical)</p>
              </div>
              <div className='flex items-start gap-2'>
                <AlertTriangle className='mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-600' />
                <p>Research validator's track record and team</p>
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <TrendingUp className='h-5 w-5' />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue='overview' className='w-full'>
                <TabsList className='grid w-full grid-cols-2'>
                  <TabsTrigger value='overview' className='text-xs'>
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value='details' className='text-xs'>
                    Details
                  </TabsTrigger>
                </TabsList>

                <TabsContent value='overview' className='mt-4 space-y-3'>
                  <div className='text-sm'>
                    <div className='mb-1 flex justify-between'>
                      <span>Portfolio Risk</span>
                      <span className='font-medium text-green-600'>Low</span>
                    </div>
                    <div className='bg-muted h-2 w-full rounded-full'>
                      <div
                        className='h-2 rounded-full bg-green-500'
                        style={{ width: '25%' }}
                      ></div>
                    </div>
                  </div>
                  <div className='text-muted-foreground text-xs'>
                    Based on your selected validators' performance and
                    distribution.
                  </div>
                </TabsContent>

                <TabsContent value='details' className='mt-4 space-y-2 text-xs'>
                  <div className='flex justify-between'>
                    <span>Centralization Risk</span>
                    <span className='text-green-600'>Low</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Performance Risk</span>
                    <span className='text-green-600'>Low</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Slashing Risk</span>
                    <span className='text-yellow-600'>Medium</span>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedValidators.length > 0 && (
        <Alert className='mt-6'>
          <Info className='h-4 w-4' />
          <AlertDescription>
            You've selected {selectedValidators.length} validator
            {selectedValidators.length > 1 ? 's' : ''}. You can proceed to stake
            your tokens or continue selecting more validators for better
            diversification.
          </AlertDescription>
        </Alert>
      )}

      <div className='mt-8 flex justify-between'>
        <Button
          variant='outline'
          onClick={onPrevious}
          className='flex items-center gap-2'
        >
          <ChevronLeft className='h-4 w-4' />
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={selectedValidators.length === 0}
          className='flex items-center gap-2'
        >
          Start Staking ({selectedValidators.length} validator
          {selectedValidators.length !== 1 ? 's' : ''})
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
