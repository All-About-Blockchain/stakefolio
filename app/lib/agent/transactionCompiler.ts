import { StakingRecommendation, StakingTransaction } from './types';

/**
 * TransactionCompiler translates verified JSON model outputs into mock multi-chain 
 * transaction payloads, simulating on-device native client transaction compiling.
 */
export class TransactionCompiler {
  /**
   * Compiles the approved recommendations into mock/real multi-chain transaction envelopes.
   */
  public static compileApprovedTransaction(
    recommendation: StakingRecommendation
  ): StakingTransaction {
    switch (recommendation.chain) {
      case 'solana':
        return this.compileSolanaStakingTx(recommendation);
      case 'ethereum':
        return this.compileEthereumStakingTx(recommendation);
      case 'cosmos':
      default:
        return this.compileCosmosStakingTx(recommendation);
    }
  }

  private static compileCosmosStakingTx(
    recommendation: StakingRecommendation
  ): StakingTransaction {
    if (recommendation.action === 'redelegate' && recommendation.target_validator) {
      // Simulate compiling `/cosmos.staking.v1beta1.MsgBeginRedelegate`
      return {
        chain: 'cosmos',
        unsignedBytesHex: '0a630a2f636f736d6f732e7374616b696e672e763162657461312e4d7367426567696e526564656c6567617465...',
        description: `Redelegate 100% of staked ATOM from ${recommendation.source_validator} to ${recommendation.target_validator} via Authz authorization.`,
        signatory: 'ephemeral_hot_wallet', // The hot wallet has native MsgBeginRedelegate rights, keeping master key cold!
        methods: ['MsgBeginRedelegate']
      };
    }

    return {
      chain: 'cosmos',
      unsignedBytesHex: '0a470a1f636f736d6f732e7374616b696e672e763162657461312e4d7367576974686472617744656c656761746f72...',
      description: `Harvest Cosmos ATOM staking rewards and compound back to ${recommendation.source_validator}.`,
      signatory: 'ephemeral_hot_wallet',
      methods: ['MsgWithdrawDelegatorReward', 'MsgDelegate']
    };
  }

  private static compileSolanaStakingTx(
    recommendation: StakingRecommendation
  ): StakingTransaction {
    if (recommendation.action === 'redelegate' && recommendation.target_validator) {
      // Solana uses split authority. The Hot Wallet PDA holds Staking Authority, so it compiles
      // native instructions to deactivate/delegate stake accounts.
      return {
        chain: 'solana',
        unsignedBytesHex: '020103020000000000000000000000000000000000000000000000000000000000000000...',
        description: `Deactivate stake and re-delegate Solana Stake Account to validator: ${recommendation.target_validator} using Staking Authority PDA.`,
        signatory: 'ephemeral_hot_wallet', // PDA Staking Authority signs programmatically. Master withdraw key remains cold.
        methods: ['DeactivateStake', 'DelegateStake']
      };
    }

    return {
      chain: 'solana',
      unsignedBytesHex: '01000000000000000000000000...',
      description: 'Harvest JitoSOL liquid staking rewards locally.',
      signatory: 'ephemeral_hot_wallet',
      methods: ['ClaimStakingRewards']
    };
  }

  private static compileEthereumStakingTx(
    recommendation: StakingRecommendation
  ): StakingTransaction {
    // Ethereum ERC-4337 Session Key compilation. The Hot Wallet key is pre-authorized
    // to call deposit/submit methods on whitelisted contracts.
    if (recommendation.action === 'redelegate' && recommendation.target_validator) {
      return {
        chain: 'ethereum',
        unsignedBytesHex: '0x150b90f5000000000000000000000000ae7ab96520de3a18e5e111b5eaab095312d7fe84...',
        description: `Execute modular ERC-7579 session key call to Lido Staking contract: delegate to ${recommendation.target_validator}.`,
        signatory: 'ephemeral_hot_wallet',
        methods: ['ERC7579_ExecuteCall_LidoSubmit']
      };
    }

    return {
      chain: 'ethereum',
      unsignedBytesHex: '0x3a48e76c...',
      description: 'Auto-compound Ethereum ETH yield into ezETH LRT pool.',
      signatory: 'ephemeral_hot_wallet',
      methods: ['ERC7579_ExecuteCall_RestakingDeposit']
    };
  }
}
