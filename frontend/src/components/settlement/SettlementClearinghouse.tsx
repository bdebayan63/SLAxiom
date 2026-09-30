import React, { useState } from 'react';
import { ZkProofVerificationResult } from '../../lib/contractApi';
import { Coins, ShieldCheck, AlertTriangle, ArrowRight, CheckCircle2, Clock, DollarSign, Wallet, FileText } from 'lucide-react';
import { ShinyText } from '../animations/ShinyText';
import { SpotlightCard } from '../ui/SpotlightCard';

interface SettlementClearinghouseProps {
  verificationResult: ZkProofVerificationResult | null;
  contractAddress: string;
}

export const SettlementClearinghouse: React.FC<SettlementClearinghouseProps> = ({
  verificationResult,
  contractAddress,
}) => {
  const [retainerAmount, setRetainerAmount] = useState('50000');
  const [isSettled, setIsSettled] = useState(false);
  const [settling, setSettling] = useState(false);

  const baseRetainer = parseFloat(retainerAmount) || 50000;
  const creditBandPercent = verificationResult ? verificationResult.creditBand : 0;
  const creditDeduction = (baseRetainer * creditBandPercent) / 100;
  const netDisbursement = baseRetainer - creditDeduction;

  const handleSettle = async () => {
    setSettling(true);
    await new Promise((r) => setTimeout(r, 900));
    setIsSettled(true);
    setSettling(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-sm font-bold text-amber-700 font-mono">
              <Coins className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
                Automated Settlement Clearinghouse & Service Credits
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Reconcile B2B invoice payouts and automated penalty deductions driven by on-chain ZK verification.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">
            Escrow Status: {isSettled ? 'DISBURSED' : 'LOCKED IN CLEARING'}
          </span>
        </div>
      </div>

      {/* Grid: Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SpotlightCard className="p-5 flex flex-col justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
            Monthly Contract Escrow
          </span>
          <div className="my-2">
            <span className="text-3xl font-bold font-tabular text-slate-900">
              ${baseRetainer.toLocaleString()}
            </span>
            <p className="text-xs text-slate-500 mt-1">Locked in smart contract escrow</p>
          </div>
          <div className="pt-2 border-t border-slate-200 text-[11px] font-mono text-slate-400">
            Period: 2026-Q3-PROD
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-5 flex flex-col justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
            Enforced Credit Band
          </span>
          <div className="my-2">
            <span className="text-3xl font-bold font-tabular text-amber-700">
              {creditBandPercent}%
            </span>
            <p className="text-xs text-slate-500 mt-1">
              {creditBandPercent === 0 ? 'Full compliance rebate waiver' : 'Automated SLA breach penalty'}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-200 text-[11px] font-mono text-slate-400">
            Verdict: {verificationResult ? (verificationResult.isCompliant ? 'COMPLIANT' : 'BREACH') : 'STANDBY'}
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-5 flex flex-col justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
            Client Credit Rebate
          </span>
          <div className="my-2">
            <span className="text-3xl font-bold font-tabular text-rose-700">
              -${creditDeduction.toLocaleString()}
            </span>
            <p className="text-xs text-slate-500 mt-1">Refunded to client treasury</p>
          </div>
          <div className="pt-2 border-t border-slate-200 text-[11px] font-mono text-slate-400">
            Adjustment: Immediate credit memo
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-5 flex flex-col justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
            Net Provider Payout
          </span>
          <div className="my-2">
            <span className="text-3xl font-bold font-tabular text-purple-700">
              ${netDisbursement.toLocaleString()}
            </span>
            <p className="text-xs text-slate-500 mt-1">Disbursed upon settlement signoff</p>
          </div>
          <div className="pt-2 border-t border-slate-200 text-[11px] font-mono text-slate-400">
            Target DID: did:midnight:provider_01
          </div>
        </SpotlightCard>
      </div>

      {/* Main Clearinghouse Workflow Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Invoice Simulator (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-purple-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" />
              <span>Contract Service Fee Adjustment Simulator</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Invoice #SLA-2026-09</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Contract Base Retainer Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-xs">$</span>
                <input
                  type="number"
                  value={retainerAmount}
                  onChange={(e) => setRetainerAmount(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:border-purple-500 font-bold"
                />
              </div>
            </div>

            {/* Itemized Invoice Ledger Table */}
            <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
              <table className="w-full text-left font-mono">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-3">Item Description</th>
                    <th className="p-3 text-right">Calculation</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  <tr>
                    <td className="p-3 font-medium text-slate-800">Base B2B SaaS Service Retainer</td>
                    <td className="p-3 text-right text-slate-500">100.0%</td>
                    <td className="p-3 text-right font-bold text-slate-800">${baseRetainer.toLocaleString()}</td>
                  </tr>
                  <tr className={creditBandPercent > 0 ? 'bg-rose-50/50' : ''}>
                    <td className="p-3 font-medium text-slate-800">
                      Zero-Knowledge SLA Penalty Credit (Band {creditBandPercent === 0 ? '0' : creditBandPercent === 10 ? '1' : '2'})
                    </td>
                    <td className="p-3 text-right text-rose-600 font-semibold">-{creditBandPercent}%</td>
                    <td className="p-3 text-right font-bold text-rose-700">-${creditDeduction.toLocaleString()}</td>
                  </tr>
                  <tr className="bg-purple-50/40 font-bold">
                    <td className="p-3 text-purple-900">Net Final Settlement Disbursement</td>
                    <td className="p-3 text-right text-purple-700">Net</td>
                    <td className="p-3 text-right text-purple-900 text-sm">${netDisbursement.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500">
                Settlement mathematically locked to Midnight on-chain proof hash.
              </div>
              <button
                type="button"
                onClick={handleSettle}
                disabled={isSettled || settling}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-2 ${
                  isSettled
                    ? 'bg-purple-100 text-purple-800 border border-purple-300 cursor-default'
                    : 'bg-gradient-to-r from-purple-700 to-violet-700 hover:from-purple-600 hover:to-violet-600 text-white'
                }`}
              >
                {isSettled ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    <span>Settlement Finalized On-Chain</span>
                  </>
                ) : settling ? (
                  <span>Reconciling Clearinghouse...</span>
                ) : (
                  <>
                    <Coins className="w-4 h-4 text-purple-200" />
                    <span>Execute Financial Clearing</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Settlement Lifecycle Pipeline (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-50/70 border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-purple-700 flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <span>Settlement Lifecycle Timeline</span>
          </h3>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold font-mono">
                  ✓
                </div>
                <div className="w-0.5 h-10 bg-purple-200" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900">1. Private Metric Attestation</div>
                <p className="text-[11px] text-slate-500">Client and provider attest signed telemetry in local memory.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold font-mono">
                  ✓
                </div>
                <div className="w-0.5 h-10 bg-purple-200" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900">2. Compact Circuit Proof Evaluation</div>
                <p className="text-[11px] text-slate-500">Zero-knowledge proof synthesized with Halo 2 constraints.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold font-mono">
                  ✓
                </div>
                <div className="w-0.5 h-10 bg-purple-200" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900">3. On-Chain Ledger Commitment</div>
                <p className="text-[11px] text-slate-500">Disclosed boolean compliance and credit tier sealed to block.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                  isSettled ? 'bg-purple-600 text-white' : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {isSettled ? '✓' : '4'}
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900">4. Escrow Disbursement</div>
                <p className="text-[11px] text-slate-500">Automated rebate to client and net disbursement to provider.</p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-[11px] text-purple-900 space-y-1">
            <strong>Arbitration Guarantee:</strong> If either party contests the calculation, the immutable on-chain proof hash serves as definitive cryptographic evidence.
          </div>
        </div>
      </div>
    </div>
  );
};
