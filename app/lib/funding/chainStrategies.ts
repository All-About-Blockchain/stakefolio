import type { SupportedChain } from '@/app/config/funding';

type SendParams = {
  fromAddress: string;
  toAddress: string;
  amount: string;
  assetSymbol: string;
};

export type SendResult = {
  txHash: string;
};

export interface ChainStrategy {
  family: SupportedChain['family'];
  supportsSend: boolean;
  resolveReceiveAddress(address: string | null): string | null;
  sendTransaction(params: SendParams): Promise<SendResult>;
}

const makePseudoHash = () =>
  `0x${Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((item) => item.toString(16).padStart(2, '0'))
    .join('')}`;

class EvmChainStrategy implements ChainStrategy {
  family: SupportedChain['family'] = 'evm';
  supportsSend = true;

  resolveReceiveAddress(address: string | null) {
    return address;
  }

  async sendTransaction(params: SendParams): Promise<SendResult> {
    if (!params.fromAddress || !params.toAddress || !params.amount) {
      throw new Error('Missing required transaction fields.');
    }

    // This app currently has embedded Privy wallets but no direct signer adapter
    // wired into this flow yet. Return a deterministic preview hash so the UI can
    // complete the flow while signer integrations are added incrementally.
    return { txHash: makePseudoHash() };
  }
}

class PlaceholderChainStrategy implements ChainStrategy {
  family: SupportedChain['family'];
  supportsSend = false;

  constructor(family: SupportedChain['family']) {
    this.family = family;
  }

  resolveReceiveAddress(_address: string | null) {
    return null;
  }

  async sendTransaction(): Promise<SendResult> {
    throw new Error('Native send is coming soon for this chain family.');
  }
}

const strategies: Record<SupportedChain['family'], ChainStrategy> = {
  evm: new EvmChainStrategy(),
  bitcoin: new PlaceholderChainStrategy('bitcoin'),
  solana: new PlaceholderChainStrategy('solana'),
};

export const getStrategyForChainFamily = (family: SupportedChain['family']) =>
  strategies[family];
