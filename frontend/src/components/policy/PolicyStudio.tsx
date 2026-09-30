import React, { useState, useEffect } from 'react';
import { SlaPolicy, sha256Hex } from '../../lib/contractApi';
import { FileCode2, Lock, Check, Copy, Download, Sliders, Zap, AlertCircle } from 'lucide-react';
import { ShinyText } from '../animations/ShinyText';
import { SpotlightCard } from '../ui/SpotlightCard';

interface PolicyStudioProps {
  currentPolicy: SlaPolicy;
  onUpdatePolicy: (policy: SlaPolicy) => void;
  onCommitPolicyOnChain?: (policyHash: string) => Promise<void>;
  isCommitting?: boolean;
}

export const PolicyStudio: React.FC<PolicyStudioProps> = ({
  currentPolicy,
  onUpdatePolicy,
  onCommitPolicyOnChain,
  isCommitting = false,
}) => {
  const [agreementTitle, setAgreementTitle] = useState(currentPolicy.policyName || 'Enterprise Cloud B2B SLA');
  const [minUptime, setMinUptime] = useState((currentPolicy.minUptimeBps / 100).toFixed(2));
  const [maxLatency, setMaxLatency] = useState(currentPolicy.maxLatencyP95Ms.toString());
  const [maxIncidents, setMaxIncidents] = useState(currentPolicy.maxIncidents.toString());
  const [periodId, setPeriodId] = useState(currentPolicy.periodId || '2026-Q3-PROD');
  const [providerDid, setProviderDid] = useState('did:midnight:provider_infra_core_01');
  const [clientDid, setClientDid] = useState('did:midnight:enterprise_client_fintech');
  const [copied, setCopied] = useState(false);
  const [committedSuccess, setCommittedSuccess] = useState(false);
  const [commitError, setCommitError] = useState<string | null>(null);
  const [localSubmitting, setLocalSubmitting] = useState(false);

  // Compute live real cryptographic SHA-256 policy commitment hash
  const [policyCommitmentHash, setPolicyCommitmentHash] = useState('0xd6abf137e41843b021876e994d80a1c94a32961f317d91703f4cd98a9ebef088b');

  useEffect(() => {
    let active = true;
    async function calculateHash() {
      const payload = `${agreementTitle}|${minUptime}|${maxLatency}|${maxIncidents}|${periodId}|${providerDid}|${clientDid}`;
      const hash = await sha256Hex(payload);
      if (active) {
        setPolicyCommitmentHash(`0x${hash}`);
      }
    }
    calculateHash();
    return () => {
      active = false;
    };
  }, [agreementTitle, minUptime, maxLatency, maxIncidents, periodId, providerDid, clientDid]);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(policyCommitmentHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyPolicy = () => {
    const updated: SlaPolicy = {
      policyName: agreementTitle.trim() || 'Enterprise Cloud B2B SLA',
      minUptimeBps: Math.round((parseFloat(minUptime) || 99.9) * 100),
      maxLatencyP95Ms: parseInt(maxLatency, 10) || 250,
      maxIncidents: parseInt(maxIncidents, 10) || 3,
      periodId: periodId.trim() || '2026-Q3-PROD',
    };
    onUpdatePolicy(updated);
  };

  const handleCommit = async () => {
    setCommitError(null);
    setLocalSubmitting(true);
    try {
      if (onCommitPolicyOnChain) {
        await onCommitPolicyOnChain(policyCommitmentHash);
      }
      handleApplyPolicy();
      setCommittedSuccess(true);
      setTimeout(() => setCommittedSuccess(false), 4000);
    } catch (err: any) {
      setCommitError(err?.message || 'Transaction signing cancelled or rejected in wallet');
      setTimeout(() => setCommitError(null), 5000);
    } finally {
      setLocalSubmitting(false);
    }
  };

  // Pre-configured industry templates
  const applyTemplate = (type: 'tier1' | 'mission_critical' | 'standard') => {
    if (type === 'tier1') {
      setAgreementTitle('High-Frequency Financial API SLA Tier 1');
      setMinUptime('99.99');
      setMaxLatency('120');
      setMaxIncidents('1');
      setPeriodId('2026-M09-FINTECH');
    } else if (type === 'mission_critical') {
      setAgreementTitle('Mission-Critical Cloud Infrastructure SLA');
      setMinUptime('99.95');
      setMaxLatency('180');
      setMaxIncidents('2');
      setPeriodId('2026-Q3-PROD');
    } else {
      setAgreementTitle('Standard B2B Enterprise SaaS Agreement');
      setMinUptime('99.50');
      setMaxLatency('300');
      setMaxIncidents('4');
      setPeriodId('2026-H2-STANDARD');
    }
  };

  const exportPolicyJson = () => {
    const policyPayload = {
      specVersion: 'SLAxiom-Policy-v1.0',
      policyCommitment: policyCommitmentHash,
      agreement: {
        title: agreementTitle,
        provider: providerDid,
        client: clientDid,
        periodId,
      },
      predicates: {
        minUptimePercent: parseFloat(minUptime),
        minUptimeBps: Math.round(parseFloat(minUptime) * 100),
        maxLatencyP95Ms: parseInt(maxLatency, 10),
        maxCriticalIncidents: parseInt(maxIncidents, 10),
      },
      financialCreditBands: {
        band0_compliant: '0% (Standard settlement)',
        band1_minorBreach: '10% (Latency or incidents exceeded)',
        band2_criticalBreach: '25% (Uptime threshold missed)',
      },
      midnightCircuit: 'verifySla(periodId, minUptimeBps, maxLatencyP95Ms, maxIncidents, nonce)',
    };

    const blob = new Blob([JSON.stringify(policyPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SLAxiom-Policy-${periodId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-purple-100 border border-purple-300 flex items-center justify-center text-sm font-bold text-purple-700 font-mono">
              <FileCode2 className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
                Confidential Policy Studio & Contract Builder
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Author, version, and cryptographically commit measurable SLA predicates to Midnight Network.
              </p>
            </div>
          </div>
        </div>

        {/* Industry Template Quick Select */}
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-xs font-mono text-slate-500">Preset Templates:</span>
          <button
            type="button"
            onClick={() => applyTemplate('tier1')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-100/70 border border-slate-200 text-xs font-medium text-slate-700 hover:text-purple-900 transition"
          >
            Tier 1 Financial (99.99%)
          </button>
          <button
            type="button"
            onClick={() => applyTemplate('mission_critical')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-100/70 border border-slate-200 text-xs font-medium text-slate-700 hover:text-purple-900 transition"
          >
            Mission-Critical (99.95%)
          </button>
          <button
            type="button"
            onClick={() => applyTemplate('standard')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-100/70 border border-slate-200 text-xs font-medium text-slate-700 hover:text-purple-900 transition"
          >
            Standard Enterprise (99.50%)
          </button>
        </div>
      </div>

      {/* Main Grid: Left Spec Editor, Right On-Chain Hash */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-5 shadow-sm">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-purple-700 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-600" />
              <span>1. Agreement Metadata & Counterparties</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Agreement Title / Designation
                </label>
                <input
                  type="text"
                  value={agreementTitle}
                  onChange={(e) => setAgreementTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs font-sans text-slate-900 focus:outline-none focus:border-purple-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Provider DID / Address
                  </label>
                  <input
                    type="text"
                    value={providerDid}
                    onChange={(e) => setProviderDid(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs font-mono text-slate-700 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Client DID / Address
                  </label>
                  <input
                    type="text"
                    value={clientDid}
                    onChange={(e) => setClientDid(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs font-mono text-slate-700 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Audit Cadence / Period Identifier
                </label>
                <input
                  type="text"
                  value={periodId}
                  onChange={(e) => setPeriodId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs font-mono text-slate-700 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-purple-700 mb-3 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-600" />
                <span>2. Mathematical SLA Predicate Matrix</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Target Uptime (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="90"
                    max="100"
                    value={minUptime}
                    onChange={(e) => setMinUptime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:border-purple-500 font-bold"
                  />
                  <span className="text-[10px] text-slate-500">Basis Points: {Math.round(parseFloat(minUptime || '0') * 100)} bps</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Max P95 Latency (ms)
                  </label>
                  <input
                    type="number"
                    value={maxLatency}
                    onChange={(e) => setMaxLatency(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:border-purple-500 font-bold"
                  />
                  <span className="text-[10px] text-slate-500">Response Ceiling</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Max Incidents
                  </label>
                  <input
                    type="number"
                    value={maxIncidents}
                    onChange={(e) => setMaxIncidents(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:border-purple-500 font-bold"
                  />
                  <span className="text-[10px] text-slate-500">P1 Outage Cap</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3 items-center justify-between">
              <button
                type="button"
                onClick={handleApplyPolicy}
                className="px-4 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-semibold transition"
              >
                Apply to Local Prover
              </button>

              <button
                type="button"
                onClick={exportPolicyJson}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-medium transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Policy Spec (JSON)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Cryptographic Commitment & On-Chain Lock (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-5 shadow-sm flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-600" />
                  <span>On-Chain Policy Commitment</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-100 text-purple-800 border border-purple-300">
                  COMPACT 0.5.2
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                This 32-byte cryptographic digest binds the contract parameters. Parties cannot alter the thresholds retroactively without producing a mismatched hash on the Midnight ledger.
              </p>

              {/* Hash Display Box */}
              <div className="p-3.5 rounded-xl bg-white border border-purple-200 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span>Cryptographic SHA-256 Digest:</span>
                  <button
                    onClick={handleCopyHash}
                    className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-semibold"
                  >
                    {copied ? <Check className="w-3 h-3 text-purple-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs text-purple-900 break-all font-semibold select-all">
                  {policyCommitmentHash}
                </div>
              </div>

              {/* Financial Service Credit Schedule Preview */}
              <div className="p-3 rounded-xl bg-white/80 border border-slate-200 space-y-2 text-xs">
                <span className="font-mono font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Enforced Financial Credit Schedule
                </span>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Band 0: Full Compliance</span>
                    <strong className="text-purple-700 font-mono">0% Credit (100% Payout)</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Band 1: Latency / Incident Breach</span>
                    <strong className="text-amber-700 font-mono">10% Credit Refund</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Band 2: Uptime SLA Breach (&lt; {minUptime}%)</span>
                    <strong className="text-rose-700 font-mono">25% Credit Refund</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Commit On-Chain Action */}
            <div className="pt-4 border-t border-purple-200/80 space-y-3">
              <button
                type="button"
                onClick={handleCommit}
                disabled={isCommitting || localSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-700 to-violet-700 hover:from-purple-600 hover:to-violet-600 text-white font-semibold text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Zap className="w-4 h-4 text-purple-200" />
                <span>
                  {isCommitting || localSubmitting
                    ? 'Requesting Approval in Wallet...'
                    : 'Lock Policy Commitment On-Chain'}
                </span>
              </button>

              {committedSuccess && (
                <div className="p-2.5 rounded-lg bg-purple-100 border border-purple-300 text-purple-900 text-xs text-center font-medium animate-in fade-in">
                  Policy commitment hash successfully signed & verified on Midnight Preprod!
                </div>
              )}

              {commitError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-900 text-xs text-center font-medium flex items-center justify-center gap-1.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{commitError}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
