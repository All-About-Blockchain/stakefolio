import { AutonomousAgentOrchestrator } from '../app/lib/agent/orchestrator';
import { TEST_SCENARIOS, TEST_REGULATORY_CONFIG } from './scenarios';

/**
 * Clean ANSI Color loggers for a premium CLI terminal experience
 */
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m'
};

async function executeTestSuite() {
  console.log(`${colors.bright}${colors.cyan}========================================================================${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}    STAKEFOLIO: ON-DEVICE AI STAKING AGENT PROTOTYPE TEST HARNESS      ${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}========================================================================${colors.reset}`);
  console.log(`Regulatory Jurisdictions Audited:`);
  console.log(` - ${colors.yellow}United States${colors.reset} (FinCEN Money Transmitter / SEC Advisers Act 1940)`);
  console.log(` - ${colors.yellow}Canada${colors.reset} (CSA Notice 21-332 Staking Exemption / PIPEDA / AIDA)`);
  console.log(` - ${colors.yellow}European Union${colors.reset} (MiCA Recital 22 non-custodial software exclusions)`);
  console.log(`\nMulti-Chain Production Integrations Evaluated:`);
  console.log(` - ${colors.green}Cosmos SDK${colors.reset} (Protobuf MsgBeginRedelegate / MsgDelegate payload serializations)`);
  console.log(` - ${colors.green}Solana Network${colors.reset} (Staking Program instructions & PDA staking authorization)`);
  console.log(` - ${colors.green}EVM Ecosystem${colors.reset} (Lido Contract submit ABI calldata encoding & ERC-7579 execution)`);
  console.log(`${colors.cyan}------------------------------------------------------------------------${colors.reset}\n`);

  const orchestrator = new AutonomousAgentOrchestrator(TEST_REGULATORY_CONFIG);
  let totalTests = 0;
  let passedTests = 0;

  for (const scenario of TEST_SCENARIOS) {
    totalTests++;
    console.log(`${colors.bright}[TEST ${totalTests}] Running: ${scenario.name}${colors.reset}`);
    console.log(`Scenario Context: ${scenario.description}`);

    try {
      const result = await orchestrator.executeStakingAgentCycle(
        scenario.context,
        scenario.delegatorAddress,
        scenario.simulationOverride
      );

      // Verify and assert outcomes
      let isTestSuccess = false;
      const reasons: string[] = [];

      if (scenario.expectedResult === 'success') {
        if (result.success) {
          const expectedAct = scenario.expectedAction;
          const parsedOutput = JSON.parse(result.rawModelOutput || '{}');

          if (expectedAct && parsedOutput.action !== expectedAct) {
            isTestSuccess = false;
            reasons.push(`Model action was '${parsedOutput.action}', expected '${expectedAct}'.`);
          } else {
            isTestSuccess = true;
          }
        } else {
          isTestSuccess = false;
          reasons.push(`Orchestrator failed execution. Blame: ${result.auditTrail.reasons.join(', ')}`);
        }
      } else if (scenario.expectedResult === 'blocked') {
        if (!result.success) {
          const ruleKeyword = scenario.expectedReasonKeyword;
          const violatedRules = result.auditTrail.blockedRules;

          if (ruleKeyword && !violatedRules.includes(ruleKeyword)) {
            isTestSuccess = false;
            reasons.push(
              `Safety gateway blocked correctly, but rule '${ruleKeyword}' was not matched. Got: ${violatedRules.join(', ')}`
            );
          } else {
            isTestSuccess = true;
          }
        } else {
          isTestSuccess = false;
          reasons.push(`Security breach! Staked action succeeded when it should have been blocked.`);
        }
      }

      // Output scenario execution metrics
      if (isTestSuccess) {
        passedTests++;
        console.log(`${colors.green}● ASSERTION PASSED:${colors.reset} Scenario handled correctly.`);
        if (result.success && result.transaction) {
          console.log(`   - Output Recommendation: ${colors.green}${result.rawModelOutput}${colors.reset}`);
          console.log(`   - Compiled Tx Action:   ${colors.bright}${colors.blue}${result.transaction.description}${colors.reset}`);
          console.log(`   - Compiled Payload Hex: ${colors.cyan}${result.transaction.unsignedBytesHex.substring(0, 80)}...${colors.reset}`);
          console.log(`   - Execution Signatory:  ${colors.bright}${colors.yellow}${result.transaction.signatory}${colors.reset}`);
          console.log(`   - Executed Methods:     [${result.transaction.methods.join(', ')}]`);
        } else {
          console.log(`   - Safety Gateway Intercept: ${colors.red}BLOCKED AS EXPECTED${colors.reset}`);
          console.log(`   - Violated Rules: ${colors.yellow}${result.auditTrail.blockedRules.join(', ')}${colors.reset}`);
          console.log(`   - Jurisdictions Enforced: ${colors.cyan}${result.auditTrail.jurisdictionsViolated.join(', ')}${colors.reset}`);
          console.log(`   - Local Audit Reasons: ${colors.bright}${result.auditTrail.reasons.join(' | ')}${colors.reset}`);
        }
      } else {
        console.log(`${colors.red}■ ASSERTION FAILED: ${reasons.join(' | ')}${colors.reset}`);
        if (result.rawModelOutput) {
          console.log(`   - Debug Raw Model Output: ${result.rawModelOutput}`);
        }
      }
    } catch (err: any) {
      console.log(`${colors.red}■ ASSERTION CRITICAL ERROR: ${err.message || err}${colors.reset}`);
    }

    console.log(`${colors.cyan}------------------------------------------------------------------------${colors.reset}\n`);
  }

  // Final Summary Output
  console.log(`${colors.bright}${colors.cyan}========================================================================${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}                         TEST HARNESS COMPLETE                          ${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}========================================================================${colors.reset}`);
  
  const pct = Math.round((passedTests / totalTests) * 100);
  const statusColor = pct === 100 ? colors.green : colors.red;
  
  console.log(`Execution Stats:`);
  console.log(` - Total Scenarios Run: ${totalTests}`);
  console.log(` - Passed Assertions:   ${statusColor}${passedTests}${colors.reset} / ${totalTests}`);
  console.log(` - Pass Percentage:     ${statusColor}${pct}%${colors.reset}`);
  
  if (pct === 100) {
    console.log(`\n${colors.bright}${colors.bgGreen}  SUCCESS: All on-device multi-chain production integrations verified!  ${colors.reset}`);
  } else {
    console.log(`\n${colors.bright}${colors.bgRed}  FAILURE: Staking agent safety guardrail or serialization failure detected. Check logs!  ${colors.reset}`);
    process.exit(1);
  }
}

executeTestSuite().catch((e) => {
  console.error('Fatal execution error inside test suite:', e);
  process.exit(1);
});
