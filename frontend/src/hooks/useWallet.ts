import { useState, useCallback, useEffect } from 'react';
import type { InitialAPI, ConnectedAPI, Configuration } from '@midnight-ntwrk/dapp-connector-api';
import { NetworkId } from '../lib/networkConfig';
import { extractBech32Address } from '../lib/addressUtils';

export type WalletProviderId = '1am' | 'lace' | 'injected' | 'explorer';

export interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  unshieldedAddress: string | null;
  shieldedAddress: string | null;
  dustAddress: string | null;
  dustBalance: { balance: bigint; cap: bigint } | null;
  unshieldedBalances: Record<string, bigint> | null;
  configuration: Configuration | null;
  network: NetworkId;
  provider: WalletProviderId | null;
  connectedApi: ConnectedAPI | null;
  error: string | null;
}

export interface DetectedWallets {
  has1am: boolean;
  hasLace: boolean;
  hasAny: boolean;
  detectedList: Array<{ id: string; name: string; icon?: string }>;
}

/**
 * Inspects `window.midnight` for any injected DApp Connector InitialAPI instances.
 */
export function getDetectedWallets(): DetectedWallets {
  if (typeof window === 'undefined') {
    return { has1am: false, hasLace: false, hasAny: false, detectedList: [] };
  }

  const midnightObj = (window as any).midnight;
  if (!midnightObj || typeof midnightObj !== 'object') {
    return { has1am: false, hasLace: false, hasAny: false, detectedList: [] };
  }

  const detectedList: Array<{ id: string; name: string; icon?: string }> = [];
  let has1am = false;
  let hasLace = false;

  for (const [key, val] of Object.entries(midnightObj)) {
    const api = val as Partial<InitialAPI> | undefined;
    const name = api?.name || key;
    const rdns = api?.rdns || '';
    const icon = api?.icon;

    detectedList.push({ id: key, name, icon });

    if (key.toLowerCase() === '1am' || /1am/i.test(name) || /1am/i.test(rdns)) {
      has1am = true;
    }
    if (key.toLowerCase() === 'mnlace' || /lace/i.test(name) || /lace/i.test(rdns)) {
      hasLace = true;
    }
  }

  if ((window as any).lace?.midnight) {
    hasLace = true;
    if (!detectedList.some((d) => d.id === 'mnLace' || /lace/i.test(d.name))) {
      detectedList.push({ id: 'mnLace', name: 'Midnight Lace' });
    }
  }

  return {
    has1am,
    hasLace,
    hasAny: detectedList.length > 0,
    detectedList,
  };
}

/**
 * Actively probes and polls for a specific injected InitialAPI.
 * Allows time for extension content scripts to inject into the DOM.
 */
export async function findWalletApi(providerId: WalletProviderId): Promise<InitialAPI | null> {
  if (typeof window === 'undefined') return null;

  const maxAttempts = 15;
  for (let i = 0; i < maxAttempts; i++) {
    const midnightObj = (window as any).midnight;
    if (midnightObj && typeof midnightObj === 'object') {
      if (providerId === '1am') {
        if (midnightObj['1am']) return midnightObj['1am'] as InitialAPI;
        if (midnightObj['1AM']) return midnightObj['1AM'] as InitialAPI;
        if (midnightObj['io.1am.wallet']) return midnightObj['io.1am.wallet'] as InitialAPI;

        const found = Object.values(midnightObj).find((w: any) =>
          /1am/i.test(w?.name || '') || /1am/i.test(w?.rdns || '')
        );
        if (found) return found as InitialAPI;
      } else if (providerId === 'lace') {
        if (midnightObj.mnLace) return midnightObj.mnLace as InitialAPI;
        if ((window as any).lace?.midnight) return (window as any).lace.midnight as InitialAPI;

        const found = Object.values(midnightObj).find((w: any) =>
          /lace/i.test(w?.name || '') || /lace/i.test(w?.rdns || '')
        );
        if (found) return found as InitialAPI;
      } else if (providerId === 'injected') {
        const values = Object.values(midnightObj);
        if (values.length > 0) return values[0] as InitialAPI;
      }
    }
    await new Promise((r) => setTimeout(r, 80));
  }

  return null;
}

export function useWallet(currentNetwork: NetworkId) {
  // Volatile in-memory state only — zero localStorage ghosts
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    isConnecting: false,
    address: null,
    unshieldedAddress: null,
    shieldedAddress: null,
    dustAddress: null,
    dustBalance: null,
    unshieldedBalances: null,
    configuration: null,
    network: currentNetwork,
    provider: null,
    connectedApi: null,
    error: null,
  });

  const [detected, setDetected] = useState<DetectedWallets>({
    has1am: false,
    hasLace: false,
    hasAny: false,
    detectedList: [],
  });

  // Periodically check for installed extensions
  useEffect(() => {
    const updateDetected = () => {
      setDetected(getDetectedWallets());
    };
    updateDetected();
    const interval = setInterval(updateDetected, 1500);
    return () => clearInterval(interval);
  }, []);

  const connect = useCallback(async (providerId: WalletProviderId) => {
    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      if (providerId === 'explorer') {
        // Read-Only Explorer Mode (explicitly chosen for non-extension evaluation)
        const prefix = currentNetwork === 'preprod' ? 'mn_addr_preprod1' : 'mn_addr_preview1';
        const explorerAddress = `${prefix}explorer_readonly_audit_session`;
        setState({
          isConnected: true,
          isConnecting: false,
          address: explorerAddress,
          unshieldedAddress: explorerAddress,
          shieldedAddress: null,
          dustAddress: null,
          dustBalance: null,
          unshieldedBalances: null,
          configuration: null,
          network: currentNetwork,
          provider: 'explorer',
          connectedApi: null,
          error: null,
        });
        return;
      }

      // Search for the genuine injected InitialAPI from the browser extension
      const walletApi = await findWalletApi(providerId);

      if (!walletApi) {
        const name = providerId === '1am' ? '1AM Wallet' : providerId === 'lace' ? 'Midnight Lace' : 'Midnight DApp Connector';
        setState((prev) => ({
          ...prev,
          isConnecting: false,
          isConnected: false,
          address: null,
          connectedApi: null,
          error: `${name} extension was not detected. Please install ${name} or ensure the extension is enabled in your browser.`,
        }));
        return;
      }

      // Trigger the genuine wallet connection approval popup modal
      let connectedApi: ConnectedAPI;
      if (typeof walletApi.connect === 'function') {
        connectedApi = await walletApi.connect(currentNetwork);
      } else if (typeof (walletApi as any).enable === 'function') {
        connectedApi = await (walletApi as any).enable(currentNetwork);
      } else {
        throw new Error(`The detected ${walletApi.name || 'wallet'} does not support connect() or enable() methods.`);
      }

      // User APPROVED the connection in the extension modal!
      // Synchronize genuine unshielded, shielded, and dust addresses from the connected account
      let unshieldedAddress: string | null = null;
      try {
        if (typeof connectedApi.getUnshieldedAddress === 'function') {
          const res = await connectedApi.getUnshieldedAddress();
          const raw = res?.unshieldedAddress || res;
          unshieldedAddress = extractBech32Address(raw) || null;
        }
      } catch (e) {
        console.warn('Could not retrieve unshielded address:', e);
      }

      let shieldedAddress: string | null = null;
      try {
        if (typeof connectedApi.getShieldedAddresses === 'function') {
          const res = await connectedApi.getShieldedAddresses();
          const raw = res?.shieldedAddress || (Array.isArray(res) ? res[0] : res);
          shieldedAddress = extractBech32Address(raw) || null;
        }
      } catch (e) {
        console.warn('Could not retrieve shielded address:', e);
      }

      let dustAddress: string | null = null;
      try {
        if (typeof connectedApi.getDustAddress === 'function') {
          const res = await connectedApi.getDustAddress();
          const raw = res?.dustAddress || res;
          dustAddress = extractBech32Address(raw) || null;
        }
      } catch (e) {
        console.warn('Could not retrieve dust address:', e);
      }

      let dustBalance: { balance: bigint; cap: bigint } | null = null;
      try {
        if (typeof connectedApi.getDustBalance === 'function') {
          dustBalance = await connectedApi.getDustBalance();
        }
      } catch (e) {
        console.warn('Could not retrieve dust balance:', e);
      }

      let unshieldedBalances: Record<string, bigint> | null = null;
      try {
        if (typeof connectedApi.getUnshieldedBalances === 'function') {
          unshieldedBalances = await connectedApi.getUnshieldedBalances();
        }
      } catch (e) {
        console.warn('Could not retrieve unshielded balances:', e);
      }

      let configuration: Configuration | null = null;
      try {
        if (typeof connectedApi.getConfiguration === 'function') {
          configuration = await connectedApi.getConfiguration();
        }
      } catch (e) {
        console.warn('Could not retrieve wallet configuration:', e);
      }

      const primaryAddress = unshieldedAddress || shieldedAddress || dustAddress || `mn_addr_${currentNetwork}1userauth`;

      setState({
        isConnected: true,
        isConnecting: false,
        address: primaryAddress,
        unshieldedAddress,
        shieldedAddress,
        dustAddress,
        dustBalance,
        unshieldedBalances,
        configuration,
        network: currentNetwork,
        provider: providerId,
        connectedApi,
        error: null,
      });
    } catch (err: any) {
      // Handle user cancellation/rejection gracefully without dumping uncaught errors
      const isRejection =
        err?.code === 'Rejected' ||
        err?.code === 4001 ||
        /reject/i.test(err?.message || '') ||
        /cancel/i.test(err?.message || '') ||
        /denied/i.test(err?.message || '') ||
        /declined/i.test(err?.message || '');

      setState((prev) => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        address: null,
        connectedApi: null,
        error: isRejection
          ? 'Connection request was cancelled in your wallet extension. Please click Connect and approve the request.'
          : `Wallet connection failed: ${err?.message || 'Unknown extension error'}`,
      }));
    }
  }, [currentNetwork]);

  const disconnect = useCallback(() => {
    setState({
      isConnected: false,
      isConnecting: false,
      address: null,
      unshieldedAddress: null,
      shieldedAddress: null,
      dustAddress: null,
      dustBalance: null,
      unshieldedBalances: null,
      configuration: null,
      network: currentNetwork,
      provider: null,
      connectedApi: null,
      error: null,
    });
  }, [currentNetwork]);

  return {
    ...state,
    detected,
    connect,
    disconnect,
  };
}
