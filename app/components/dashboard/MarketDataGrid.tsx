import React, { useMemo } from 'react';
import {
  formatCurrency,
  formatNumber,
  MarketData,
  fallbackPrices,
} from '@/app/services/mockMarketData';
import { SortField, SortDirection } from '@/pages/index';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface MarketDataGridProps {
  data: MarketData[];
  livePrices: Record<string, number>;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

export const MarketDataGrid = ({
  data,
  livePrices,
  sortField,
  sortDirection,
  onSort,
}: MarketDataGridProps) => {
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      let aVal = a[sortField as keyof MarketData] as number;
      let bVal = b[sortField as keyof MarketData] as number;

      // Calculate net APY dynamically for sorting
      if (sortField === 'netApy') {
        aVal = a.stakingApy - a.inflationRate;
        bVal = b.stakingApy - b.inflationRate;
      }

      // Sort circulating supply by USD for fair comparison
      if (sortField === 'circulatingSupply') {
        aVal =
          a.circulatingSupply *
          (livePrices[a.symbol] || fallbackPrices[a.symbol]);
        bVal =
          b.circulatingSupply *
          (livePrices[b.symbol] || fallbackPrices[b.symbol]);
      }

      if (sortField === 'stakedUsd') {
        const aPrice = livePrices[a.symbol] || fallbackPrices[a.symbol];
        const bPrice = livePrices[b.symbol] || fallbackPrices[b.symbol];
        aVal = a.circulatingSupply * aPrice * (a.percentLocked / 100);
        bVal = b.circulatingSupply * bPrice * (b.percentLocked / 100);
      }

      const modifier = sortDirection === 'asc' ? 1 : -1;
      return aVal < bVal ? -1 * modifier : aVal > bVal ? 1 * modifier : 0;
    });
  }, [data, sortField, sortDirection, livePrices]);

  const SortHeader = ({
    field,
    label,
  }: {
    field: SortField | 'name';
    label: string;
  }) => (
    <th
      scope='col'
      className={`group cursor-pointer px-6 py-5 font-semibold tracking-wider transition-colors hover:bg-white/5 ${field !== 'name' ? 'hover:text-white' : ''} ${sortField === field ? 'text-white' : ''}`}
      onClick={() => field !== 'name' && onSort(field as SortField)}
    >
      <div className='flex items-center gap-1'>
        {label}
        {field !== 'name' && (
          <div className='flex flex-col text-gray-600 group-hover:text-gray-400'>
            <ChevronUp
              className={`-mb-1 h-3 w-3 ${sortField === field && sortDirection === 'asc' ? 'text-purple-400' : ''}`}
            />
            <ChevronDown
              className={`h-3 w-3 ${sortField === field && sortDirection === 'desc' ? 'text-purple-400' : ''}`}
            />
          </div>
        )}
      </div>
    </th>
  );

  return (
    <div className='w-full overflow-x-auto rounded-3xl border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-xl'>
      <div className='min-w-[800px] overflow-hidden rounded-2xl'>
        <table className='w-full text-left text-sm text-gray-200'>
          <thead className='bg-white/5 text-xs uppercase text-gray-400 transition-colors'>
            <tr>
              <SortHeader field='name' label='Asset' />
              <SortHeader field='marketCap' label='Market Cap' />
              <SortHeader field='volume24h' label='Volume (24h)' />
              <SortHeader
                field='circulatingSupply'
                label='Circulating Supply'
              />
              <SortHeader field='stakingApy' label='Staking APY' />
              <SortHeader field='inflationRate' label='Inflation Rate' />
              <SortHeader field='netApy' label='Net APY' />
              <SortHeader field='stakedUsd' label='Value Staked' />
              <SortHeader field='percentLocked' label='% Staked' />
            </tr>
          </thead>
          <tbody className='divide-y divide-white/10'>
            {sortedData.map((asset) => {
              const currentPrice =
                livePrices[asset.symbol] || fallbackPrices[asset.symbol];
              const supplyUsdValue = asset.circulatingSupply * currentPrice;

              return (
                <tr
                  key={asset.id}
                  className='group transition-all duration-300 hover:bg-white/10'
                >
                  <td className='whitespace-nowrap px-6 py-5'>
                    <div className='animate-in fade-in slide-in-from-bottom-2 flex items-center gap-4 text-white duration-500'>
                      <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/10 p-1.5 shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/20'>
                        <img
                          src={asset.iconUrl}
                          alt={asset.name}
                          className='h-full w-full object-contain drop-shadow-md'
                        />
                      </div>
                      <div>
                        <div className='flex items-center gap-2 font-bold tracking-wide'>
                          {asset.name}
                        </div>
                        <div className='mt-0.5 text-xs font-semibold text-gray-400'>
                          {asset.symbol}{' '}
                          <span className='mx-1 text-gray-500'>•</span>{' '}
                          <span className='text-purple-300'>
                            {formatCurrency(currentPrice)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='whitespace-nowrap px-6 py-5 font-semibold text-white'>
                    {formatCurrency(asset.marketCap)}
                  </td>
                  <td className='whitespace-nowrap px-6 py-5 text-gray-300'>
                    {formatCurrency(asset.volume24h)}
                  </td>
                  <td className='whitespace-nowrap px-6 py-5'>
                    <div className='flex flex-col gap-0.5'>
                      <span className='font-medium text-gray-300'>
                        {formatCurrency(supplyUsdValue)}
                      </span>
                      <span className='text-xs text-gray-500'>
                        {formatNumber(asset.circulatingSupply)} {asset.symbol}
                      </span>
                    </div>
                  </td>
                  <td className='whitespace-nowrap px-6 py-5'>
                    <span className='inline-flex flex-col items-start gap-1'>
                      <span className='font-bold text-emerald-400'>
                        {asset.stakingApy.toFixed(1)}%
                      </span>
                    </span>
                  </td>
                  <td className='whitespace-nowrap px-6 py-5'>
                    <span
                      className={`inline-flex items-center justify-center rounded-lg px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${asset.inflationRate <= 0 ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20' : 'bg-rose-500/10 text-rose-400 ring-rose-500/20'}`}
                    >
                      {asset.inflationRate > 0 ? '+' : ''}
                      {asset.inflationRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className='whitespace-nowrap px-6 py-5'>
                    <span className={`inline-flex flex-col items-start gap-1`}>
                      <span
                        className={`text-lg font-bold ${
                          asset.stakingApy - asset.inflationRate > 0
                            ? 'text-emerald-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {asset.stakingApy - asset.inflationRate > 0 ? '+' : ''}
                        {(asset.stakingApy - asset.inflationRate).toFixed(1)}%
                      </span>
                    </span>
                  </td>
                  <td className='whitespace-nowrap px-6 py-5 font-semibold text-white'>
                    {formatCurrency(
                      supplyUsdValue * (asset.percentLocked / 100)
                    )}
                  </td>
                  <td className='whitespace-nowrap px-6 py-5'>
                    <div className='flex items-center gap-3'>
                      <div className='relative h-2.5 w-24 overflow-hidden rounded-full bg-black/40 shadow-inner'>
                        <div
                          className='absolute bottom-0 left-0 top-0 rounded-full bg-gradient-to-r from-purple-600 to-indigo-400 transition-all duration-1000 ease-out'
                          style={{ width: `${asset.percentLocked}%` }}
                        />
                      </div>
                      <span className='min-w-[40px] text-right text-sm font-bold text-white'>
                        {asset.percentLocked}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
