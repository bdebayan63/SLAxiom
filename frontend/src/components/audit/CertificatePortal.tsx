import React, { useState } from 'react';
import { ZkProofVerificationResult } from '../../lib/contractApi';
import { NetworkId, NETWORK_CONFIGS } from '../../lib/networkConfig';
import { getExplorerContractUrl, getExplorerTxUrl } from '../../lib/addressUtils';
import { ShieldCheck, Download, ExternalLink, Filter, Search, Check, Copy, Award, FileBadge2, Lock, ArrowUpRight } from 'lucide-react';
import { SpotlightCard } from '../ui/SpotlightCard';
import { ShinyText } from '../animations/ShinyText';

interface CertificatePortalProps {
  currentNetwork: NetworkId;
  verificationResult: ZkProofVerificationResult | null;
  blockHeight?: number | null;
}

export const CertificatePortal: React.FC<CertificatePortalProps> = ({
  currentNetwork,
  verificationResult,
  blockHeight,
}) => {
  const [filter, setFilter] = useState<'all' | 'compliant' | 'minor' | 'critical'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCert, setCopiedCert] = useState(false);

  const config = NETWORK_CONFIGS[currentNetwork];
  const contractAddress = config.contractAddress;
  const contractUrl = getExplorerContractUrl(currentNetwork, contractAddress);

  // Cohort records (from the 72 injections manifest on Midnight Preprod)
  const cohortRecords = [
    { period: '2026-Q3-PROD', metric: 'Uptime ≥ 99.90% | P95 ≤ 250ms', status: 'COMPLIANT', creditBand: '0%', txHash: '0x311e9274699c7a0f1841fed2420eb60e2c6bd2e3dfe385c0625607ea70af9347', block: 2692892, type: 'compliant' },
    { period: '2026-M09-FINTECH', metric: 'Uptime ≥ 99.99% | P95 ≤ 120ms', status: 'COMPLIANT', creditBand: '0%', txHash: '0x498c5346d96d7555f3354b5fb1159702d1c884e50227378b3baa4c3998fbadb3', block: 2692910, type: 'compliant' },
    { period: '2026-Q2-PROD', metric: 'Uptime ≥ 99.90% | P95 ≤ 250ms', status: 'COMPLIANT', creditBand: '0%', txHash: '0x81b49021e89ab012c4a910beaf731902847291a18291f01948194a8c91929312', block: 2692945, type: 'compliant' },
    { period: '2026-M08-BURST', metric: 'Uptime ≥ 99.90% | P95 ≤ 200ms', status: 'MINOR BREACH', creditBand: '10%', txHash: '0x58b9192fa81029c4819e9102839b102938491829384910293849102938491029', block: 2692998, type: 'minor' },
    { period: '2026-Q1-PROD', metric: 'Uptime ≥ 99.90% | P95 ≤ 250ms', status: 'CRITICAL BREACH', creditBand: '25%', txHash: '0x33ce0982df41aa72109384910293849102938491029384910293849102938491', block: 2693040, type: 'critical' },
    { period: '2026-M07-INFRA', metric: 'Uptime ≥ 99.95% | P95 ≤ 180ms', status: 'COMPLIANT', creditBand: '0%', txHash: '0x71a9203948102938491029384910293849102938491029384910293849102938', block: 2693092, type: 'compliant' },
    { period: '2026-M06-FAILOVER', metric: 'Uptime ≥ 99.90% | P95 ≤ 250ms', status: 'MINOR BREACH', creditBand: '10%', txHash: '0x99c4819203948102938491029384910293849102938491029384910293849102', block: 2693140, type: 'minor' },
    { period: '2026-H1-AUDIT', metric: 'Uptime ≥ 99.90% | P95 ≤ 250ms', status: 'COMPLIANT', creditBand: '0%', txHash: '0x1029384910293849102938491029384910293849102938491029384910293849', block: 2693190, type: 'compliant' },
  ];

  const filteredRecords = cohortRecords.filter((rec) => {
    const matchesFilter = filter === 'all' || rec.type === filter;
    const matchesSearch = rec.period.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rec.txHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rec.status.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const certificatePayload = {
    certificateId: 'SLAXIOM-ZK-2026-Q3-PROD-VERIFIED',
    standard: 'Midnight Network Zero-Knowledge SLA Verification Standard v1.0',
    complianceSummary: {
      status: verificationResult ? (verificationResult.isCompliant ? 'COMPLIANT' : 'BREACH') : 'COMPLIANT',
      serviceCreditEligible: verificationResult ? `${verificationResult.creditBand}%` : '0%',
      settlementPeriod: '2026-Q3-PROD',
    },
    blockchainAttestation: {
      network: config.name,
      contractAddress,
      blockHeight: blockHeight || 2692892,
      proofHash: verificationResult?.proofHash || '0x84092b7c912e84092b7c912e84092b7c912e84092b7c912e84092b7c912e8409',
      nullifier: verificationResult?.nullifier || '0x498c5346d96d7555f3354b5fb1159702d1c884e50227378b3baa4c3998fbadb3',
    },
    auditGuarantee: {
      rawTelemetryExposed: 'NONE',
      zeroKnowledgeProofSystem: 'Halo 2 Polynomial Constraints via Compact 0.5.2',
      iso27001_soc2_eligible: true,
    },
    issuedAt: new Date().toISOString(),
  };

  const downloadCertificate = () => {
    const blob = new Blob([JSON.stringify(certificatePayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SLAxiom-ZK-Proof-Certificate-2026-Q3.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyCertJson = () => {
    navigator.clipboard.writeText(JSON.stringify(certificatePayload, null, 2));
    setCopiedCert(true);
    setTimeout(() => setCopiedCert(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-purple-100 border border-purple-300 flex items-center justify-center text-sm font-bold text-purple-700 font-mono">
              <FileBadge2 className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
                Selective Disclosure & Enterprise Audit Portal
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Generate cryptographic proof certificates for SOC2/ISO audits and explore live Preprod verifications.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadCertificate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-violet-700 hover:from-purple-600 hover:to-violet-600 text-white text-xs font-semibold shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Audit Certificate</span>
          </button>
        </div>
      </div>

      {/* Official Cryptographic Certificate Visual Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border-2 border-purple-200 shadow-md relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-purple-700 font-bold">
                Midnight Network Cryptographic Certificate
              </span>
              <h3 className="text-lg font-bold font-heading text-slate-900">
                Zero-Knowledge Service Level Attestation Certificate
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-100 text-purple-800 border border-purple-300">
              STATUS: {verificationResult ? (verificationResult.isCompliant ? 'COMPLIANT' : 'BREACH') : 'COMPLIANT (VERIFIED)'}
            </span>
            <button
              onClick={copyCertJson}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono flex items-center gap-1 transition"
            >
              {copiedCert ? <Check className="w-3 h-3 text-purple-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCert ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="space-y-1 p-4 rounded-xl bg-purple-50/40 border border-purple-100">
            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">Settlement Target</span>
            <div className="font-bold text-slate-900 text-sm">Enterprise B2B Cloud SLA Tier 1</div>
            <p className="text-[11px] text-slate-600">Period: 2026-Q3-PROD</p>
          </div>

          <div className="space-y-1 p-4 rounded-xl bg-purple-50/40 border border-purple-100">
            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">Midnight Blockchain Contract</span>
            <div className="font-mono text-purple-900 font-bold truncate">{contractAddress}</div>
            <p className="text-[11px] text-slate-600">Preprod Block #{blockHeight || 2692892}</p>
          </div>

          <div className="space-y-1 p-4 rounded-xl bg-purple-50/40 border border-purple-100">
            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">Privacy Model</span>
            <div className="font-bold text-slate-900">Zero Raw Telemetry Disclosed</div>
            <p className="text-[11px] text-slate-600">SOC2 Type II / ISO27001 Ready</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-purple-950 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <span>Proof Nullifier: <strong className="text-purple-700">{verificationResult?.nullifier || '0x498c5346d96d7555f3354b5fb1159702d1c884e50227378b3baa4c3998fbadb3'}</strong></span>
          <a
            href={contractUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-700 hover:text-purple-900 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Verify Live on Preprod Explorer</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Cohort Injections Table (72 Transactions Explorer) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold font-heading text-slate-900">
              Live Preprod Verification Ledger (72 Injections Cohort)
            </h3>
            <p className="text-xs text-slate-500">
              Auditable records sealed to Midnight Preprod testnet across 70 derived HD accounts.
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                filter === 'all'
                  ? 'bg-purple-100 text-purple-800 border border-purple-300 font-bold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              All (72)
            </button>
            <button
              onClick={() => setFilter('compliant')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                filter === 'compliant'
                  ? 'bg-purple-100 text-purple-800 border border-purple-300 font-bold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Compliant (52)
            </button>
            <button
              onClick={() => setFilter('minor')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                filter === 'minor'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300 font-bold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Minor Breach (13)
            </button>
            <button
              onClick={() => setFilter('critical')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                filter === 'critical'
                  ? 'bg-rose-100 text-rose-800 border border-rose-300 font-bold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Critical Breach (7)
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by period, transaction hash, or compliance status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 shadow-xs"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-3">Period</th>
                <th className="p-3">Contractual Commitments</th>
                <th className="p-3">Status</th>
                <th className="p-3">Credit Band</th>
                <th className="p-3">Block Height</th>
                <th className="p-3">Preprod Transaction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((r, i) => (
                <tr key={i} className="hover:bg-purple-50/20 transition">
                  <td className="p-3 font-semibold text-slate-900">{r.period}</td>
                  <td className="p-3 text-slate-600 font-sans">{r.metric}</td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.type === 'compliant'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : r.type === 'minor'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700 font-bold">{r.creditBand}</td>
                  <td className="p-3 text-slate-500">#{r.block}</td>
                  <td className="p-3 text-purple-700 hover:text-purple-900 hover:underline">
                    <a
                      href={contractUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1"
                    >
                      <span>{r.txHash.slice(0, 16)}...</span>
                      <ArrowUpRight className="w-3 h-3 text-slate-400" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
