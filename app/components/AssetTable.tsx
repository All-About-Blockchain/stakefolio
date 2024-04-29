import React from 'react';
import { PortfolioAssets } from '../types';

const AssetTable: React.FC<PortfolioAssets> = ({ assets }) => (
  <table className='grid grid-cols-1 w-full'>
    <thead>
      <tr className='grid grid-cols-6 text-left'>
        <th>Symbol</th>
        <th>Balance</th>
        <th>Name</th>
        <th>APR</th>
        <th>Price</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody className='grid grid-cols-1 w-full'>
      {assets.map((asset) => (
        <tr key={asset.id} className='grid grid-cols-6 w-full'>
          <td>{asset.symbol}</td>
          <td>{asset.balance}</td>
          <td>{asset.name}</td>
          <td>{(asset.metrics!).toFixed(2)}%</td>
          <td>${(asset.price!).toFixed(2)}</td>
          <td>${(asset.balance * asset.price!).toFixed(2)}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default AssetTable;
