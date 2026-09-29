import React from 'react';
import { motion } from 'motion/react';
import { Lock, Cpu, Database, ArrowRight, ShieldCheck } from 'lucide-react';
import { VaultState } from '../vault/ContractVault';

interface ZkPipelineVisualizerProps {
  currentState: VaultState;
  executionTimeMs?: number;
}

export const ZkPipelineVisualizer: React.FC<ZkPipelineVisualizerProps> = ({
  currentState,
  executionTimeMs = 380,
}) => {
  const steps = [
    {
      id: 'witness',
      num: '1',
      title: 'Local Witness Vault',
      subtitle: 'Client Browser Memory',
      desc: 'Raw uptime (99.95%), P95 latency (182ms), and salt remain offline.',
      icon: Lock,
      status: currentState === 'LOCKED' ? 'active' : 'completed',
    },
    {
      id: 'prover',
      num: '2',
      title: 'Halo 2 ZK Circuit Prover',
      subtitle: 'Compact 0.5.2 Engine',
      desc: `Off-chain evaluation: uptime >= threshold, latency <= max. (${executionTimeMs}ms)`,
      icon: Cpu,
      status: currentState === 'PROVING' ? 'active' : currentState === 'VERIFIED' ? 'completed' : 'pending',
    },
    {
      id: 'ledger',
      num: '3',
      title: 'Midnight Public Ledger',
      subtitle: 'On-Chain Verification',
      desc: 'Discloses solely boolean compliance + service credit tier + nullifier.',
      icon: Database,
      status: currentState === 'VERIFIED' ? 'active' : 'pending',
    },
  ];

  return (
    <div className="w-full rounded-2xl bg-white/95 border border-slate-200 p-6 space-y-5 shadow-lg backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-purple-100 border border-purple-300 flex items-center justify-center text-xs font-bold text-purple-700 font-mono">
            2
          </span>
          <h3 className="text-base font-bold font-heading text-slate-900">
            Zero-Knowledge Execution Pipeline
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-500">
          State:{' '}
          <strong className="text-purple-700 font-bold">{currentState}</strong>
        </span>
      </div>

      {/* 3-Step Horizontal Stepper (converts to stacked on small screens) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCurrent = step.status === 'active';
          const isDone = step.status === 'completed';

          return (
            <div
              key={step.id}
              className={`relative p-4 rounded-xl border transition-all duration-300 ${
                isCurrent
                  ? 'bg-purple-50/70 border-purple-500 ring-2 ring-purple-500/20 shadow-md'
                  : isDone
                  ? 'bg-amber-50/40 border-amber-200/80'
                  : 'bg-slate-50/50 border-slate-200 opacity-60'
              }`}
            >
              {/* Top Row: Icon + Step Number */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isCurrent
                      ? 'bg-purple-100 text-purple-700 border border-purple-300'
                      : isDone
                      ? 'bg-amber-100 text-amber-700 border border-amber-300'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">
                  STEP 0{step.num}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h4 className="text-sm font-semibold text-slate-900">{step.title}</h4>
              <p className="text-[11px] font-mono text-purple-700 font-medium mb-1">{step.subtitle}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>

              {/* Step Connection Arrow (for desktop) */}
              {idx < steps.length - 1 && (
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-slate-300 items-center justify-center text-slate-400 shadow-sm">
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
