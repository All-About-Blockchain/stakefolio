import React from 'react';
import { PortfolioAssets } from '../types';

const AssetTable: React.FC<{ assets: PortfolioAssets[] }> = ({ assets }) => (
  <table className='grid w-full grid-cols-1'>
    <thead>
      <tr className='grid grid-cols-6 text-left'>
        <th>Chain</th>
        <th>Symbol</th>
        <th>Balance</th>
        <th>APR</th>
        <th>Price</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody className='grid w-full grid-cols-1'>
      {assets.map((asset, index) => (
        <tr key={index} className='grid w-full grid-cols-6'>
          <td>{asset.chain}</td>
          <td>{asset.symbol.toUpperCase()}</td>
          <td>{asset.balance}</td>
          <td>{asset.apr!.toFixed(2)}%</td>
          <td>${asset.price!.toFixed(2)}</td>
          <td>${(asset.balance * asset.price!).toFixed(2)}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default AssetTable;
