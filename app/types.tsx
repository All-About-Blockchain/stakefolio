export type StakedAsset = {
  symbol: string;
  balance: number;
  color: string;
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
  find(arg0: (a: any) => boolean): unknown;
  name: string;
  symbol: string;
  id: string;
  slug: string;
  description: string;
  logoUrl: string;
  metrics: Metric[];
};

export type PortfolioAsset = {
  assets: Array<{
    symbol: string;
    balance: number;
    color: string;
    name: string;
    id: string;
    slug: string;
    description: string;
    logoUrl: string;
    metrics: number;
    price?: number;
  }>;
};
