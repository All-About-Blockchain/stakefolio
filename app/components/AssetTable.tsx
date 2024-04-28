import React from 'react';
import { PortfolioAsset } from '../types';

const AssetTable: React.FC<PortfolioAsset> = ({ assets }) => (
  <table>
    <thead>
      <tr>
        <th>Symbol</th>
        <th>Balance</th>
        <th>Name</th>
      </tr>
    </thead>
    <tbody className='flex w-full'>
      {assets.map((asset) => (
        <tr key={asset.id} className='flex w-full justify-between'>
          <td>{asset.symbol}</td>
          <td>{asset.balance}</td>
          <td>{asset.name}</td>
          <td>{asset.metrics}</td>
          <td>{asset.price}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default AssetTable;
