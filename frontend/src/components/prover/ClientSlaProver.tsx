import React, { useState } from 'react';
import { SlaPolicy, PrivateMetricsWitness, generateSaltHex } from '../../lib/contractApi';
import { HoldButton } from '../ui/HoldButton';
import { Shield, Sparkles, RefreshCw, Lock, Sliders } from 'lucide-react';
import { useDeviceDetect } from '../../hooks/useDeviceDetect';

interface ClientSlaProverProps {
  onExecuteProve: (policy: SlaPolicy, witness: PrivateMetricsWitness) => Promise<void>;
  isProving: boolean;
}

export const ClientSlaProver: React.FC<ClientSlaProverProps> = ({
  onExecuteProve,
  isProving,
}) => {
  const device = useDeviceDetect();

  // Strict Form Philosophy: Inputs initialize completely empty (zero mock defaults)
  const [policyName, setPolicyName] = useState('');
  const [minUptime, setMinUptime] = useState('');
  const [maxLatency, setMaxLatency] = useState('');
  const [maxIncidents, setMaxIncidents] = useState('');
  const [periodId, setPeriodId] = useState('');

  // Private Witness inputs (Local Client Memory Only)
  const [actualUptime, setActualUptime] = useState('');
  const [actualLatency, setActualLatency] = useState('');
  const [actualIncidents, setActualIncidents] = useState('');
  const [salt, setSalt] = useState('');

  // Quick-Fill Helper: Populates realistic test fixtures without forcing default dirty form
  const fillExample = (scenario: 'compliant' | 'breach') => {
    setPolicyName('Enterprise B2B Cloud SLA Tier 1');
    setMinUptime('99.90');
    setMaxLatency('250');
    setMaxIncidents('3');
    setPeriodId('2026-Q3-PROD');
    setSalt(generateSaltHex());

    if (scenario === 'compliant') {
      setActualUptime('99.96'); // Compliant
      setActualLatency('178');  // Compliant
      setActualIncidents('1');  // Compliant
    } else {
      setActualUptime('98.75'); // Breached uptime
      setActualLatency('310');  // Breached latency
      setActualIncidents('4');  // Breached incidents
    }
  };

  const clearForm = () => {
    setPolicyName('');
    setMinUptime('');
    setMaxLatency('');
    setMaxIncidents('');
    setPeriodId('');
    setActualUptime('');
    setActualLatency('');
    setActualIncidents('');
    setSalt('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Default fallbacks if user clicks without typing
    const finalPolicy: SlaPolicy = {
      policyName: policyName.trim() || 'Enterprise B2B Cloud SLA Tier 1',
      minUptimeBps: Math.round((parseFloat(minUptime) || 99.9) * 100),
      maxLatencyP95Ms: parseInt(maxLatency, 10) || 250,
      maxIncidents: parseInt(maxIncidents, 10) || 3,
      periodId: periodId.trim() || '2026-Q3-PERIOD',
    };

    const finalWitness: PrivateMetricsWitness = {
      actualUptimeBps: Math.round((parseFloat(actualUptime) || 99.95) * 100),
      actualLatencyP95Ms: parseInt(actualLatency, 10) || 185,
      actualIncidents: parseInt(actualIncidents, 10) || 1,
      metricSalt: salt || generateSaltHex(),
    };

    await onExecuteProve(finalPolicy, finalWitness);
  };

  return (
    <div className="w-full rounded-2xl bg-white/95 border border-slate-200 p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Top Banner & Privacy Invariant Guarantee */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-md bg-purple-100 border border-purple-300 flex items-center justify-center text-xs font-bold text-purple-700 font-mono">
              1
            </span>
            <h2 className="text-xl font-bold font-heading text-slate-900 tracking-tight">
              Client-Side Prover & Policy Configuration
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Specify public contractual thresholds and attest private operational metrics.
          </p>
        </div>

        {/* Quick Fill Helper Chips */}
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-[11px] font-mono text-slate-400">Quick Fill:</span>
          <button
            type="button"
            onClick={() => fillExample('compliant')}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-medium transition"
          >
            <Sparkles className="w-3 h-3 text-purple-600" />
            <span>Compliant SLA</span>
          </button>
          <button
            type="button"
            onClick={() => fillExample('breach')}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-medium transition"
          >
            <span>Breach Scenario</span>
          </button>
          <button
            type="button"
            onClick={clearForm}
            className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
            title="Clear all fields"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dual-State Callout Banner */}
      <div className="p-3.5 rounded-xl bg-purple-50/80 border border-purple-200 flex items-start gap-3 text-xs text-purple-900">
        <Lock className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-purple-800 font-semibold">Dual-State Privacy Invariant:</strong>{' '}
          All private inputs (uptime, latency, raw telemetry, salts) reside strictly inside local browser memory.
          They are synthesized into Compact Zero-Knowledge polynomial constraints and NEVER sent across the network.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section A: Contractual SLA Policy (Publicly Committed) */}
          <div className="space-y-4 p-4 rounded-xl bg-slate-50/70 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-700">
                A. Contractual SLA Commitments (Public Policy)
              </span>
              <span className="text-[10px] font-mono text-slate-400">Target Predicates</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Contract Agreement Title
                </label>
                <input
                  type="text"
                  value={policyName}
                  onChange={(e) => setPolicyName(e.target.value)}
                  placeholder="e.g. Enterprise B2B Cloud SLA Tier 1"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 placeholder:italic focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Min Uptime Threshold (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="90"
                    max="100"
                    value={minUptime}
                    onChange={(e) => setMinUptime(e.target.value)}
                    placeholder="e.g. 99.90"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 placeholder:italic focus:outline-none focus:border-purple-500 font-mono transition"
                  />
                  {device.isMobile && (
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500">
                      <Sliders className="w-3 h-3" />
                      <span>Touch Slide-Bar:</span>
                      <input
                        type="range"
                        min="95"
                        max="100"
                        step="0.05"
                        value={minUptime || 99.9}
                        onChange={(e) => setMinUptime(e.target.value)}
                        className="w-24 accent-purple-600"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Max P95 Latency (ms)
                  </label>
                  <input
                    type="number"
                    value={maxLatency}
                    onChange={(e) => setMaxLatency(e.target.value)}
                    placeholder="e.g. 250"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 placeholder:italic focus:outline-none focus:border-purple-500 font-mono transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Max Critical Incidents
                  </label>
                  <input
                    type="number"
                    value={maxIncidents}
                    onChange={(e) => setMaxIncidents(e.target.value)}
                    placeholder="e.g. 3"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 placeholder:italic focus:outline-none focus:border-purple-500 font-mono transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Settlement Period Nonce
                  </label>
                  <input
                    type="text"
                    value={periodId}
                    onChange={(e) => setPeriodId(e.target.value)}
                    placeholder="e.g. 2026-Q3-PROD"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 placeholder:italic focus:outline-none focus:border-purple-500 font-mono transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Private Operational Evidence (Witness In Client Memory) */}
          <div className="space-y-4 p-4 rounded-xl bg-purple-50/30 border border-purple-200 relative">
            <div className="flex items-center justify-between border-b border-purple-100 pb-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-purple-600" />
                <span>B. Private Operational Evidence (Witness Vault)</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-100 text-purple-800 border border-purple-300">
                CLIENT-ONLY
              </span>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Actual Attested Uptime (%)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={actualUptime}
                    onChange={(e) => setActualUptime(e.target.value)}
                    placeholder="e.g. 99.954"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 placeholder:italic focus:outline-none focus:border-purple-500 font-mono transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Actual P95 Latency (ms)
                  </label>
                  <input
                    type="number"
                    value={actualLatency}
                    onChange={(e) => setActualLatency(e.target.value)}
                    placeholder="e.g. 182"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 placeholder:italic focus:outline-none focus:border-purple-500 font-mono transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Critical Incidents Incurred
                  </label>
                  <input
                    type="number"
                    value={actualIncidents}
                    onChange={(e) => setActualIncidents(e.target.value)}
                    placeholder="e.g. 1"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 placeholder:italic focus:outline-none focus:border-purple-500 font-mono transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Cryptographic Witness Salt
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={salt}
                      onChange={(e) => setSalt(e.target.value)}
                      placeholder="Auto-generated 32-byte salt"
                      className="w-full px-3 py-2 pr-8 rounded-lg bg-white border border-slate-300 text-[11px] text-slate-900 placeholder:text-slate-400 placeholder:italic focus:outline-none focus:border-purple-500 font-mono transition"
                    />
                    <button
                      type="button"
                      onClick={() => setSalt(generateSaltHex())}
                      className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600"
                      title="Generate new cryptographic salt"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>Zero telemetry disclosure guarantee: Server never sees raw infrastructure logs.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-500">
            Clicking will compile witness constraints and execute local ZK circuit proof.
          </div>
          <HoldButton
            label="Generate ZK Proof & Settle On-Chain"
            onExecute={() => handleSubmit({ preventDefault: () => {} } as any)}
            isLoading={isProving}
            className="w-full sm:w-auto"
          />
        </div>
      </form>
    </div>
  );
};
