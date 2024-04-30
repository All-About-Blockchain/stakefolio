import { useState, useEffect } from 'react';
import { Asset, StakedAsset } from '../types';

export const useCrossReferencedAssets = (
  portfolioBalance: StakedAsset[],
  coinMarketCapData: any[]
) => {
  const [crossReferencedAssets, setCrossReferencedAssets] = useState<
    StakedAsset[]
  >([]);

  useEffect(() => {
    const newCrossReferencedAssets = portfolioBalance.map((stakedAsset) => {
      const coinMarketCapAsset = coinMarketCapData.find(
        (a) => a.symbol === stakedAsset.symbol
      );

      let price = 0;

      if (coinMarketCapAsset?.quote?.USD) {
        price = coinMarketCapAsset.quote.USD.price || 0;
      }

      return { ...stakedAsset, price };
    });

    setCrossReferencedAssets(newCrossReferencedAssets);
  }, [portfolioBalance, coinMarketCapData]);

  return crossReferencedAssets;
};
