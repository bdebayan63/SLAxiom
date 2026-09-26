import { generateMnemonicWords, joinMnemonicWords, validateMnemonic } from '@midnight-ntwrk/wallet-sdk-hd';
import fs from 'node:fs';
import path from 'node:path';

// ==============================================================================
// SLAxiom — Official Midnight Network Wallet Seed Generator
// ==============================================================================

async function main() {
  const words = generateMnemonicWords();
  const phrase = joinMnemonicWords(words);
  const isValid = validateMnemonic(phrase);

  if (!isValid) {
    throw new Error('Generated mnemonic failed BIP-39 validation');
  }

  const walletData = {
    recoveryPhrase: phrase,
    wordsCount: words.length,
    generatedAt: new Date().toISOString(),
    network: 'preprod',
    faucetUrlPreprod: 'https://midnight-tmnight-preprod.nethermind.dev/',
    faucetUrlPreview: 'https://midnight-tmnight-preview.nethermind.dev/',
  };

  const credPath = path.resolve('wallet-credentials.json');
  fs.writeFileSync(credPath, JSON.stringify(walletData, null, 2), 'utf-8');

  console.log('='.repeat(78));
  console.log('SLAxiom — Official Midnight SDK 24-Word Recovery Phrase');
  console.log('='.repeat(78));
  console.log('\n24-WORD RECOVERY PHRASE (SAVE THIS & IMPORT INTO 1AM WALLET):');
  console.log(`\n${phrase}\n`);
  console.log('='.repeat(78));
}

main().catch(console.error);
