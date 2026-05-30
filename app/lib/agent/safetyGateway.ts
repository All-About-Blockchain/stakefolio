import { StakingRecommendation, TelemetryContext, RegulatoryConfig, ComplianceAuditTrail } from './types';

/**
 * TransactionSafetyGateway acts as a strict, non-bypassable, deterministic barrier
 * inside the native mobile client's middleware (compiled in Kotlin/Swift).
 * 
 * It evaluates LLM-generated recommendations against absolute legal, risk, and structural limits
 * BEFORE transaction bytecode can be generated or signed.
 */
export class TransactionSafetyGateway {
  private config: RegulatoryConfig;

  constructor(config: RegulatoryConfig) {
    this.config = config;
  }

  /**
   * Evaluates the LLM recommended action against tri-jurisdictional legislative rules.
   */
  public evaluateStakingAction(
    recommendation: StakingRecommendation,
    context: TelemetryContext
  ): ComplianceAuditTrail {
    const auditTrail: ComplianceAuditTrail = {
      isApproved: true,
      blockedRules: [],
      reasons: [],
      jurisdictionsViolated: []
    };

    // --- RULE 1: US LEGISLATION GUARDRAIL (Money Transmitter / Securities Discretion Exclusion) ---
    // Under FinCEN 2019 guidelines and the Investment Advisers Act of 1940, the software remains an exempt utility
    // only if the AI model is structurally blocked from exercising arbitrary asset transfer authority.
    const allowedActions = new Set(['redelegate', 'harvest_compound', 'hold']);
    if (!allowedActions.has(recommendation.action)) {
      auditTrail.isApproved = false;
      auditTrail.blockedRules.push('RULE_US_DISCRETIONARY_TRANSFER_BLOCK');
      auditTrail.reasons.push(
        `Action type '${recommendation.action}' represents an arbitrary asset transfer. Only staking operations are permitted.`
      );
      auditTrail.jurisdictionsViolated.push('United States (FinCEN / SEC)');
    }

    // --- RULE 2: CANADIAN LEGISLATION GUARDRAIL (CSA Staff Notice 21-332 Staking Exemption) ---
    // Canadian securities rules require that automated staking does not form a discretionary "pooling scheme"
    // or rely on custodial, yield-guarantee structures. Staking targets must be public non-custodial validators.
    if (recommendation.action === 'redelegate' && recommendation.target_validator) {
      // Check if target validator is in the public non-custodial whitelist
      if (!this.config.validatorWhitelist.has(recommendation.target_validator)) {
        auditTrail.isApproved = false;
        auditTrail.blockedRules.push('RULE_CAN_CSA_NON_CUSTODIAL_WHITELIST');
        auditTrail.reasons.push(
          `Target validator address '${recommendation.target_validator}' is not registered in the local non-custodial whitelist.`
        );
        auditTrail.jurisdictionsViolated.push('Canada (CSA Securities Rules)');
      }

      // Explicitly check telemetry flags to confirm the target validator is not flagged as a pool/custodial structure
      const targetTelemetry = context.candidateValidators.find(
        (v) => v.address === recommendation.target_validator
      );
      if (targetTelemetry && targetTelemetry.isCustodialOrPool) {
        auditTrail.isApproved = false;
        auditTrail.blockedRules.push('RULE_CAN_CSA_ANTI_POOLING_CHECK');
        auditTrail.reasons.push(
          `Staking targeted a custodial pool/contract. Auto-pooling represents a regulated investment fund behavior.`
        );
        auditTrail.jurisdictionsViolated.push('Canada (CSA Staking Rules)');
      }
    }

    // --- RULE 3: EUROPEAN UNION LEGISLATION & ORACLE SLIPPAGE GUARDRAILS (MiCA & Consumer Protection) ---
    // MiCA mandates CASP protections. In local-first models, the software protects user capital from oracle depeg,
    // pool slippage, and high-slippage liquidity attacks.
    if (context.slippagePct > this.config.maxSlippageLimit) {
      auditTrail.isApproved = false;
      auditTrail.blockedRules.push('RULE_EU_MICA_SLIPPAGE_LIMIT');
      auditTrail.reasons.push(
        `Current path slippage is ${context.slippagePct}%, which exceeds the absolute safety limit of ${this.config.maxSlippageLimit}%.`
      );
      auditTrail.jurisdictionsViolated.push('European Union (MiCA / Risk Management)');
    }

    return auditTrail;
  }
}
