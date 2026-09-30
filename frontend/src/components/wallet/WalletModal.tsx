import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, ExternalLink, Zap, HelpCircle, AlertCircle, CheckCircle2, Download } from 'lucide-react';
import { WalletProviderId, DetectedWallets } from '../../hooks/useWallet';
import { NetworkId, NETWORK_CONFIGS } from '../../lib/networkConfig';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProvider: (provider: WalletProviderId) => void;
  currentNetwork: NetworkId;
  isConnecting: boolean;
  detected?: DetectedWallets;
  error?: string | null;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  onSelectProvider,
  currentNetwork,
  isConnecting,
  detected,
  error,
}) => {
  if (!isOpen) return null;

  const networkName = NETWORK_CONFIGS[currentNetwork].name;
  const has1am = detected?.has1am ?? false;
  const hasLace = detected?.hasLace ?? false;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="relative w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl z-10 space-y-5 text-slate-900 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-bold text-slate-900">Connect Midnight Wallet</h3>
              </div>
              <p className="text-xs text-slate-500">
                Initiating connection for <span className="text-purple-700 font-semibold">{networkName}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-start gap-2.5 shadow-xs"
            >
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-amber-900">Wallet Connection Notice</p>
                <p className="leading-relaxed text-amber-800">{error}</p>
                {error.includes('install') && (
                  <a
                    href="https://1am.xyz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-1 text-purple-700 hover:text-purple-900 font-bold underline"
                  >
                    <span>Download 1AM Wallet Extension</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </motion.div>
          )}

          {/* Zero Docker Guarantee Banner */}
          <div className="p-3 rounded-xl bg-purple-50/80 border border-purple-200 flex items-start gap-2.5 text-xs text-purple-950">
            <Zap className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <span>
              <strong>Zero Docker Required for Clients:</strong> In-browser zero-knowledge proofs run locally via WebAssembly and extension cryptography.
            </span>
          </div>

          {/* Primary Ecosystem Wallets */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Installed Browser Extensions
            </div>

            {/* 1AM Wallet */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-300 transition-all space-y-2 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-purple-900">
                        1AM Wallet
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-100 text-purple-800 border border-purple-300">
                        RECOMMENDED
                      </span>
                      {has1am ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-purple-700 font-medium">
                          <CheckCircle2 className="w-3 h-3 text-purple-600" />
                          <span>Detected</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Not detected</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Native Midnight wallet with ProofStation & browser ZK proving.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onSelectProvider('1am')}
                  disabled={isConnecting}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-60"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>{isConnecting ? 'Connecting & Requesting Approval...' : 'Connect 1AM Wallet'}</span>
                </button>
                {!has1am && (
                  <a
                    href="https://1am.xyz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-2.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium transition flex items-center gap-1"
                    title="Install 1AM Wallet Extension"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Install</span>
                  </a>
                )}
              </div>
            </div>

            {/* Lace Wallet */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-300 transition-all space-y-2 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🛡️</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-purple-900">
                        Lace Wallet
                      </span>
                      {hasLace ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-purple-700 font-medium">
                          <CheckCircle2 className="w-3 h-3 text-purple-600" />
                          <span>Detected</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Not detected</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Ecosystem Web3 wallet with Midnight Preprod testnet support.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onSelectProvider('lace')}
                  disabled={isConnecting}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-60"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Connect Lace Wallet</span>
                </button>
              </div>
            </div>

            {/* Read-Only Explorer Mode */}
            <div className="pt-2">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                Evaluation Without Extension
              </div>
              <button
                type="button"
                onClick={() => {
                  onSelectProvider('explorer');
                  onClose();
                }}
                disabled={isConnecting}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white hover:bg-purple-50/50 border border-slate-200 hover:border-purple-300 transition text-left group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌐</span>
                  <div>
                    <span className="text-sm font-semibold text-slate-900 group-hover:text-purple-900">
                      Read-Only Explorer Mode
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Instant read-only inspection of live on-chain contract state and ZK proofs.
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition" />
              </button>
            </div>
          </div>

          {/* Footer Guide */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1 text-slate-500">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Need testnet tokens?</span>
            </div>
            <a
              href={NETWORK_CONFIGS[currentNetwork].faucetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-700 hover:text-purple-900 hover:underline flex items-center gap-1 font-medium"
            >
              <span>{currentNetwork.toUpperCase()} Faucet</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
