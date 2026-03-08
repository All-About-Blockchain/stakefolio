import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  TOTAL_CRYPTO_MARKET_CAP,
  formatCurrency,
  MarketData,
  fallbackPrices,
} from '@/app/services/mockMarketData';
import { SortField, SortDirection } from '@/pages/index';

const COLORS = [
  '#F7931A', // BTC
  '#627EEA', // ETH
  '#14F195', // SOL
  '#F3BA2F', // BNB
  '#0033AD', // ADA
  '#E84142', // AVAX
  '#E6007A', // DOT
  '#8247E5', // POL
  '#00C08B', // NEAR
  '#2BDE89', // APT
  '#2E3148', // ATOM
];

interface MarketCapChartProps {
  data: MarketData[];
  livePrices: Record<string, number>;
  sortField: SortField;
  sortDirection: SortDirection;
}

export const MarketCapChart = ({
  data,
  livePrices,
  sortField,
  sortDirection,
}: MarketCapChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getMetricLabel = () => {
    switch (sortField) {
      case 'volume24h':
        return '24h Volume';
      case 'circulatingSupply':
        return 'Supply';
      case 'stakingApy':
        return 'Staking Yield';
      case 'inflationRate':
        return 'Inflation';
      case 'netApy':
        return 'Real Yield';
      case 'stakedUsd':
        return 'Value Staked (USD)';
      case 'percentLocked':
        return 'Total Staked %';
      default:
        return 'Market Cap';
    }
  };

  const formatMetricValue = (value: number) => {
    switch (sortField) {
      case 'marketCap':
      case 'volume24h':
      case 'circulatingSupply':
      case 'stakedUsd':
        return formatCurrency(value);
      case 'stakingApy':
      case 'inflationRate':
      case 'netApy':
      case 'percentLocked':
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString();
    }
  };

  const chartData = useMemo(() => {
    // Only map the Top 10 data without "Other" slice unless we are explicitly sorting by Market Cap
    const slices = data.map((item) => {
      let value = item[sortField as keyof MarketData] as number;
      if (sortField === 'netApy') {
        value = item.stakingApy - item.inflationRate;
      }

      // Calculate circulating supply by USD value for parity with table
      if (sortField === 'circulatingSupply') {
        value =
          item.circulatingSupply *
          (livePrices[item.symbol] || fallbackPrices[item.symbol]);
      }

      if (sortField === 'stakedUsd') {
        value =
          item.circulatingSupply *
          (livePrices[item.symbol] || fallbackPrices[item.symbol]) *
          (item.percentLocked / 100);
      }

      return {
        name: item.symbol,
        fullName: item.name,
        value: Math.max(0, value), // Ensure we don't pass negative slices (e.g. negative net APY or deflation)
        originalValue: value,
      };
    });

    const modifier = sortDirection === 'asc' ? 1 : -1;
    let sortedSlices = slices.sort((a, b) =>
      a.value < b.value ? -1 * modifier : a.value > b.value ? 1 * modifier : 0
    );

    // Only add "Other Crypto" slice if we're viewing Market Cap dominance, since standard percentage metrics don't make sense compared to Total Crypto MC
    if (sortField === 'marketCap') {
      const top10MC = data.reduce((acc, curr) => acc + curr.marketCap, 0);
      const otherMC = Math.max(0, TOTAL_CRYPTO_MARKET_CAP - top10MC);
      sortedSlices.push({
        name: 'Other',
        fullName: 'Other Crypto',
        value: otherMC,
        originalValue: otherMC,
      });
    }

    return sortedSlices;
  }, [data, sortField, sortDirection]);

  // Adjust colors dynamically so they stay consistent to their symbols, except "Other"
  const chartColors = useMemo(() => {
    return chartData.map((slice) => {
      if (slice.name === 'Other') return '#334155';
      const originalIndex = data.findIndex(
        (item) => item.symbol === slice.name
      );
      return COLORS[originalIndex % COLORS.length];
    });
  }, [chartData, data]);

  return (
    <div className='group relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl transition-all duration-500'>
      {/* Decorative gradient blob */}
      <div className='absolute left-1/2 top-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/20 blur-[80px] transition-transform duration-1000 group-hover:scale-150'></div>

      <h3 className='mb-2 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-center text-2xl font-bold tracking-tight text-transparent'>
        Stakable Dominance
      </h3>
      <p className='mb-6 text-center text-sm font-medium text-gray-400'>
        Top 10 by {getMetricLabel()}
      </p>

      <div className='h-[350px] w-full'>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={chartData}
              cx='50%'
              cy='50%'
              startAngle={90}
              endAngle={-270}
              innerRadius={90}
              outerRadius={125}
              fill='#8884d8'
              dataKey='value'
              onMouseEnter={(_, index) => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              stroke='rgba(255,255,255,0.05)'
              strokeWidth={4}
              cornerRadius={8}
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={chartColors[index]}
                  className='cursor-pointer outline-none transition-all duration-300'
                  style={{
                    opacity:
                      hoveredIndex === null || hoveredIndex === index ? 1 : 0.6,
                    transform:
                      hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                    transformOrigin: 'center center',
                  }}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(
                value: any,
                name: any,
                props: {
                  payload?: { fullName?: string; originalValue?: number };
                }
              ) => [
                formatMetricValue(
                  props.payload?.originalValue ?? (value as number)
                ),
                props.payload?.fullName || getMetricLabel(),
              ]}
              labelFormatter={() => getMetricLabel()}
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderColor: 'rgba(255,255,255,0.1)',
                borderRadius: '1rem',
                color: '#fff',
                boxShadow:
                  '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
              }}
              itemStyle={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className='custom-scrollbar mt-8 flex max-h-32 w-full flex-wrap justify-center gap-x-4 gap-y-3 overflow-y-auto pr-2'>
        {chartData.map((entry, index) => (
          <div
            key={entry.name}
            className={`flex min-w-[120px] cursor-pointer items-center justify-between gap-3 rounded-full border border-white/5 px-3 py-1.5 transition-all duration-300 ${index === hoveredIndex ? 'scale-105 bg-white/10 shadow-lg' : 'bg-transparent hover:bg-white/5'}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className='flex items-center gap-2'>
              <span
                className='h-3 w-3 flex-shrink-0 rounded-full shadow-inner'
                style={{ backgroundColor: chartColors[index] }}
              />
              <span
                className={`text-xs font-semibold ${index === hoveredIndex ? 'text-white' : 'text-gray-400'}`}
              >
                {entry.name}
              </span>
            </div>
            <span className='ml-auto whitespace-nowrap text-xs font-bold text-gray-300'>
              {formatMetricValue(entry.originalValue)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
