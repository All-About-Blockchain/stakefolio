import { TelemetryContext, RegulatoryConfig, StakingTransaction, ComplianceAuditTrail } from './types';
import { compilePromptContext, compileSystemInstructions } from './promptBuilder';
import { MockLlmEngine } from './mockLlmEngine';
import { TransactionSafetyGateway } from './safetyGateway';
import { TransactionCompiler } from './transactionCompiler';

export interface AgentExecutionResult {
  success: boolean;
  auditTrail: ComplianceAuditTrail;
  compiledPrompt?: {
    system: string;
    user: string;
  };
  rawModelOutput?: string;
  transaction?: StakingTransaction;
}

/**
 * AutonomousAgentOrchestrator simulates the background daemon loop running on the user's
 * mobile hardware sandbox. It acts as the final orchestrator tying together data pipelines,
 * LLMs, security gateways, and transaction compilers.
 */
export class AutonomousAgentOrchestrator {
  private safetyGateway: TransactionSafetyGateway;

  constructor(regulatoryConfig: RegulatoryConfig) {
    this.safetyGateway = new TransactionSafetyGateway(regulatoryConfig);
  }

  /**
   * Runs one full iteration of the autonomous execution cycle.
   */
  public async executeStakingAgentCycle(
    context: TelemetryContext,
    simulationOverride?: 'hallucinate_illegal_transfer' | 'hallucinate_pooling_target'
  ): Promise<AgentExecutionResult> {
    // 1. Ingest telemetry and compile prompt context and system instructions (Prompt Engineering)
    const userPrompt = compilePromptContext(context);
    const systemInstructions = compileSystemInstructions();

    // 2. Execute local, GBNF-constrained model inference (Mock LLM Engine simulating on-device chip)
    const rawModelOutput = await MockLlmEngine.executeLocalInference(
      context,
      simulationOverride
    );

    // 3. Parse JSON schema output
    let parsedRecommendation;
    try {
      parsedRecommendation = JSON.parse(rawModelOutput);
    } catch (e) {
      // In a real device, if the LLM output violates JSON formatting (which is prevented by GBNF grammar),
      // we abort immediately.
      return {
        success: false,
        auditTrail: {
          isApproved: false,
          blockedRules: ['RULE_CORE_PARSING_ERROR'],
          reasons: ['Model output could not be parsed as valid JSON schema.'],
          jurisdictionsViolated: ['System Sandbox Integrity']
        },
        rawModelOutput
      };
    }

    // 4. Run through the Kotlin/Swift middleware compliance safety gateways (US, Canada, EU)
    const auditTrail = this.safetyGateway.evaluateStakingAction(
      parsedRecommendation,
      context
    );

    // 5. Block transaction compilation if any legislative rules are violated
    if (!auditTrail.isApproved) {
      return {
        success: false,
        auditTrail,
        compiledPrompt: { system: systemInstructions, user: userPrompt },
        rawModelOutput
      };
    }

    // 6. Compile deterministic transaction bytecode / execution envelope
    const transaction = TransactionCompiler.compileApprovedTransaction(parsedRecommendation);

    return {
      success: true,
      auditTrail,
      compiledPrompt: { system: systemInstructions, user: userPrompt },
      rawModelOutput,
      transaction
    };
  }
}
