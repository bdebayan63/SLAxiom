import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, ExternalLink, Zap, HelpCircle } from 'lucide-react';
import { WalletProviderId } from '../../hooks/useWallet';
import { NetworkId, NETWORK_CONFIGS } from '../../lib/networkConfig';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProvider: (provider: WalletProviderId) => void;
  currentNetwork: NetworkId;
  isConnecting: boolean;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  onSelectProvider,
  currentNetwork,
  isConnecting,
}) => {
  if (!isOpen) return null;

  const networkName = NETWORK_CONFIGS[currentNetwork].name;

  const providers = [
    {
      id: '1am' as WalletProviderId,
      name: '1AM Wallet',
      description: 'Native Midnight wallet with ProofStation & browser ZK proving',
      icon: '⚡',
      recommended: true,
    },
    {
      id: 'lace' as WalletProviderId,
      name: 'Lace Wallet',
      description: 'Ecosystem Web3 wallet with Midnight Preview/Preprod support',
      icon: '🛡️',
      recommended: false,
    },
    {
      id: 'injected' as WalletProviderId,
      name: 'Ecosystem Injected',
      description: 'Standard CIP-0030 / Midnight DApp Connector extension',
      icon: '🔌',
      recommended: false,
    },
    {
      id: 'explorer' as WalletProviderId,
      name: 'Read-Only Explorer Mode',
      description: 'Instant inspection of on-chain ledger state without browser extension',
      icon: '🌐',
      recommended: false,
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="relative w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl z-10 space-y-5"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-bold text-slate-900">Connect Midnight Wallet</h3>
              </div>
              <p className="text-xs text-slate-500">
                Authorizing session for <span className="text-purple-700 font-semibold">{networkName}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Zero Docker Guarantee Banner */}
          <div className="p-3 rounded-lg bg-purple-50 border border-purple-200 flex items-start gap-2.5 text-xs text-purple-900">
            <Zap className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <span>
              <strong>Zero Docker Required for Clients:</strong> In-browser zero-knowledge proofs run locally via WebAssembly and extension cryptography.
            </span>
          </div>

          {/* Provider Option List */}
          <div className="space-y-2.5">
            {providers.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  onSelectProvider(p.id);
                  onClose();
                }}
                disabled={isConnecting}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-purple-50/70 border border-slate-200 hover:border-purple-300 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{p.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 group-hover:text-purple-900">
                        {p.name}
                      </span>
                      {p.recommended && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-100 text-purple-800 border border-purple-300">
                          RECOMMENDED
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{p.description}</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition" />
              </button>
            ))}
          </div>

          {/* Footer Guide */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1 text-slate-500">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Need test tokens?</span>
            </div>
            <a
              href={NETWORK_CONFIGS[currentNetwork].faucetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-700 hover:text-purple-900 hover:underline flex items-center gap-1 font-medium"
            >
              <span>Open {currentNetwork.toUpperCase()} Faucet</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
