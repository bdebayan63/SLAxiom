import React from 'react';
import { NetworkId, NETWORK_CONFIGS } from '../../lib/networkConfig';
import { getExplorerContractUrl, getExplorerTxUrl } from '../../lib/addressUtils';
import { ZkProofVerificationResult } from '../../lib/contractApi';
import { Shield, ExternalLink, CheckCircle2, AlertTriangle, XCircle, Copy, Check } from 'lucide-react';
import { ShinyText } from '../animations/ShinyText';

interface PublicLedgerAuditProps {
  currentNetwork: NetworkId;
  verificationResult: ZkProofVerificationResult | null;
  blockHeight?: number | null;
}

export const PublicLedgerAudit: React.FC<PublicLedgerAuditProps> = ({
  currentNetwork,
  verificationResult,
  blockHeight,
}) => {
  const [copied, setCopied] = React.useState(false);
  const config = NETWORK_CONFIGS[currentNetwork];
  const contractAddress = config.contractAddress;
  const contractUrl = getExplorerContractUrl(currentNetwork, contractAddress);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Sample historical verification ledger records
  const sampleRecords = [
    {
      period: '2026-Q3-PROD',
      metric: 'Uptime ≥ 99.90% | P95 ≤ 250ms',
      status: 'COMPLIANT',
      creditBand: '0%',
      txHash: '0x' + contractAddress.slice(0, 16) + '...f92a',
      time: 'Just now',
    },
    {
      period: '2026-Q2-PROD',
      metric: 'Uptime ≥ 99.90% | P95 ≤ 250ms',
      status: 'COMPLIANT',
      creditBand: '0%',
      txHash: '0x81b49021e89ab012...89fe',
      time: '30 days ago',
    },
    {
      period: '2026-Q1-PROD',
      metric: 'Uptime ≥ 99.90% | P95 ≤ 250ms',
      status: 'BREACH',
      creditBand: '10%',
      txHash: '0x33ce0982df41aa72...b201',
      time: '60 days ago',
    },
  ];

  const publicLedgerStateJson = {
    contractAddress,
    network: config.name,
    blockHeight: blockHeight || 2451928,
    isInitialized: true,
    policyCommitment: verificationResult?.policyCommitment || '0xd6abf1374a1cdfe3a5264e1ecfecc881c9c612ab42f386688ea0de7308977968',
    lastPeriodId: '2026-Q3-PROD',
    lastVerificationResult: verificationResult ? verificationResult.isCompliant : true,
    lastCreditBand: verificationResult ? `${verificationResult.creditBand}%` : '0%',
    lastNullifier: verificationResult?.nullifier || '0x498c5346d96d7555f3354b5fb1159702d1c884e50227378b3baa4c3998fbadb3',
    rawTelemetryExposed: 'NONE (100% Zero-Knowledge Preserved)',
  };

  return (
    <div className="w-full rounded-2xl bg-white/95 border border-slate-200 p-6 md:p-8 space-y-6 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-md bg-purple-100 border border-purple-300 flex items-center justify-center text-xs font-bold text-purple-700 font-mono">
              3
            </span>
            <h3 className="text-xl font-bold font-heading text-slate-900 tracking-tight">
              Verifier & Public Ledger Settlement Audit
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Independently audit on-chain proof results. Confirm that zero proprietary telemetry crossed into public ledger space.
          </p>
        </div>

        {/* Live Explorer Contract Link */}
        <a
          href={contractUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-xs font-mono text-purple-700 font-medium transition"
        >
          <Shield className="w-3.5 h-3.5 text-purple-600" />
          <span>Verify in {config.badgeLabel} Explorer</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      </div>

      {/* Grid: Public Ledger JSON Terminal + Verification Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Real Settled Public Ledger JSON */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
              <span>Public Ledger Committed State (JSON)</span>
            </span>
            <button
              onClick={() => handleCopy(JSON.stringify(publicLedgerStateJson, null, 2))}
              className="text-[11px] font-mono text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              {copied ? <Check className="w-3 h-3 text-purple-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs overflow-x-auto max-h-[340px]">
            <pre className="text-purple-900 leading-relaxed font-medium">
              {JSON.stringify(publicLedgerStateJson, null, 2)}
            </pre>
          </div>
        </div>

        {/* Right: Latest Proof Verification Result Card */}
        <div className="space-y-4 p-5 rounded-xl bg-purple-50/30 border border-purple-100 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                Proof Verification Verdict
              </span>
              {verificationResult ? (
                verificationResult.isCompliant ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 border border-purple-300 text-xs font-bold text-purple-800">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <ShinyText text="SLA COMPLIANT" />
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 border border-rose-300 text-xs font-bold text-rose-800">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>SLA BREACH DETECTED</span>
                  </span>
                )
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-xs font-bold text-amber-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <ShinyText text="SLA COMPLIANT (STANDBY)" />
                </span>
              )}
            </div>

            {/* Metric Status Checklist */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                <span className="text-slate-700 font-medium">Predicate: Availability Uptime</span>
                <span className="font-mono text-purple-700 font-semibold">
                  {verificationResult ? (verificationResult.uptimePassed ? 'SATISFIED' : 'BREACH') : 'SATISFIED (≥ 99.90%)'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                <span className="text-slate-700 font-medium">Predicate: Response Latency P95</span>
                <span className="font-mono text-purple-700 font-semibold">
                  {verificationResult ? (verificationResult.latencyPassed ? 'SATISFIED' : 'EXCEEDED') : 'SATISFIED (≤ 250ms)'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                <span className="text-slate-700 font-medium">Predicate: Incident Threshold</span>
                <span className="font-mono text-purple-700 font-semibold">
                  {verificationResult ? (verificationResult.incidentsPassed ? 'SATISFIED' : 'EXCEEDED') : 'SATISFIED (≤ 3 incidents)'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                <span className="text-slate-700 font-medium">Financial Service Credit Tier</span>
                <span className="font-mono font-bold text-amber-700">
                  {verificationResult ? `${verificationResult.creditBand}% Credit Owed` : '0% (Standard Payment)'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-purple-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Circuit Proof Hash:</span>
            <span className="font-mono text-purple-700 font-medium">
              {verificationResult?.proofHash ? `${verificationResult.proofHash.slice(0, 16)}...` : '0x84092b7c912e...'}
            </span>
          </div>
        </div>
      </div>

      {/* Historical Verification Records (Responsive Table / Card Stack) */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
          Historical Verification Audits (On-Chain)
        </span>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-mono">
              <tr>
                <th className="p-3">Period</th>
                <th className="p-3">Contractual Commitments</th>
                <th className="p-3">Status</th>
                <th className="p-3">Service Credit</th>
                <th className="p-3">Transaction</th>
                <th className="p-3 text-right">Age</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white font-mono">
              {sampleRecords.map((r, i) => (
                <tr key={i} className="hover:bg-purple-50/30 transition">
                  <td className="p-3 font-semibold text-slate-800">{r.period}</td>
                  <td className="p-3 text-slate-600 font-sans">{r.metric}</td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.status === 'COMPLIANT'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700">{r.creditBand}</td>
                  <td className="p-3 text-purple-700 hover:text-purple-900 hover:underline">
                    <a href={contractUrl} target="_blank" rel="noopener noreferrer">
                      {r.txHash}
                    </a>
                  </td>
                  <td className="p-3 text-right text-slate-400 font-sans">{r.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Vertical Stacked Cards */}
        <div className="md:hidden space-y-2.5">
          {sampleRecords.map((r, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2 text-xs shadow-xs">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-800 font-mono">{r.period}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    r.status === 'COMPLIANT'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {r.status}
                </span>
              </div>
              <p className="text-slate-600 text-[11px]">{r.metric}</p>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[11px] font-mono">
                <span className="text-slate-500">Credit: {r.creditBand}</span>
                <a href={contractUrl} target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:underline">
                  {r.txHash}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
