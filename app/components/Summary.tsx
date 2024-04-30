import React, { useEffect, useState } from 'react';
import { PortfolioAssets } from '../types';
import Decimal from 'decimal.js';

const Summary = ({ data }: { data: PortfolioAssets[] }) => {
  const [netApy, setNetApy] = useState(0);
  const [dailyReturn, setDailyReturn] = useState(0);
  const [yearlyReturn, setYearlyReturn] = useState(0);

  const summaryData = data.map((asset) => ({
    ...asset,
    value: Number(asset.balance * Number(asset.price!)),
  }));

  const totalValue = summaryData.reduce((acc, asset) => {
    return acc + asset.value;
  }, 0);

  useEffect(() => {
    const totalApr = summaryData.reduce((acc, asset) => {
      const apr = asset.apr;
      if (apr === undefined) return acc;
      return acc.add(new Decimal(apr).mul(asset.value));
    }, new Decimal(0));

    const netAprValue = totalApr.div(totalValue).toNumber();
    const netApyValue = isNaN(netAprValue)
      ? 0
      : Math.exp(netAprValue / 100) - 1;
    setNetApy(netApyValue);

    const dailyReturnValue =
      totalValue * Math.exp(netApyValue / 365) - totalValue;
    setDailyReturn(dailyReturnValue);

    const yearlyReturnValue = totalValue * Math.exp(netApyValue) - totalValue;
    setYearlyReturn(yearlyReturnValue);
  }, [summaryData, totalValue]);

  return (
    <div className='flex flex-col gap-8'>
      <span className='text-lg font-bold'>Summary</span>
      <div className='grid grid-cols-2 gap-8'>
        <div className='flex w-full flex-col'>
          <span className='text-xl'>Total Value</span>
          <span className='text-5xl font-bold'>
            $
            {totalValue.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div className='flex w-full flex-col'>
          <span className='text-xl'>Net APY</span>
          <span className='text-4xl font-bold'>
            {(netApy * 100).toFixed(2)}%
          </span>
        </div>
        <div className='flex w-full flex-col'>
          <span className='text-xl'>Daily Return</span>
          <span className='text-4xl font-bold'>
            $
            {dailyReturn.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div className='flex w-full flex-col'>
          <span className='text-xl'>Yearly Return</span>
          <span className='text-5xl font-bold'>
            $
            {yearlyReturn.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Summary;
