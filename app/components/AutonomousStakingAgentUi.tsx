'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  AlertTriangle, 
  Play, 
  CheckCircle2, 
  Activity, 
  Cpu, 
  Sliders, 
  Lock, 
  RefreshCw, 
  FileCode,
  Check,
  Award,
  Vote,
  ExternalLink,
  ChevronRight,
  Fingerprint,
  Key,
  Coins,
  Search,
  Copy,
  LockKeyhole,
  Sparkles,
  Server,
  TrendingUp,
  Eye
} from 'lucide-react';
import { AutonomousAgentOrchestrator } from '@/app/lib/agent/orchestrator';
import { TEST_SCENARIOS, TEST_REGULATORY_CONFIG } from '@/__tests__/scenarios';
import { RegulatoryConfig, StakingTransaction } from '@/app/lib/agent/types';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  name: string;
  chain: string;
  status: 'Approved' | 'Blocked';
  details: string;
  actionType: 'Yield Optimization' | 'Airdrop Shield' | 'Governance Proxy' | 'Compliance Sweep';
}

type TabType = 'yield' | 'airdrop' | 'compliance';

export default function AutonomousStakingAgentUi() {
  const [activeTab, setActiveTab] = useState<TabType>('yield');
  
  // Dynamic UI States representing Target Audience Objectives
  // 1. Retail ("Set & Forget")
  const [slippageLimit, setSlippageLimit] = useState(0.5);
  const [commissionCeiling, setCommissionCeiling] = useState(8.0);
  const [rebalanceFreq, setRebalanceFreq] = useState<'hourly' | 'daily' | 'weekly'>('daily');
  const [autoCompound, setAutoCompound] = useState(true);
  const [uptimeVetting, setUptimeVetting] = useState(true);
  
  // 2. Airdrop Hunters
  const [delegationSplit, setDelegationSplit] = useState(3);
  const [avoidTop10, setAvoidTop10] = useState(true);
  const [avoidExchanges, setAvoidExchanges] = useState(true);
  const [govProxyMode, setGovProxyMode] = useState<'active' | 'passive' | 'custom'>('active');
  const [airdropSearch, setAirdropSearch] = useState('');

  // 3. HNWI / Institutions
  const [secureEnclaveActive, setSecureEnclaveActive] = useState(true);
  const [maxDailyGas, setMaxDailyGas] = useState(0.05);
  const [maxDailyDelegation, setMaxDailyDelegation] = useState(1500);

  // Common Execution States
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [runProgress, setRunProgress] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Result state
  const [runResult, setRunResult] = useState<{
    success: boolean;
    rawOutput?: string;
    auditRules?: string[];
    jurisdictions?: string[];
    reasons?: string[];
    transaction?: StakingTransaction;
  } | null>(null);

  // Search/Filters for Audit Logs
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [auditStatusFilter, setAuditStatusFilter] = useState<'all' | 'Approved' | 'Blocked'>('all');

  // Historic audit trail logs in UI
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'log-1',
      timestamp: '16:15:02',
      name: 'Governance Voting Auto-Proxy',
      chain: 'Cosmos',
      status: 'Approved',
      actionType: 'Governance Proxy',
      details: 'Voted YES on Proposal #842 (Inflation Reduction) on behalf of user policy.'
    },
    {
      id: 'log-2',
      timestamp: '15:24:02',
      name: 'Stable Network Health Check',
      chain: 'Solana',
      status: 'Approved',
      actionType: 'Yield Optimization',
      details: 'Active validator performing optimally (99.98% uptime). Staking recommendation: hold.'
    },
    {
      id: 'log-3',
      timestamp: '11:15:30',
      name: 'Solana Delegation Ingest',
      chain: 'Solana',
      status: 'Approved',
      actionType: 'Compliance Sweep',
      details: 'Constructed PDA staking delegation authority. Target validator whitelisted. Signatory: hot-key.'
    },
    {
      id: 'log-4',
      timestamp: '09:04:15',
      name: 'Airdrop Anti-Centralization Scan',
      chain: 'Cosmos',
      status: 'Approved',
      actionType: 'Airdrop Shield',
      details: 'Scanned Cosmos validator distribution. Active delegation satisfies Top-10 avoidance rule.'
    }
  ]);

  const currentScenario = TEST_SCENARIOS[selectedScenarioIndex];

  // Dynamic Airdrop Eligibility Score based on user choices
  const airdropScore = useMemo(() => {
    let score = 65;
    if (avoidTop10) score += 10;
    if (avoidExchanges) score += 10;
    if (delegationSplit >= 3) score += 9;
    if (delegationSplit >= 4) score += 3;
    if (govProxyMode !== 'custom') score += 5; // Active voting history is highly favored
    return score;
  }, [avoidTop10, avoidExchanges, delegationSplit, govProxyMode]);

  // Handle Dynamic Clipboard Copying with micro-animations
  const triggerCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRunAgent = useCallback(async () => {
    setIsRunning(true);
    setRunResult(null);

    // Dynamic, premium loading stages to mimic secure sandbox computation steps
    const executionStages = [
      'Setting up secure environment on your device...',
      'Checking network conditions and validator status...',
      'Running regulatory compliance checks...',
      'Analyzing with on-device AI...',
      'Validating against your safety rules...',
      'Preparing transaction for review...'
    ];

    for (const stage of executionStages) {
      setRunProgress(stage);
      await new Promise((resolve) => setTimeout(resolve, 400));
    }

    try {
      // 1. Compile custom regulatory whitelist & rules from the UI sliders and filters
      const customConfig: RegulatoryConfig = {
        ...TEST_REGULATORY_CONFIG,
        maxSlippageLimit: slippageLimit,
        maxDailyGasAllowanceEth: maxDailyGas
      };

      // 2. Instantiate orchestrator running in on-device local sandbox
      const orchestrator = new AutonomousAgentOrchestrator(customConfig);

      // 3. Execute cycle
      const result = await orchestrator.executeStakingAgentCycle(
        {
          ...currentScenario.context,
          slippagePct: currentScenario.context.slippagePct,
          activeValidator: {
            ...currentScenario.context.activeValidator,
            commissionPct: currentScenario.context.activeValidator.commissionPct
          }
        },
        currentScenario.delegatorAddress,
        currentScenario.simulationOverride
      );

      // Extra check: simulate custom commission rule constraint in safety gateway
      let success = result.success;
      let blockedRules = [...(result.auditTrail.blockedRules || [])];
      let reasons = [...(result.auditTrail.reasons || [])];
      let jurisdictionsViolated = [...(result.auditTrail.jurisdictionsViolated || [])];

      const scenarioActiveComm = currentScenario.context.activeValidator.commissionPct;
      if (success && scenarioActiveComm > commissionCeiling) {
        success = false;
        blockedRules.push('RULE_RETAIL_COMMISSION_CEILING');
        reasons.push(`Validator commission (${scenarioActiveComm}%) exceeds user commission tolerance ceiling (${commissionCeiling}%).`);
        jurisdictionsViolated.push('User Custom Risk Profile');
      }

      // 4. Update UI result deck
      setRunResult({
        success,
        rawOutput: result.rawModelOutput,
        auditRules: blockedRules,
        jurisdictions: jurisdictionsViolated,
        reasons: reasons,
        transaction: success ? result.transaction : undefined
      });

      // 5. Append to Local Chronological Audit Ledger
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      
      const newEntry: AuditLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: timeStr,
        name: currentScenario.name,
        chain: currentScenario.context.chain.charAt(0).toUpperCase() + currentScenario.context.chain.slice(1),
        status: success ? 'Approved' : 'Blocked',
        actionType: activeTab === 'yield' ? 'Yield Optimization' : activeTab === 'airdrop' ? 'Airdrop Shield' : 'Compliance Sweep',
        details: success 
          ? `Sovereign compiler successfully compiled ${currentScenario.context.chain.toUpperCase()} payload: ${result.transaction?.description}`
          : `Safety gateway blocked local execution. Reason: ${reasons.join(' | ')}`
      };

      setAuditLogs((prev) => [newEntry, ...prev]);

    } catch (e: any) {
      console.error(e);
    } finally {
      setIsRunning(false);
      setRunProgress('');
    }
  }, [selectedScenarioIndex, slippageLimit, commissionCeiling, maxDailyGas, currentScenario, activeTab]);

  // Compute filtered logs dynamically
  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchesSearch = 
        log.name.toLowerCase().includes(auditSearchQuery.toLowerCase()) || 
        log.details.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
        log.chain.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
        log.actionType.toLowerCase().includes(auditSearchQuery.toLowerCase());
      
      const matchesStatus = auditStatusFilter === 'all' ? true : log.status === auditStatusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [auditLogs, auditSearchQuery, auditStatusFilter]);

  // Dynamic style mappings for scenarios
  const getScenarioBadge = (name: string) => {
    if (name.includes('Rug') || name.includes('Commission')) {
      return { text: 'Commission Rug Alert', style: 'bg-orange-50 border-orange-200 text-orange-700' };
    }
    if (name.includes('Downtime') || name.includes('Uptime')) {
      return { text: 'Downtime Detected', style: 'bg-red-50 border-red-200 text-red-700' };
    }
    if (name.includes('Slippage') || name.includes('Volatile')) {
      return { text: 'High Slippage DEX', style: 'bg-indigo-50 border-indigo-200 text-indigo-700' };
    }
    if (name.includes('Illegal') || name.includes('Transfer')) {
      return { text: 'Security Attempt', style: 'bg-rose-50 border-rose-200 text-rose-700' };
    }
    return { text: 'Standard Checkup', style: 'bg-emerald-50 border-emerald-200 text-emerald-700' };
  };

  return (
    <div className="w-full space-y-8 rounded-3xl border border-gray-150 bg-white p-6 shadow-xl shadow-gray-100/60 sm:p-8 luxury-shadow-light bright-card">
      
      {/* 1. Header Container - Premium Glassmorphic Identity */}
      <div className="flex flex-col gap-5 border-b border-gray-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-80"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
            </span>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">
              Running On Your Device
            </p>
          </div>
          <h2 className="font-['Playfair_Display',_serif] text-3xl font-light tracking-tight text-black">
            Staking Agent
          </h2>
          <p className="text-xs font-light text-gray-400">
            Everything runs locally on your device. Your keys never leave your hardware.
          </p>
        </div>
        
        {/* Sovereign Indicator Shield */}
        <div className="flex items-center gap-3 self-start rounded-full border border-emerald-100 bg-emerald-50/20 px-4 py-2 text-xs font-medium text-emerald-800 shadow-sm shadow-emerald-100/10 sm:self-center">
          <Fingerprint className="h-4.5 w-4.5 text-emerald-600 animate-pulse" />
          <div className="flex flex-col">
            <span className="font-semibold leading-tight">Non-Custodial</span>
            <span className="text-[9px] font-normal text-emerald-600/80">Your keys stay on-device</span>
          </div>
        </div>
      </div>

      {/* 2. Target Audience Navigation Tabs */}
      <div className="grid grid-cols-3 gap-2 rounded-xl border border-gray-100 bg-gray-50/40 p-1.5 shadow-inner">
        <button
          onClick={() => {
            setActiveTab('yield');
            setRunResult(null);
          }}
          className={`flex flex-col items-center justify-center gap-1 rounded-lg py-3 text-center transition-all ${
            activeTab === 'yield'
              ? 'bg-white text-black font-semibold shadow-sm border border-gray-150'
              : 'text-gray-500 hover:text-gray-900 hover:bg-white/40'
          }`}
        >
          <Activity className={`h-4.5 w-4.5 ${activeTab === 'yield' ? 'text-black' : 'text-gray-400'}`} />
          <span className="text-xs">Auto-Optimize</span>
          <span className="text-[9px] font-normal text-gray-400 hidden sm:inline">Set preferences, we handle the rest</span>
        </button>
        
        <button
          onClick={() => {
            setActiveTab('airdrop');
            setRunResult(null);
          }}
          className={`flex flex-col items-center justify-center gap-1 rounded-lg py-3 text-center transition-all ${
            activeTab === 'airdrop'
              ? 'bg-white text-black font-semibold shadow-sm border border-gray-150'
              : 'text-gray-500 hover:text-gray-900 hover:bg-white/40'
          }`}
        >
          <Award className={`h-4.5 w-4.5 ${activeTab === 'airdrop' ? 'text-black' : 'text-gray-400'}`} />
          <span className="text-xs">Airdrops & Voting</span>
          <span className="text-[9px] font-normal text-gray-400 hidden sm:inline">Maximize eligibility</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('compliance');
            setRunResult(null);
          }}
          className={`flex flex-col items-center justify-center gap-1 rounded-lg py-3 text-center transition-all ${
            activeTab === 'compliance'
              ? 'bg-white text-black font-semibold shadow-sm border border-gray-150'
              : 'text-gray-500 hover:text-gray-900 hover:bg-white/40'
          }`}
        >
          <Shield className={`h-4.5 w-4.5 ${activeTab === 'compliance' ? 'text-black' : 'text-gray-400'}`} />
          <span className="text-xs">Security & Audit</span>
          <span className="text-[9px] font-normal text-gray-400 hidden sm:inline">How your assets stay safe</span>
        </button>
      </div>

      {/* 3. Main Dashboard Workspace Layout */}
      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Left Interactive Control Panel (8 Cols) */}
        <div className="space-y-6 lg:col-span-8">
          
          {/* TAB 1: RETAIL YIELD OPTIMIZER (SET & FORGET) */}
          {activeTab === 'yield' && (
            <div className="space-y-6">
              
              {/* Top Quick Status Metric Grid */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-gray-100 bg-gray-50/40 p-4 shadow-sm">
                  <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    <Coins className="h-3.5 w-3.5 text-gray-400" />
                    Total Staked
                  </span>
                  <span className="mt-1 block text-xl font-light text-black">$34,520.00</span>
                </div>
                
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/10 p-4 shadow-sm">
                  <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                    Extra Yield Earned
                  </span>
                  <span className="mt-1 block text-xl font-bold text-emerald-600">+1.85% APY</span>
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50/40 p-4 shadow-sm">
                  <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    <Server className="h-3.5 w-3.5 text-gray-400" />
                    Approved Validators
                  </span>
                  <span className="mt-1 block text-xl font-light text-black">8 Approved</span>
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50/40 p-4 shadow-sm">
                  <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    <Cpu className="h-3.5 w-3.5 text-blue-500" />
                    AI Engine
                  </span>
                  <span className="mt-1 block text-xl font-light text-blue-600">On-Device AI</span>
                </div>
              </div>

              {/* Telemetry Scenario Hub */}
              <div className="space-y-4 rounded-2xl border border-gray-150 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="h-4.5 w-4.5 text-gray-700" />
                    <h3 className="text-base font-semibold text-black">Test Scenarios</h3>
                  </div>
                  <span className="text-[10px] text-gray-400">Select a scenario to see how the agent would respond</span>
                </div>
                
                <p className="text-xs text-gray-500 leading-relaxed">
                  Pick a network scenario below, then run the agent to see how it evaluates conditions, applies your safety rules, and decides what action to take.
                </p>

                {/* Scenario Grid */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {TEST_SCENARIOS.map((scenario, idx) => {
                    const badge = getScenarioBadge(scenario.name);
                    const isSelected = selectedScenarioIndex === idx;
                    
                    // Style indicators for active chains
                    const chainColors: Record<string, string> = {
                      cosmos: 'bg-violet-500',
                      solana: 'bg-teal-400',
                      ethereum: 'bg-sky-400'
                    };

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedScenarioIndex(idx);
                          setRunResult(null);
                        }}
                        className={`group relative flex flex-col justify-between rounded-xl border p-4 text-left transition-all ${
                          isSelected
                            ? 'border-black bg-gray-50/80 ring-1 ring-black shadow-md'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        {/* Upper row: Chain and type status */}
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${chainColors[scenario.context.chain] || 'bg-gray-400 animate-pulse'}`}></span>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                              {scenario.context.chain.toUpperCase()}
                            </span>
                          </div>
                          <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold border ${badge.style}`}>
                            {badge.text}
                          </span>
                        </div>

                        {/* Title and details */}
                        <div className="mt-3.5">
                          <span className="block font-semibold text-black text-sm leading-tight group-hover:text-gray-900">
                            {scenario.name}
                          </span>
                          <span className="mt-1 block text-[10px] text-gray-400 leading-normal line-clamp-1">
                            {scenario.description}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Context Details Deck */}
                <div className="rounded-xl border border-gray-150 bg-gray-50/60 p-4 text-xs leading-relaxed text-gray-600 shadow-inner">
                  <div className="font-semibold text-black flex items-center gap-1.5 mb-1.5">
                    <Activity className="h-4 w-4 text-gray-600" />
                    Current Network Status:
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-gray-200/50 pt-2 text-[11px]">
                    <div><span className="text-gray-400">Current Validator:</span> <span className="font-medium text-black">{currentScenario.context.activeValidator.name}</span></div>
                    <div><span className="text-gray-400">Slippage:</span> <span className="font-medium text-black">{currentScenario.context.slippagePct.toFixed(2)}%</span></div>
                    <div><span className="text-gray-400">Uptime:</span> <span className={`font-semibold ${currentScenario.context.activeValidator.uptimePct < 99 ? 'text-rose-600' : 'text-black'}`}>{currentScenario.context.activeValidator.uptimePct}%</span></div>
                    <div><span className="text-gray-400">Commission:</span> <span className={`font-semibold ${currentScenario.context.activeValidator.commissionPct > commissionCeiling ? 'text-orange-600' : 'text-black'}`}>{currentScenario.context.activeValidator.commissionPct}%</span></div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: AIRDROP HUNTER & GOV SENTINEL */}
          {activeTab === 'airdrop' && (
            <div className="space-y-6">
              
              {/* Premium Airdrop Dashboard Banner */}
              <div className="flex flex-col gap-6 rounded-2xl border border-gray-150 bg-gradient-to-br from-violet-50/30 via-white to-gray-50/30 p-6 shadow-sm sm:flex-row sm:items-center">
                
                {/* Score Dial */}
                <div className="flex flex-col items-center justify-center rounded-2xl border border-violet-100 bg-white p-5 shadow-sm text-center shrink-0 min-w-[150px]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Airdrop Score</span>
                  <div className="mt-2.5 relative flex items-center justify-center">
                    <span className="text-4xl font-light text-black tracking-tight">{airdropScore}%</span>
                    <Sparkles className="absolute -top-2.5 -right-3 h-4.5 w-4.5 text-violet-500 animate-pulse" />
                  </div>
                  <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-violet-50 border border-violet-100 px-2.5 py-0.5 text-[9px] font-bold text-violet-700 uppercase tracking-wide">
                    {airdropScore >= 85 ? 'Premium Boosted' : 'Optimizing'}
                  </span>
                </div>

                {/* Score Description */}
                <div className="space-y-3.5">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-violet-600" />
                    <h3 className="text-base font-bold text-black">Airdrop Eligibility Optimizer</h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Many airdrops exclude wallets that stake with large exchanges or top validators. The agent splits your delegation and votes on governance proposals to maximize your eligibility score.
                  </p>
                  
                  {/* Dynamic optimization tip */}
                  <div className="text-[10px] text-violet-700 bg-violet-50/50 border border-violet-100/50 rounded-lg p-2.5 font-medium leading-relaxed">
                    {airdropScore >= 85 
                      ? '🚀 Excellent! Your setup maximizes eligibility for most major airdrops.'
                      : '💡 Tip: Enable "Avoid Top 10 Validators" and increase the split count to improve your airdrop eligibility.'
                    }
                  </div>
                </div>

              </div>

              {/* Optimization Rules Hub */}
              <div className="grid gap-6 sm:grid-cols-2">
                
                {/* Decentralization Controls */}
                <div className="rounded-2xl border border-gray-150 bg-white p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                    <Sliders className="h-4 w-4 text-gray-800" />
                    <span className="text-xs font-bold uppercase tracking-wider text-black">Split Constraints</span>
                  </div>

                  <div className="space-y-4">
                    {/* Delegation split ratio */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                         <span className="block text-xs font-semibold text-gray-700">Split Across Validators</span>
                         <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded border border-violet-100">{delegationSplit} Validators</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={delegationSplit}
                        onChange={(e) => setDelegationSplit(parseInt(e.target.value))}
                        className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-black"
                      />
                      <span className="block text-[9px] text-gray-400">
                        Spreads your stake across multiple validators to avoid concentration penalties.
                      </span>
                    </div>

                    {/* Checkboxes for avoidance */}
                    <div className="space-y-2.5 border-t border-gray-100 pt-3.5">
                      
                      <label className="flex items-center justify-between cursor-pointer rounded-lg border border-gray-100 p-3 hover:bg-gray-50/50">
                        <div>
                          <span className="block text-xs font-semibold text-gray-850">Avoid Top-10 Validators</span>
                           <span className="block text-[9px] text-gray-400">Automatically moves stake away from overly large validators.</span>
                        </div>
                        <button 
                          onClick={() => setAvoidTop10(!avoidTop10)}
                          className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            avoidTop10 ? 'bg-black' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            avoidTop10 ? 'translate-x-5' : 'translate-x-0'
                          }`}></span>
                        </button>
                      </label>

                      <label className="flex items-center justify-between cursor-pointer rounded-lg border border-gray-100 p-3 hover:bg-gray-50/50">
                        <div>
                          <span className="block text-xs font-semibold text-gray-850">Avoid Custodial Exchanges</span>
                           <span className="block text-[9px] text-gray-400">Avoids exchange-operated validators to improve airdrop chances.</span>
                        </div>
                        <button 
                          onClick={() => setAvoidExchanges(!avoidExchanges)}
                          className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            avoidExchanges ? 'bg-black' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            avoidExchanges ? 'translate-x-5' : 'translate-x-0'
                          }`}></span>
                        </button>
                      </label>

                    </div>

                  </div>
                </div>

                {/* Governance Proxy Selection */}
                <div className="rounded-2xl border border-gray-150 bg-white p-5 space-y-4 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                      <Vote className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-bold uppercase tracking-wider text-black">Auto-Voting</span>
                    </div>

                    <p className="mt-3.5 text-xs text-gray-550 leading-relaxed">
                      Many airdrops require active governance participation. Choose how the agent votes on your behalf to maintain eligibility.
                    </p>

                    <div className="mt-4 flex flex-col gap-2">
                      <button
                        onClick={() => setGovProxyMode('active')}
                        className={`flex items-center justify-between rounded-lg border p-3 text-left transition-all ${
                          govProxyMode === 'active'
                            ? 'border-black bg-gray-50 shadow-sm ring-1 ring-black'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div>
                          <span className="block text-xs font-bold text-black">Vote with Majority</span>
                          <span className="text-[9px] text-gray-400 leading-normal block">Automatically votes with the community consensus</span>
                        </div>
                        {govProxyMode === 'active' && <CheckCircle2 className="h-4 w-4 text-black shrink-0" />}
                      </button>

                      <button
                        onClick={() => setGovProxyMode('passive')}
                        className={`flex items-center justify-between rounded-lg border p-3 text-left transition-all ${
                          govProxyMode === 'passive'
                            ? 'border-black bg-gray-50 shadow-sm ring-1 ring-black'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div>
                          <span className="block text-xs font-bold text-black">Follow My Validator</span>
                          <span className="text-[9px] text-gray-400 leading-normal block">Votes the same way as your delegated validator</span>
                        </div>
                        {govProxyMode === 'passive' && <CheckCircle2 className="h-4 w-4 text-black shrink-0" />}
                      </button>

                      <button
                        onClick={() => setGovProxyMode('custom')}
                        className={`flex items-center justify-between rounded-lg border p-3 text-left transition-all ${
                          govProxyMode === 'custom'
                            ? 'border-black bg-gray-50 shadow-sm ring-1 ring-black'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div>
                          <span className="block text-xs font-bold text-black">Ask Me Each Time</span>
                          <span className="text-[9px] text-gray-400 leading-normal block">Notifies you and waits for your manual approval</span>
                        </div>
                        {govProxyMode === 'custom' && <CheckCircle2 className="h-4 w-4 text-black shrink-0" />}
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: SOVEREIGN TRUST & INST AUDIT LEDGER */}
          {activeTab === 'compliance' && (
            <div className="space-y-6">
              
              {/* Secure Enclave Split Key Schematic */}
              <div className="rounded-2xl border border-gray-150 bg-gradient-to-b from-gray-50 to-white p-5 shadow-sm">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                  <LockKeyhole className="h-5 w-5 text-gray-800" />
                  <h3 className="text-sm font-semibold text-black">How Your Assets Stay Safe</h3>
                </div>

                <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                  Your security uses a two-key design. The agent can only stake and restake — it can never withdraw or transfer your funds to an external address.
                </p>

                {/* CSS Blueprint Graphic */}
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  
                  {/* Left Column: Secure Enclave */}
                  <div className="rounded-xl border border-dashed border-gray-250 bg-white p-4 space-y-2 relative overflow-hidden shadow-inner">
                    <div className="absolute top-2.5 right-3.5 flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                    </div>
                     <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                       <Fingerprint className="h-4.5 w-4.5 text-gray-700" />
                       YOUR MASTER KEY
                     </div>
                    <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 uppercase">
                      Offline Master Key
                    </span>
                    <p className="text-[10px] text-gray-550 leading-relaxed">
                      Holds <strong>Withdrawal & Transfer Authority</strong>. Ephemeral model daemons have zero access. Transactions to external pools are blocked programmatically at the hardware level.
                    </p>
                  </div>

                  {/* Right Column: Staking PDA */}
                  <div className="rounded-xl border border-dashed border-gray-250 bg-white p-4 space-y-2 relative overflow-hidden shadow-inner">
                    <div className="absolute top-2.5 right-3.5 flex h-2 w-2">
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                    </div>
                     <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                       <Key className="h-4.5 w-4.5 text-blue-500" />
                       AGENT STAKING KEY
                     </div>
                     <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-700 uppercase">
                       Staking Only
                     </span>
                     <p className="text-[10px] text-gray-550 leading-relaxed">
                       Can <strong>stake, restake, and compound rewards</strong>. Handles automatic rebalancing within your approved validator set.
                     </p>
                  </div>

                </div>

                <div className="mt-3.5 rounded-lg bg-gray-50 border border-gray-150 p-3 text-[10px] text-gray-500 text-center leading-relaxed">
                  🛡️ <strong>Your protection:</strong> All code runs on your device. Your keys are never shared. No intermediary ever has custody of your assets.
                </div>
              </div>

              {/* Legislative Exemption Gateways */}
              <div className="rounded-2xl border border-gray-150 bg-white p-5 space-y-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-gray-800 animate-pulse" />
                  <h3 className="text-sm font-semibold text-black">Regulatory Compliance Checks</h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  
                  {/* US SEC */}
                  <div className="rounded-xl border border-gray-100 bg-gray-50/30 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">US SEC</span>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">PASS</span>
                    </div>
                      <span className="block text-xs font-bold text-black">Advisers Act 1940</span>
                      <p className="text-[10px] text-gray-550 leading-relaxed">
                        Compliant. Stakefolio never takes custody of or pools your assets.
                      </p>
                  </div>

                  {/* Canada CSA */}
                  <div className="rounded-xl border border-gray-100 bg-gray-50/30 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Canada CSA</span>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">PASS</span>
                    </div>
                      <span className="block text-xs font-bold text-black">Staff Notice 21-332</span>
                      <p className="text-[10px] text-gray-550 leading-relaxed">
                        Compliant. Direct peer-to-peer staking — your assets go straight to on-chain validators.
                      </p>
                  </div>

                  {/* EU MiCA */}
                  <div className="rounded-xl border border-gray-100 bg-gray-50/30 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">EU MiCA</span>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">PASS</span>
                    </div>
                      <span className="block text-xs font-bold text-black">Recital 22 Exclusions</span>
                      <p className="text-[10px] text-gray-550 leading-relaxed">
                        Compliant. Open-source, non-custodial software with no intermediaries.
                      </p>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>

        {/* Right Active Monitor Panel (4 Cols) */}
        <div className="space-y-6 lg:col-span-4">
          
          {/* Active Settings Panel */}
          <div className="rounded-2xl border border-gray-150 bg-gray-50/40 p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-black">Your Safety Limits</h3>
            
            <div className="space-y-4 text-xs">
              
              {/* Slippage slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                   <span className="text-gray-500 font-medium">Max Slippage</span>
                  <span className="font-bold text-black">{slippageLimit.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="3.0"
                  step="0.1"
                  value={slippageLimit}
                  onChange={(e) => {
                    setSlippageLimit(parseFloat(e.target.value));
                    setRunResult(null);
                  }}
                  className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-gray-250 accent-black"
                />
              </div>

              {/* Commission limit slider */}
              <div className="space-y-2 border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between">
                   <span className="text-gray-500 font-medium">Max Commission</span>
                  <span className="font-bold text-black">{commissionCeiling.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="15.0"
                  step="0.5"
                  value={commissionCeiling}
                  onChange={(e) => {
                    setCommissionCeiling(parseFloat(e.target.value));
                    setRunResult(null);
                  }}
                  className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-gray-250 accent-black"
                />
              </div>

              {/* Gas Limit slider */}
              <div className="space-y-2 border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between">
                   <span className="text-gray-500 font-medium">Max Daily Gas Fee</span>
                  <span className="font-bold text-black">{maxDailyGas.toFixed(2)} ETH</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.20"
                  step="0.01"
                  value={maxDailyGas}
                  onChange={(e) => {
                    setMaxDailyGas(parseFloat(e.target.value));
                    setRunResult(null);
                  }}
                  className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-gray-250 accent-black"
                />
              </div>

              {/* Toggle Switches */}
              <div className="space-y-2.5 border-t border-gray-100 pt-3 text-[11px] text-gray-650">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-gray-400" />
                    Non-Custodial (your keys only)
                  </span>
                  <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 uppercase border border-emerald-100">
                    Active
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-gray-400" />
                    Hardware Key Protection
                  </span>
                  <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 uppercase border border-emerald-100">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-gray-400" />
                    Validator uptime checks
                  </span>
                  <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 uppercase border border-emerald-100">
                    Active
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Action Trigger Console Button */}
          <div className="space-y-4">
            <button
              onClick={handleRunAgent}
              disabled={isRunning}
              className="inline-flex w-full flex-col items-center justify-center gap-1.5 rounded-2xl bg-black py-4 px-5 text-center font-semibold text-white transition-all hover:bg-gray-800 disabled:opacity-50 shadow-md shadow-gray-200"
            >
              {isRunning ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 animate-spin text-white" />
                    <span className="text-sm font-semibold">Running local verification...</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm font-semibold">
                   <Play className="h-4 w-4 fill-white" />
                   Run Agent Check
                </div>
              )}
            </button>

            {/* Run Progress Stage Subtitle */}
            {isRunning && runProgress && (
              <div className="rounded-xl border border-gray-150 bg-white p-4 shadow-sm text-center">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-450 mb-1">Processing</span>
                <span className="text-[11px] font-medium text-black leading-snug animate-pulse">{runProgress}</span>
                
                {/* Horizontal progress bar */}
                <div className="mt-3.5 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full bg-black animate-infinite-loading animate-[pulse_1s_infinite]"></div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* 4. RUN RESULT COMPONENT - Rich cryptographic verification deck */}
      {runResult && (
        <div className={`overflow-hidden rounded-2xl border p-5 space-y-5 transition-all animate-[fadeIn_0.3s_ease-out] ${
          runResult.success 
            ? 'border-emerald-200 bg-emerald-50/10' 
            : 'border-amber-200 bg-amber-50/10'
        }`}>
          
          {/* Header Row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200/50 pb-4">
            <div className="flex items-center gap-3">
              {runResult.success ? (
                <div className="rounded-full bg-emerald-100 p-1.5 text-emerald-800">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
              ) : (
                <div className="rounded-full bg-amber-100 p-1.5 text-amber-800">
                  <AlertTriangle className="h-6 w-6 text-amber-600 animate-bounce" />
                </div>
              )}
              <div>
                <h4 className="text-base font-bold text-black leading-tight">
                  {runResult.success ? 'Action Approved ✓' : 'Action Blocked — Safety Rule Triggered'}
                </h4>
                <span className="text-xs text-gray-500">Agent Decision</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-bold border uppercase tracking-wider ${
                runResult.success 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                  : 'bg-amber-50 border-amber-250 text-amber-800'
              }`}>
                {runResult.success ? 'All Checks Passed' : 'Safety Limit Exceeded'}
              </span>
            </div>
          </div>

          {/* Verification Details */}
          <div className="grid gap-5 sm:grid-cols-2">
            
            {/* Model outputs */}
            <div className="space-y-2">
              <span className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5" />
                  AI Agent Output (Advanced)
                </span>
                {runResult.rawOutput && (
                  <button 
                    onClick={() => triggerCopy(runResult.rawOutput || '', 'json')}
                    className="flex items-center gap-1 text-[9px] hover:text-black font-semibold text-gray-550 border border-gray-200 rounded px-1.5 py-0.5 hover:bg-gray-50"
                  >
                    {copiedId === 'json' ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy JSON
                      </>
                    )}
                  </button>
                )}
              </span>
              <pre className="overflow-x-auto rounded-xl border border-gray-150 bg-white p-4 text-[11px] text-gray-800 leading-relaxed font-mono shadow-inner max-h-[160px] overflow-y-auto">
                {runResult.rawOutput}
              </pre>
            </div>

            {/* Safety report */}
            <div className="space-y-2">
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                <Shield className="h-3.5 w-3.5" />
                Safety Check Results
              </span>
              <div className="rounded-xl border border-gray-150 bg-white p-4 text-xs space-y-3 shadow-inner h-[160px] overflow-y-auto">
                {runResult.success ? (
                  <div className="space-y-2.5">
                    <p className="text-emerald-700 leading-relaxed font-semibold">
                      ✓ All safety checks passed. Your slippage, commission, and gas limits are all within range.
                    </p>
                    <div className="border-t border-gray-100 pt-2 text-[10px] text-gray-550 leading-relaxed">
                      <strong>Compliance:</strong> Verified against US, Canadian, and EU regulatory frameworks. Fully compliant.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-rose-700 font-bold flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                      Rule Violation: {runResult.auditRules?.join(', ')}
                    </div>
                    <p className="text-gray-650 leading-relaxed font-medium">
                      {runResult.reasons?.join(' | ')}
                    </p>
                    <div className="border-t border-gray-100 pt-2 text-[9px] font-bold text-gray-400 leading-normal uppercase tracking-wider">
                      Jurisdiction: {runResult.jurisdictions?.join(', ')}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Compiled Payloads Deck - Actual Compiler Serialization outputs */}
          {runResult.success && runResult.transaction && (
            <div className="border-t border-gray-200/50 pt-4.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  <FileCode className="h-3.5 w-3.5" />
                  Transaction Details (Advanced)
                </span>
                
                <button 
                  onClick={() => triggerCopy(runResult.transaction?.unsignedBytesHex || '', 'bytecode')}
                  className="flex items-center gap-1 text-[9px] hover:text-black font-semibold text-gray-550 border border-gray-200 rounded px-2 py-1 hover:bg-gray-50"
                >
                  {copiedId === 'bytecode' ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-600" />
                      Copied Bytecode
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy Hex Calldata
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-xl border border-emerald-100 bg-white p-4.5 space-y-3.5 shadow-sm">
                
                {/* Meta details */}
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Prepared Action</span>
                    <span className="block font-bold text-black text-sm">
                      {runResult.transaction.description}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded bg-blue-50 border border-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700 uppercase">
                      Signatory: {runResult.transaction.signatory === 'ephemeral_hot_wallet' ? 'Hot Staking PDA Key' : 'Master Enclave'}
                    </span>
                    <span className="rounded bg-violet-50 border border-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700 uppercase">
                      Target: {currentScenario.context.chain.toUpperCase()} SDK
                    </span>
                  </div>
                </div>

                {/* Bytecode block */}
                <div className="space-y-1.5">
                  <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wide">Transaction Data (Ready to Sign)</span>
                  <div className="break-all rounded-lg bg-gray-50 border border-gray-150 p-3.5 text-xs text-gray-600 font-mono leading-relaxed max-h-[90px] overflow-y-auto shadow-inner">
                    {runResult.transaction.unsignedBytesHex}
                  </div>
                </div>

                {/* Secure trust footnote */}
                <div className="flex items-start gap-2 rounded bg-gray-50 border border-gray-100 p-3 text-[10px] text-gray-500 leading-normal">
                  <Fingerprint className="h-4.5 w-4.5 text-gray-450 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-black block">Security Note:</strong>
                    This transaction was built on your device. Your staking key can sign and broadcast it, but your withdrawal key remains untouched — only you can withdraw funds.
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

      {/* 5. DYNAMIC CHRONOLOGICAL AUDIT LEDGER - Enhanced terminal CLI experience */}
      <div className="border-t border-gray-100 pt-7 space-y-4">
        
        {/* Header and filters row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-black flex items-center gap-2">
              <Server className="h-4.5 w-4.5 text-gray-700" />
              Activity Log
            </h3>
            <span className="text-xs text-gray-400 block">History of all agent actions and decisions</span>
          </div>

          {/* Search and filters controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Search Input */}
            <div className="relative shrink-0">
              <input
                type="text"
                placeholder="Search audit trail..."
                value={auditSearchQuery}
                onChange={(e) => setAuditSearchQuery(e.target.value)}
                className="w-[180px] rounded-lg border border-gray-200 bg-white py-1.5 pl-8 pr-3 text-xs text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black placeholder-gray-400 shadow-sm"
              />
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
            </div>

            {/* Filter Tabs */}
            <div className="flex rounded-lg border border-gray-200 bg-white p-0.5 text-xs shadow-sm">
              <button
                onClick={() => setAuditStatusFilter('all')}
                className={`rounded-md px-2.5 py-1 transition-all ${
                  auditStatusFilter === 'all'
                    ? 'bg-black text-white font-semibold'
                    : 'text-gray-550 hover:text-black'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setAuditStatusFilter('Approved')}
                className={`rounded-md px-2.5 py-1 transition-all ${
                  auditStatusFilter === 'Approved'
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-gray-555 hover:text-black'
                }`}
              >
                Passed
              </button>
              <button
                onClick={() => setAuditStatusFilter('Blocked')}
                className={`rounded-md px-2.5 py-1 transition-all ${
                  auditStatusFilter === 'Blocked'
                    ? 'bg-amber-50 text-amber-700 font-semibold'
                    : 'text-gray-555 hover:text-black'
                }`}
              >
                Blocked
              </button>
            </div>

          </div>
        </div>

        {/* Ledger logs container */}
        <div className="divide-y divide-gray-100 rounded-2xl border border-gray-150 bg-gray-50/20 overflow-hidden text-sm shadow-inner max-h-[300px] overflow-y-auto">
          {filteredAuditLogs.length > 0 ? (
            filteredAuditLogs.map((log) => (
              <div key={log.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between hover:bg-white/60 transition-colors">
                
                {/* Left side: Time, category, details */}
                <div className="flex items-start gap-3">
                  <span className="text-[10px] text-gray-400 font-mono mt-1 shrink-0 bg-white border border-gray-150 px-1.5 py-0.5 rounded shadow-sm">
                    {log.timestamp}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-black text-xs leading-none">{log.name}</span>
                      <span className="rounded bg-violet-50 text-violet-700 text-[9px] px-2 py-0.5 font-bold border border-violet-100/50 uppercase">
                        {log.actionType}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-gray-550 leading-relaxed">{log.details}</p>
                  </div>
                </div>

                {/* Right side: Badge statuses */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{log.chain}</span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                    log.status === 'Approved' 
                      ? 'bg-emerald-50 border-emerald-150 text-emerald-800' 
                      : 'bg-amber-50 border-amber-200 text-amber-800'
                  }`}>
                    {log.status === 'Approved' ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        VERIFIED
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-3 w-3 text-amber-600 animate-pulse" />
                        BLOCKED
                      </>
                    )}
                  </span>
                </div>

              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-gray-450 leading-relaxed bg-white">
              No local client audit ledger entries match your filter criteria.
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
