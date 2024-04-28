import { useState, useEffect } from 'react';
import { Asset, StakedAsset } from '../types';

export const useCrossReferencedAssets = (
  portfolioBalance: StakedAsset[],
  aprData: Asset[]
) => {
  const [crossReferencedAssets, setCrossReferencedAssets] = useState<
    StakedAsset[]
  >([]);

  useEffect(() => {
    const newCrossReferencedAssets = portfolioBalance.map((stakedAsset) => {
      const asset = aprData.find((a) => a.symbol === stakedAsset.symbol);
      if (asset) {
        const metricsValue = asset.metrics[0]?.defaultValue || 0;
        return { ...stakedAsset, ...asset, metrics: metricsValue };
      }
      return stakedAsset;
    });

    setCrossReferencedAssets(newCrossReferencedAssets);
  }, [portfolioBalance, aprData]);

  return crossReferencedAssets;
};
