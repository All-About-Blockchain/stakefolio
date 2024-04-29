import React from 'react';
import { PortfolioAssets } from '../types';

const Summary = ({ data }: { data: PortfolioAssets }) => {
  const totalValue = data.assets.reduce((acc, asset) => {
    return acc + asset.balance * (asset.price ?? 0);
  }, 0);
  return (
    <div>
      Summary
      <span>{totalValue}</span>
    </div>
  );
};

export default Summary;
