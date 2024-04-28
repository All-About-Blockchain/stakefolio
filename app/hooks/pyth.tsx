import { useState, useEffect } from 'react';
import { Connection } from '@solana/web3.js';
import {
  PriceStatus,
  PythHttpClient,
  getPythClusterApiUrl,
  getPythProgramKeyForCluster,
  PythCluster,
  PriceData,
} from '@pythnetwork/client';
import { PythHttpClientResult } from '@pythnetwork/client/lib/PythHttpClient';
import { portfolioBalance } from '@/pages';

const PYTHNET_CLUSTER_NAME: PythCluster = 'pythnet';
const connection = new Connection(getPythClusterApiUrl(PYTHNET_CLUSTER_NAME));
const pythPublicKey = getPythProgramKeyForCluster(PYTHNET_CLUSTER_NAME);

export function usePythData() {
  const [pythData, setPythData] = useState<PythHttpClientResult | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const pythClient = new PythHttpClient(connection, pythPublicKey);
      const data = await pythClient.getData();
      console.log('Pyth getData:', data);
      setPythData(data);
    };

    fetchData();
  }, []);

  return pythData;
}

export function usePythLookup() {
  const pythData: PythHttpClientResult | null = usePythData();

  console.log('pythDatalookup', pythData);
  const myPortfolio = {
    assets: portfolioBalance, // replace with your actual portfolio
  };

  const [myPortfolioPrices, setMyPortfolioPrices] = useState<PriceData[]>([]); // Specify the type as PriceData[]

  useEffect(() => {
    if (pythData) {
      const prices = pythData.prices.filter((price: PriceData, index: number) =>
        myPortfolio.assets.includes(price.symbols)
      );
      setMyPortfolioPrices(prices);
    }
  }, [myPortfolio.assets, pythData]);

  console.log('myPortfolioPrices', myPortfolioPrices);

  return myPortfolioPrices;
}
