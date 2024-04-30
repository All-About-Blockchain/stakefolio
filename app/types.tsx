export type StakedAsset = {
  symbol: string;
  balance: number;
  color: string;
  chain: string;
  apr?: number;
  name?: string;
  id?: string;
  slug?: string;
  description?: string;
  logoUrl?: string;
  metrics?: number;
  price?: number;
};

type Metric = {
  defaultValue: number;
};

export type Asset = {
  name: string;
  symbol: string;
  id: string;
  slug: string;
  description: string;
  logoUrl: string;
  metrics: Metric[];
};

export type PortfolioAssets = {
  symbol: string;
  balance: number;
  color: string;
  chain: string;
  apr?: number;
  name?: string;
  id?: string;
  slug?: string;
  description?: string;
  logoUrl?: string;
  metrics?: number;
  price?: number;
};
