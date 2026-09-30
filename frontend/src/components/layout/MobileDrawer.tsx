import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Globe, Shield, ExternalLink, Smartphone, LayoutDashboard, FileCode2, Cpu, Coins, FileBadge2 } from 'lucide-react';
import { NetworkId, NETWORK_CONFIGS } from '../../lib/networkConfig';
import { useDeviceDetect } from '../../hooks/useDeviceDetect';
import { truncateAddress } from '../../lib/addressUtils';
import { AppTab } from './Navbar';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentNetwork: NetworkId;
  onNetworkChange: (net: NetworkId) => void;
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  isConnected: boolean;
  address: string | null;
  onOpenWalletModal: () => void;
  onDisconnectWallet: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  currentNetwork,
  onNetworkChange,
  activeTab,
  onSelectTab,
  isConnected,
  address,
  onOpenWalletModal,
  onDisconnectWallet,
}) => {
  const device = useDeviceDetect();

  if (!isOpen) return null;

  const navItems = [
    { id: 'dashboard' as AppTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'policy-studio' as AppTab, label: 'Policy Studio', icon: FileCode2 },
    { id: 'prover' as AppTab, label: 'ZK Prover', icon: Cpu },
    { id: 'settlement' as AppTab, label: 'Settlement', icon: Coins },
    { id: 'audit' as AppTab, label: 'Audit & Certs', icon: FileBadge2 },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 md:hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        {/* Drawer Slide-in Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="absolute right-0 top-0 bottom-0 w-80 max-w-[85%] bg-white border-l border-slate-200 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
        >
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <img src="/logo-shield.svg" alt="SLAxiom" className="w-6 h-6" />
                <span className="font-heading font-bold text-slate-900">SLAxiom Mobile</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Navigation
              </span>
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        onClose();
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-purple-50 text-purple-700 border border-purple-200 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Network Section */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
                Target Network
              </span>
              <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200 text-xs font-semibold text-purple-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                  <span>{NETWORK_CONFIGS.preprod.name}</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-100 text-purple-800 border border-purple-300">
                  LIVE
                </span>
              </div>
            </div>

            {/* Wallet Section */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
                Wallet Session
              </span>
              {isConnected && address ? (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-600" />
                    <span className="text-xs font-mono text-slate-800">
                      {truncateAddress(address, 10, 4)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onDisconnectWallet();
                      onClose();
                    }}
                    className="w-full py-1.5 rounded-md bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-medium"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onOpenWalletModal();
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-medium text-xs shadow-md transition"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>

          {/* Quick External Links */}
          <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
            <a
              href={NETWORK_CONFIGS[currentNetwork].faucetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between text-slate-500 hover:text-purple-700"
            >
              <span>{currentNetwork.toUpperCase()} Faucet</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href={NETWORK_CONFIGS[currentNetwork].explorerBaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between text-slate-500 hover:text-purple-700"
            >
              <span>Midnight Explorer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
