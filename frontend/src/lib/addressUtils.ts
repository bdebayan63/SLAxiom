import { NETWORK_CONFIGS, NetworkId } from './networkConfig';

// ==============================================================================
// SLAxiom — Address & Explorer URL Utilities
// ==============================================================================

/**
 * Defensive address extractor preventing [object Object] bugs.
 * Handles string addresses, object payloads ({ address, unshieldedAddress }), and undefined.
 */
export function extractBech32Address(raw: unknown): string {
  if (!raw) return '';
  if (typeof raw === 'string') return raw.trim();
  if (typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    if (typeof obj.unshieldedAddress === 'string') return obj.unshieldedAddress.trim();
    if (typeof obj.shieldedAddress === 'string') return obj.shieldedAddress.trim();
    if (typeof obj.address === 'string') return obj.address.trim();
  }
  return String(raw);
}

/**
 * Truncate long Bech32 address for clean UI display: mn_addr_preprod1abc...xyz
 */
export function truncateAddress(address: string, lead = 18, tail = 6): string {
  if (!address) return '';
  if (address.length <= lead + tail) return address;
  return `${address.slice(0, lead)}...${address.slice(-tail)}`;
}

/**
 * Formats Midnight contract URL adhering strictly to PLURAL endpoints.
 * Never prefix contract addresses with 0x.
 */
export function getExplorerContractUrl(network: NetworkId, contractAddress: string): string {
  const base = NETWORK_CONFIGS[network].explorerBaseUrl;
  const cleanAddr = contractAddress.replace(/^0x/i, '').toLowerCase();
  return `${base}/contracts/${cleanAddr}`;
}

/**
 * Formats Midnight transaction URL adhering strictly to PLURAL endpoints.
 */
export function getExplorerTxUrl(network: NetworkId, txHash: string): string {
  const base = NETWORK_CONFIGS[network].explorerBaseUrl;
  const cleanTx = txHash.replace(/^0x/i, '').toLowerCase();
  return `${base}/transactions/${cleanTx}`;
}
