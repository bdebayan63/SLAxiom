export type NetworkId = 'preprod';

export interface NetworkConfig {
  id: NetworkId;
  name: string;
  badgeLabel: string;
  rpcUrl: string;
  indexerUrl: string;
  explorerBaseUrl: string;
  faucetUrl: string;
  contractAddress: string;
  addressPrefix: string;
  nativeToken: string;
  feeToken: string;
}

export const NETWORK_CONFIGS: Record<NetworkId, NetworkConfig> = {
  preprod: {
    id: 'preprod',
    name: 'Midnight Preprod Testnet',
    badgeLabel: 'Preprod',
    rpcUrl: 'https://rpc.preprod.midnight.network',
    indexerUrl: 'https://indexer.preprod.midnight.network/api/v4/graphql',
    explorerBaseUrl: 'https://preprod.midnightexplorer.com',
    faucetUrl: 'https://midnight-tmnight-preprod.nethermind.dev/',
    contractAddress: 'fc67e2850565d285f2c51ece80eb4894a32961f317d91703f4cd98a9ebef088b',
    addressPrefix: 'mn_addr_preprod1',
    nativeToken: 'tNIGHT',
    feeToken: 'tDUST',
  },
};
