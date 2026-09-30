import { describe, it, expect } from 'vitest';
import { extractBech32Address, getExplorerContractUrl, getExplorerTxUrl } from './lib/addressUtils';
import { NETWORK_CONFIGS } from './lib/networkConfig';
import { proveSlaCompliance, SlaPolicy, PrivateMetricsWitness } from './lib/contractApi';

describe('SLAxiom Frontend Unit Tests', () => {
  it('correctly handles address normalization without [object Object] artifacts', () => {
    // String input
    expect(extractBech32Address('mn_addr_preprod1abc')).toBe('mn_addr_preprod1abc');

    // Object with unshieldedAddress
    expect(extractBech32Address({ unshieldedAddress: 'mn_addr_preprod1xyz' })).toBe('mn_addr_preprod1xyz');

    // Object with shieldedAddress
    expect(extractBech32Address({ shieldedAddress: 'mn_addr_preprod1shield' })).toBe('mn_addr_preprod1shield');

    // Object with generic address
    expect(extractBech32Address({ address: 'mn_addr_preprod1generic' })).toBe('mn_addr_preprod1generic');

    // Empty or null
    expect(extractBech32Address(null)).toBe('');
    expect(extractBech32Address(undefined)).toBe('');
  });

  it('generates strictly PLURAL endpoints for Midnight Block Explorer URLs', () => {
    const contractAddr = 'fc67e2850565d285f2c51ece80eb4894a32961f317d91703f4cd98a9ebef088b';
    const txHash = '311e9274699c7a0f1841fed2420eb60e2c6bd2e3dfe385c0625607ea70af9347';

    // Verify Preprod contract plural URL
    const preprodContractUrl = getExplorerContractUrl('preprod', contractAddr);
    expect(preprodContractUrl).toBe(`https://preprod.midnightexplorer.com/contracts/${contractAddr}`);
    expect(preprodContractUrl).not.toContain('/contract/');

    // Verify Preprod transaction plural URL
    const preprodTxUrl = getExplorerTxUrl('preprod', txHash);
    expect(preprodTxUrl).toBe(`https://preprod.midnightexplorer.com/transactions/${txHash}`);
    expect(preprodTxUrl).not.toContain('/tx/');
  });

  it('maintains valid network endpoints for Midnight Preprod Testnet', () => {
    const preprod = NETWORK_CONFIGS.preprod;

    expect(preprod.rpcUrl).toContain('preprod.midnight.network');
    expect(preprod.indexerUrl).toContain('preprod.midnight.network/api/v4/graphql');
    expect(preprod.contractAddress).toHaveLength(64);
    expect(preprod.contractAddress).not.toMatch(/^0x/i);
    expect(preprod.contractAddress).toBe('fc67e2850565d285f2c51ece80eb4894a32961f317d91703f4cd98a9ebef088b');
  });

  it('proves SLA compliance with 0% credit band when all predicates hold', async () => {
    const policy: SlaPolicy = {
      policyName: 'Mission-Critical Cloud SLA',
      minUptimeBps: 9990,
      maxLatencyP95Ms: 250,
      maxIncidents: 3,
      periodId: '2026-Q3-PROD',
    };
    const witness: PrivateMetricsWitness = {
      actualUptimeBps: 9995,
      actualLatencyP95Ms: 182,
      actualIncidents: 1,
      metricSalt: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
    };

    const result = await proveSlaCompliance(policy, witness);
    expect(result.isCompliant).toBe(true);
    expect(result.uptimePassed).toBe(true);
    expect(result.latencyPassed).toBe(true);
    expect(result.incidentsPassed).toBe(true);
    expect(result.creditBand).toBe(0);
    expect(result.nullifier).toMatch(/^0x[a-f0-9]{64}$/);
    expect(result.policyCommitment).toMatch(/^0x[a-f0-9]{64}$/);
  });

  it('calculates 10% credit band for minor latency breach without leaking private telemetry', async () => {
    const policy: SlaPolicy = {
      policyName: 'Enterprise SLA',
      minUptimeBps: 9990,
      maxLatencyP95Ms: 250,
      maxIncidents: 2,
      periodId: '2026-Q3-PROD',
    };
    const witness: PrivateMetricsWitness = {
      actualUptimeBps: 9992,
      actualLatencyP95Ms: 310, // Latency breached
      actualIncidents: 1,
      metricSalt: 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
    };

    const result = await proveSlaCompliance(policy, witness);
    expect(result.isCompliant).toBe(false);
    expect(result.uptimePassed).toBe(true);
    expect(result.latencyPassed).toBe(false);
    expect(result.creditBand).toBe(10);
  });

  it('calculates 25% credit band for critical availability breach', async () => {
    const policy: SlaPolicy = {
      policyName: 'Enterprise SLA',
      minUptimeBps: 9990,
      maxLatencyP95Ms: 250,
      maxIncidents: 3,
      periodId: '2026-Q3-PROD',
    };
    const witness: PrivateMetricsWitness = {
      actualUptimeBps: 9850, // Critical uptime failure
      actualLatencyP95Ms: 150,
      actualIncidents: 0,
      metricSalt: 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
    };

    const result = await proveSlaCompliance(policy, witness);
    expect(result.isCompliant).toBe(false);
    expect(result.uptimePassed).toBe(false);
    expect(result.creditBand).toBe(25);
  });

  it('produces distinct nullifiers for distinct witness salts (anti-replay guarantee)', async () => {
    const policy: SlaPolicy = {
      policyName: 'Standard SLA',
      minUptimeBps: 9990,
      maxLatencyP95Ms: 250,
      maxIncidents: 3,
      periodId: '2026-Q3-PROD',
    };
    const witnessA: PrivateMetricsWitness = {
      actualUptimeBps: 9995,
      actualLatencyP95Ms: 180,
      actualIncidents: 1,
      metricSalt: '1111111111111111111111111111111111111111111111111111111111111111',
    };
    const witnessB: PrivateMetricsWitness = {
      ...witnessA,
      metricSalt: '2222222222222222222222222222222222222222222222222222222222222222',
    };

    const resA = await proveSlaCompliance(policy, witnessA);
    const resB = await proveSlaCompliance(policy, witnessB);
    expect(resA.nullifier).not.toBe(resB.nullifier);
  });

  it('correctly discovers 1AM Wallet and Lace Wallet via getDetectedWallets()', async () => {
    const { getDetectedWallets } = await import('./hooks/useWallet');

    (globalThis as any).window = (globalThis as any).window || {};
    delete (globalThis as any).window.midnight;

    expect(getDetectedWallets().has1am).toBe(false);
    expect(getDetectedWallets().hasLace).toBe(false);

    // Simulate 1AM Wallet injection
    (globalThis as any).window.midnight = {
      '1am': {
        name: '1AM Wallet',
        rdns: 'io.1am.wallet',
        apiVersion: '4.0.1',
        connect: async () => ({} as any),
      },
    };

    const detected = getDetectedWallets();
    expect(detected.has1am).toBe(true);
    expect(detected.hasLace).toBe(false);
    expect(detected.hasAny).toBe(true);
    expect(detected.detectedList[0].name).toBe('1AM Wallet');

    // Clean up
    delete (globalThis as any).window.midnight;
  });

  it('returns null and never creates mock addresses when wallet extension is missing', async () => {
    const { findWalletApi } = await import('./hooks/useWallet');
    (globalThis as any).window = (globalThis as any).window || {};
    delete (globalThis as any).window.midnight;

    const api = await findWalletApi('1am');
    expect(api).toBeNull();
  });
});
