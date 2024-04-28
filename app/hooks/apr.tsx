import { useState, useEffect } from 'react';
import { Asset, StakedAsset } from '../types';

export const useCrossReferencedAssets = (
  portfolioBalance: StakedAsset[],
  aprData: Asset[],
  coinMarketCapData: any[]
) => {
  const [crossReferencedAssets, setCrossReferencedAssets] = useState<
    StakedAsset[]
  >([]);

  useEffect(() => {
    const newCrossReferencedAssets = portfolioBalance.map((stakedAsset) => {
      const asset = aprData.find((a) => a.symbol === stakedAsset.symbol);
      const coinMarketCapAsset = coinMarketCapData.find(
        (a) => a.symbol === stakedAsset.symbol
      );

      let metricsValue = 0;
      let price = 0;

      if (asset) {
        metricsValue = asset.metrics[0]?.defaultValue || 0;
      }

      if (coinMarketCapAsset?.quote?.USD) {
        price = coinMarketCapAsset.quote.USD.price || 0;
      }

      return { ...stakedAsset, ...asset, metrics: metricsValue, price };
    });

    setCrossReferencedAssets(newCrossReferencedAssets);
  }, [portfolioBalance, aprData, coinMarketCapData]);

  return crossReferencedAssets;
};
