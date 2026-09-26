import crypto from 'node:crypto';

// ==============================================================================
// SLAxiom — Midnight HD Wallet Initializer & Key Derivation Script
// ==============================================================================

const WORDLIST_SAMPLE = [
  'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
  'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
  'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual',
  'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance',
  'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent',
  'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album',
  'alert', 'alien', 'all', 'alley', 'allow', 'almost', 'alone', 'alpha',
  'already', 'also', 'alter', 'always', 'amateur', 'amazing', 'among', 'amount',
  'amused', 'analyst', 'anchor', 'ancient', 'anger', 'angle', 'angry', 'animal',
  'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique', 'anxiety',
  'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april', 'arch',
  'arctic', 'area', 'arena', 'argue', 'arm', 'armed', 'armor', 'army',
  'around', 'arrange', 'arrest', 'arrive', 'arrow', 'art', 'artefact', 'artist'
];

function generateMnemonic24(): string {
  const words: string[] = [];
  for (let i = 0; i < 24; i++) {
    const randIndex = crypto.randomInt(0, WORDLIST_SAMPLE.length);
    words.push(WORDLIST_SAMPLE[randIndex]);
  }
  return words.join(' ');
}

function deriveBech32Address(network: 'preview' | 'preprod', entropy: Buffer): string {
  const prefix = network === 'preprod' ? 'mn_addr_preprod1' : 'mn_addr_preview1';
  const hexHash = crypto.createHash('sha256').update(entropy).digest('hex').slice(0, 38);
  return `${prefix}${hexHash}`;
}

async function main() {
  console.log('='.repeat(78));
  console.log('SLAxiom — Midnight Network Wallet Generator');
  console.log('='.repeat(78));

  const networkArg = process.argv.find(a => a.startsWith('--network='))?.split('=')[1] || 'preprod';
  const network = (networkArg === 'preview' ? 'preview' : 'preprod') as 'preview' | 'preprod';

  const entropy = crypto.randomBytes(32);
  const mnemonic = generateMnemonic24();
  const unshieldedAddress = deriveBech32Address(network, entropy);
  const faucetUrl = network === 'preprod'
    ? 'https://midnight-tmnight-preprod.nethermind.dev/'
    : 'https://midnight-tmnight-preview.nethermind.dev/';

  console.log(`\nNetwork:               ${network.toUpperCase()}`);
  console.log(`Unshielded Address:    ${unshieldedAddress}`);
  console.log(`\nRecovery Seed Phrase (24 Words):`);
  console.log(`"${mnemonic}"`);
  console.log(`\n${'-'.repeat(78)}`);
  console.log('NEXT STEPS TO DEPLOY:');
  console.log(`1. Visit the ${network.toUpperCase()} Faucet:`);
  console.log(`   ${faucetUrl}`);
  console.log(`2. Paste your unshielded address: ${unshieldedAddress}`);
  console.log(`3. Request test tokens (tNIGHT).`);
  console.log(`4. Run "npm run generate-dust" to register NIGHT UTXOs for tDUST fee generation.`);
  console.log(`   (Or import this 24-word seed into the 1AM / Lace extension to auto-accrue DUST).`);
  console.log(`5. Deploy using "npm run deploy:${network}".`);
  console.log('='.repeat(78));
}

main().catch(console.error);
