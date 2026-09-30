import React, { useState } from 'react';
import { NetworkId, NETWORK_CONFIGS } from '../../lib/networkConfig';
import { truncateAddress, getExplorerContractUrl } from '../../lib/addressUtils';
import { Shield, Globe, ChevronDown, ExternalLink, LogOut, Check, LayoutDashboard, FileCode2, Cpu, Coins, FileBadge2, Copy, CheckCheck } from 'lucide-react';
import { WalletProviderId } from '../../hooks/useWallet';

export type AppTab = 'dashboard' | 'policy-studio' | 'prover' | 'settlement' | 'audit';

interface NavbarProps {
  currentNetwork: NetworkId;
  onNetworkChange: (net: NetworkId) => void;
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  provider?: WalletProviderId | null;
  dustBalance?: { balance: bigint; cap: bigint } | null;
  onOpenWalletModal: () => void;
  onDisconnectWallet: () => void;
  onToggleMobileDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentNetwork,
  onNetworkChange,
  activeTab,
  onSelectTab,
  isConnected,
  isConnecting,
  address,
  provider,
  dustBalance,
  onOpenWalletModal,
  onDisconnectWallet,
  onToggleMobileDrawer,
}) => {
  const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const config = NETWORK_CONFIGS[currentNetwork];
  const contractExplorerUrl = getExplorerContractUrl(currentNetwork, config.contractAddress);

  const navItems = [
    { id: 'dashboard' as AppTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'policy-studio' as AppTab, label: 'Policy Studio', icon: FileCode2 },
    { id: 'prover' as AppTab, label: 'ZK Prover', icon: Cpu },
    { id: 'settlement' as AppTab, label: 'Settlement', icon: Coins },
    { id: 'audit' as AppTab, label: 'Audit & Certs', icon: FileBadge2 },
  ];

  const handleCopyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const providerLabel =
    provider === '1am'
      ? '⚡ 1AM'
      : provider === 'lace'
      ? '🛡️ Lace'
      : provider === 'explorer'
      ? '🌐 Explorer'
      : 'Midnight';

  const formattedDust = dustBalance
    ? `${(Number(dustBalance.balance) / 1_000_000).toFixed(2)} tDUST`
    : null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="max-w-[1440px] w-[95%] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-4 shrink-0">
          <button onClick={() => onSelectTab('dashboard')} className="flex items-center gap-2.5 group text-left">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 p-1.5 flex items-center justify-center group-hover:border-purple-400 transition">
              <img src="/logo-shield.svg" alt="SLAxiom" className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-lg text-slate-900 tracking-tight">
                  SLA<span className="text-purple-600">xiom</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-100 text-purple-800 border border-purple-200 hidden sm:inline">
                  ZK-SLA
                </span>
              </div>
              <p className="text-[10px] text-slate-500 tracking-wider uppercase font-mono hidden xl:block">
                Confidential Performance Verification
              </p>
            </div>
          </button>
        </div>

        {/* Center Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200 shadow-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-white text-purple-700 shadow-xs border border-purple-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Network Indicator / Switcher */}
          <div className="relative">
            <button
              onClick={() => setNetworkDropdownOpen(!networkDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-xs font-semibold text-slate-700 transition"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600" />
              </span>
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{config.badgeLabel}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Network Dropdown Menu */}
            {networkDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-slate-200 py-1 shadow-xl z-50">
                <div className="px-3 py-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Target Network
                </div>
                {(['preprod'] as NetworkId[]).map((netId) => {
                  return (
                    <button
                      key={netId}
                      onClick={() => {
                        onNetworkChange(netId);
                        setNetworkDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-slate-50 text-slate-800 transition"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                        <span>{NETWORK_CONFIGS[netId].name}</span>
                      </div>
                      <Check className="w-3.5 h-3.5 text-purple-600" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Primary Wallet Action Button */}
          {isConnected && address ? (
            <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-lg p-1">
              <span className="px-2 py-0.5 text-[11px] font-bold bg-white rounded border border-slate-200 text-purple-900 shadow-2xs">
                {providerLabel}
              </span>
              {formattedDust && (
                <span className="px-1.5 py-0.5 text-[11px] font-mono text-amber-700 hidden lg:inline font-semibold">
                  {formattedDust}
                </span>
              )}
              <button
                type="button"
                onClick={handleCopyAddress}
                className="px-2 py-0.5 text-xs font-mono font-medium text-slate-800 hover:text-purple-700 transition flex items-center gap-1"
                title="Click to copy address"
              >
                <span>{truncateAddress(address, 10, 4)}</span>
                {copied ? <CheckCheck className="w-3 h-3 text-purple-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
              </button>
              <button
                onClick={onDisconnectWallet}
                className="p-1 rounded-md hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition"
                title="Disconnect Wallet"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenWalletModal}
              disabled={isConnecting}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-700 to-violet-700 hover:from-purple-600 hover:to-violet-600 text-white font-semibold text-xs shadow-sm transition active:scale-95 disabled:opacity-60"
            >
              <Shield className="w-3.5 h-3.5 text-purple-200" />
              <span>{isConnecting ? 'Requesting Approval...' : 'Connect Wallet'}</span>
            </button>
          )}

          {/* Mobile Drawer Toggle */}
          <button
            onClick={onToggleMobileDrawer}
            className="md:hidden p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900"
          >
            <Shield className="w-4 h-4 text-purple-600" />
          </button>
        </div>
      </div>
    </header>
  );
};
