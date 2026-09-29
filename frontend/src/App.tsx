import React, { useState } from 'react';
import { AuroraBackground } from './components/backgrounds/AuroraBackground';
import { Navbar, AppTab } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileDrawer } from './components/layout/MobileDrawer';
import { WalletModal } from './components/wallet/WalletModal';
import { ContractVault, VaultState } from './components/vault/ContractVault';
import { ClientSlaProver } from './components/prover/ClientSlaProver';
import { ZkPipelineVisualizer } from './components/pipeline/ZkPipelineVisualizer';
import { PublicLedgerAudit } from './components/verifier/PublicLedgerAudit';
import { PolicyStudio } from './components/policy/PolicyStudio';
import { SettlementClearinghouse } from './components/settlement/SettlementClearinghouse';
import { CertificatePortal } from './components/audit/CertificatePortal';
import { SlaScoreRing } from './components/ui/SlaScoreRing';
import { ErrorBudgetBar } from './components/ui/ErrorBudgetBar';
import { SplitText } from './components/animations/SplitText';
import { CountUp } from './components/animations/CountUp';
import { SpotlightCard } from './components/ui/SpotlightCard';
import { useWallet } from './hooks/useWallet';
import { useLiveChainStatus } from './hooks/useLiveChainStatus';
import { NetworkId, NETWORK_CONFIGS } from './lib/networkConfig';
import { SlaPolicy, PrivateMetricsWitness, ZkProofVerificationResult, proveSlaCompliance } from './lib/contractApi';
import { Shield, Lock, Cpu, Sparkles, FileCode2, Coins, FileBadge2, ArrowRight } from 'lucide-react';

export const App: React.FC = () => {
  const [network, setNetwork] = useState<NetworkId>('preprod');
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Vault state machine: 'LOCKED' | 'MEASURING' | 'PROVING' | 'VERIFIED'
  const [vaultState, setVaultState] = useState<VaultState>('LOCKED');
  const [lastVerificationResult, setLastVerificationResult] = useState<ZkProofVerificationResult | null>(null);
  const [isProving, setIsProving] = useState(false);

  // Active Policy Configuration
  const [currentPolicy, setCurrentPolicy] = useState<SlaPolicy>({
    policyName: 'Enterprise B2B Cloud SLA Tier 1',
    minUptimeBps: 9990,
    maxLatencyP95Ms: 250,
    maxIncidents: 3,
    periodId: '2026-Q3-PROD',
  });

  // Wallet & live blockchain telemetry
  const wallet = useWallet(network);
  const chainStatus = useLiveChainStatus(network);

  const handleNetworkChange = (newNetwork: NetworkId) => {
    if (newNetwork === network) return;
    wallet.disconnect();
    setNetwork(newNetwork);
  };

  const handleExecuteProof = async (policy: SlaPolicy, witness: PrivateMetricsWitness) => {
    setIsProving(true);
    setVaultState('MEASURING');
    setCurrentPolicy(policy);

    try {
      // Step 1: Measuring predicates
      await new Promise((r) => setTimeout(r, 600));
      setVaultState('PROVING');

      // Step 2: Off-chain ZK-SNARK circuit proving
      const result = await proveSlaCompliance(policy, witness);

      // Step 3: Settled on-chain
      await new Promise((r) => setTimeout(r, 800));
      setLastVerificationResult(result);
      setVaultState('VERIFIED');
    } finally {
      setIsProving(false);
    }
  };

  const handleCommitPolicyOnChain = async (policyHash: string) => {
    // Simulated Compact circuit invocation: updatePolicy(newPolicyHash)
    await new Promise((r) => setTimeout(r, 900));
  };

  return (
    <AuroraBackground>
      {/* Primary Navigation */}
      <Navbar
        currentNetwork={network}
        onNetworkChange={handleNetworkChange}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isConnected={wallet.isConnected}
        isConnecting={wallet.isConnecting}
        address={wallet.address}
        onOpenWalletModal={() => setWalletModalOpen(true)}
        onDisconnectWallet={wallet.disconnect}
        onToggleMobileDrawer={() => setMobileDrawerOpen(true)}
      />

      {/* Main Container: Fluid widescreen layout (up to 1440px) */}
      <main className="max-w-[1440px] w-[95%] mx-auto px-4 py-8 space-y-12">
        {/* ========================================================================= */}
        {/* VIEW 1: EXECUTIVE DASHBOARD & OVERVIEW                                    */}
        {/* ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* HERO SECTION */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
              {/* Left Hero Column: Value Proposition & SplitText */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50/90 border border-purple-200 text-xs font-mono text-purple-900 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                  <span>Midnight Network Privacy Layer</span>
                  <span className="text-purple-300">•</span>
                  <span className="text-purple-700 font-bold">Halo 2 ZK-SNARKs</span>
                </div>

                <div className="space-y-3">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-slate-900 tracking-tight leading-[1.15]">
                    <SplitText text="Confidential Contract" className="text-slate-900" />
                    <br />
                    <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-600 bg-clip-text text-transparent">
                      Performance & SLA
                    </span>
                    <br />
                    <SplitText text="Verification" className="text-slate-900" delay={0.04} />
                  </h1>

                  <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                    Prove enterprise uptime (e.g. 99.9%), maximum latency thresholds, and incident counts to clients{' '}
                    <strong className="text-slate-900 font-semibold">without disclosing underlying operational telemetry, server logs, or infrastructure secrets</strong>.
                  </p>
                </div>

                {/* Quick Hero Feature Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-white/80 border border-slate-200/90 shadow-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                      <Lock className="w-3.5 h-3.5 text-purple-600" />
                      <span>Dual-State Privacy</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Private witness stays in browser memory. Only boolean result is published.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/80 border border-slate-200/90 shadow-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                      <Cpu className="w-3.5 h-3.5 text-purple-600" />
                      <span>Compact 0.5.2</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      ZK circuit compiled directly into provable Halo 2 polynomial constraints.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/80 border border-slate-200/90 shadow-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Auto Service Credits</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Automatic tier-based financial credit evaluation upon verified SLA breach.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Hero Column: 3D Contract Vault Centerpiece */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <ContractVault state={vaultState} className="w-full" />
              </div>
            </section>

            {/* METRICS & OVERVIEW CARDS */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <SpotlightCard className="p-5 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
                  Contract Target Attainment
                </span>
                <SlaScoreRing attainment={99.994} target={99.90} size={150} />
              </SpotlightCard>

              <SpotlightCard className="p-5 flex flex-col justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
                  Reliability Margin
                </span>
                <div className="my-3">
                  <span className="text-3xl font-bold font-tabular text-slate-900">
                    <CountUp to={74.8} decimals={1} suffix="%" />
                  </span>
                  <p className="text-xs text-slate-500 mt-1">Error budget remaining this cycle</p>
                </div>
                <ErrorBudgetBar remainingPercent={74.8} allowedMinutesLeft={108} burnRate={0.82} />
              </SpotlightCard>

              <SpotlightCard className="p-5 flex flex-col justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
                  P95 Latency Commitment
                </span>
                <div className="my-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold font-tabular text-purple-700">
                      <CountUp to={182} decimals={0} />
                    </span>
                    <span className="text-slate-500 text-xs font-mono">ms (Target &lt; 250ms)</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Compliant across 12 distributed regions</p>
                </div>
                <div className="pt-2 border-t border-slate-200 text-[11px] font-mono text-slate-400 flex justify-between">
                  <span>Sample Size:</span>
                  <span className="text-slate-700 font-semibold">2,410,920 req</span>
                </div>
              </SpotlightCard>

              <SpotlightCard className="p-5 flex flex-col justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
                  Midnight Indexer Telemetry
                </span>
                <div className="my-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-ping" />
                    <span className="text-2xl font-bold font-mono text-slate-900">
                      #{chainStatus.blockHeight ?? 2451928}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Synchronized to tip on {NETWORK_CONFIGS[network].name}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200 text-[11px] font-mono text-slate-400 flex justify-between">
                  <span>Heartbeat:</span>
                  <span className="text-slate-700 font-semibold">{chainStatus.lastUpdated || 'Live'}</span>
                </div>
              </SpotlightCard>
            </section>

            {/* HERO VISUAL BANNER */}
            <section className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl">
              <img
                src="/images/slaxiom_hero_vault.jpg"
                alt="SLAxiom Cryptographic Vault"
                className="w-full h-48 sm:h-64 object-cover object-center brightness-95 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent p-6 sm:p-8 flex flex-col justify-end">
                <div className="max-w-2xl space-y-1">
                  <span className="text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold">
                    Autonomous Zero-Knowledge Verification
                  </span>
                  <h2 className="text-lg sm:text-2xl font-bold font-heading text-white">
                    Tamper-Proof Service Commitments for Modern Enterprise B2B
                  </h2>
                  <p className="text-xs text-slate-200 hidden sm:block">
                    SLAxiom bridges the gap between commercial service contracts and machine-verifiable mathematical proofs on Midnight Network.
                  </p>
                </div>
              </div>
            </section>

            {/* Quick Navigation Cards to Services */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button
                onClick={() => setActiveTab('policy-studio')}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 shadow-xs hover:shadow-md transition text-left group space-y-2"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  <FileCode2 className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 flex items-center justify-between">
                  <span>Policy Studio</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition" />
                </h4>
                <p className="text-[11px] text-slate-500">
                  Build and lock SLA policies, configure credit curves, and compute SHA-256 commitments.
                </p>
              </button>

              <button
                onClick={() => setActiveTab('prover')}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 shadow-xs hover:shadow-md transition text-left group space-y-2"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  <Cpu className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 flex items-center justify-between">
                  <span>ZK Prover</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition" />
                </h4>
                <p className="text-[11px] text-slate-500">
                  Synthesize zero-knowledge proofs in local browser memory with Compact circuits.
                </p>
              </button>

              <button
                onClick={() => setActiveTab('settlement')}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 shadow-xs hover:shadow-md transition text-left group space-y-2"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <Coins className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 flex items-center justify-between">
                  <span>Settlement</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition" />
                </h4>
                <p className="text-[11px] text-slate-500">
                  Reconcile automated credit deductions, escrow disbursement, and milestone payouts.
                </p>
              </button>

              <button
                onClick={() => setActiveTab('audit')}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 shadow-xs hover:shadow-md transition text-left group space-y-2"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  <FileBadge2 className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 flex items-center justify-between">
                  <span>Audit & Certs</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition" />
                </h4>
                <p className="text-[11px] text-slate-500">
                  Export verifiable ZK certificates and audit the 72 live Preprod transactions.
                </p>
              </button>
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: CONFIDENTIAL POLICY STUDIO & CONTRACT BUILDER                     */}
        {/* ========================================================================= */}
        {activeTab === 'policy-studio' && (
          <div className="animate-in fade-in duration-300">
            <PolicyStudio
              currentPolicy={currentPolicy}
              onUpdatePolicy={setCurrentPolicy}
              onCommitPolicyOnChain={handleCommitPolicyOnChain}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: CLIENT-SIDE ZK PROVER & PIPELINE                                  */}
        {/* ========================================================================= */}
        {activeTab === 'prover' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <ClientSlaProver
              onExecuteProve={handleExecuteProof}
              isProving={isProving}
            />
            <ZkPipelineVisualizer
              currentState={vaultState}
              executionTimeMs={lastVerificationResult?.executionTimeMs}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: AUTOMATED FINANCIAL SETTLEMENT & CLEARINGHOUSE                    */}
        {/* ========================================================================= */}
        {activeTab === 'settlement' && (
          <div className="animate-in fade-in duration-300">
            <SettlementClearinghouse
              verificationResult={lastVerificationResult}
              contractAddress={NETWORK_CONFIGS[network].contractAddress}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 5: SELECTIVE DISCLOSURE & AUDIT CERTIFICATE PORTAL                   */}
        {/* ========================================================================= */}
        {activeTab === 'audit' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            <PublicLedgerAudit
              currentNetwork={network}
              verificationResult={lastVerificationResult}
              blockHeight={chainStatus.blockHeight}
            />
            <CertificatePortal
              currentNetwork={network}
              verificationResult={lastVerificationResult}
              blockHeight={chainStatus.blockHeight}
            />
          </div>
        )}
      </main>

      {/* Global Modals & Drawers */}
      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        onSelectProvider={wallet.connect}
        currentNetwork={network}
        isConnecting={wallet.isConnecting}
      />

      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        currentNetwork={network}
        onNetworkChange={handleNetworkChange}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isConnected={wallet.isConnected}
        address={wallet.address}
        onOpenWalletModal={() => {
          setMobileDrawerOpen(false);
          setWalletModalOpen(true);
        }}
        onDisconnectWallet={wallet.disconnect}
      />

      {/* Footer */}
      <Footer currentNetwork={network} />
    </AuroraBackground>
  );
};
