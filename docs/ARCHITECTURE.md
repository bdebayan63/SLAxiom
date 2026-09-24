# SLAxiom — System Architecture & Engineering Specification

## 1. System Overview

SLAxiom is engineered as an enterprise-grade decentralized application on the **Midnight Network**, integrating:
1. **Compact 0.5.2 Smart Contract:** Statically bounded domain-specific language compiling to Halo 2 ZKIR circuits.
2. **Midnight.js SDK & DApp Connector API v4:** Standardized browser extension integration with multi-wallet support (1AM & Lace).
3. **Dual-Network Settlement Topology:** Native support for both Midnight **Preview** and **Preprod** testnets.
4. **Client-Side WASM Proving Engine:** Zero-Docker client requirement; proofs execute locally in client memory.

---

## 2. Component Topology

```
┌─────────────────────────────────────────────────────────────────┐
│                    Enterprise Client Browser                    │
│                                                                 │
│   React 18 + Vite Frontend (Obsidian Dark Navy Theme)           │
│   ├── AuroraBackground (React Bits animated orbs)               │
│   ├── 3D Contract Vault (Three.js State Machine)                │
│   ├── ClientSlaProver (Clean forms, zero mock defaults)         │
│   ├── ZkPipelineVisualizer (Real-time proof progression)        │
│   └── PublicLedgerAudit (Immutable JSON ledger view)            │
│                                                                 │
│   Client Prover Engine                                          │
│   ├── Private Witness Context (In-Memory Only)                  │
│   └── Halo 2 WASM Prover (Zero Docker required for client)      │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                    DApp Connector API v4 Cascade
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Midnight Wallet Extension                   │
│                     (1AM Wallet / Lace Wallet)                  │
│                                                                 │
│   • Transaction Construction & Fee Balancing (DUST / NIGHT)     │
│   • Cryptographic Transaction Signing                           │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                   JSON-RPC & Substrate Transaction Submission
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Midnight Network Ledger                     │
│                     (Preview & Preprod Nodes)                   │
│                                                                 │
│   • On-Chain Verifier checks Halo 2 proof validity              │
│   • Updates public state: isInitialized, lastVerificationResult │
│   • GraphQL Indexer streams block height & settlement events    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Gas & Fee Balancing (DUST Mechanics)

- **DUST Unit:** 1 DUST = 1,000,000 Specks.
- **Accrual:** Holding native unshielded `tNIGHT` tokens accrues non-transferable shielded `tDUST` capacity upon UTXO registration (`registerNightUtxosForDustGeneration`).
- **Fee Configuration:** Transactions use realistic testnet cost parameters:
  ```typescript
  costParameters: {
    additionalFeeOverhead: 10_000_000n,
    feeBlocksMargin: 5,
  }
  ```
- **Balancer Inference:** The transaction builder allows automatic dual-token resolution across unshielded NIGHT and shielded DUST.

---

## 4. Explorer URL Conventions

In accordance with Midnight Explorer routing invariants, all contract and transaction references strictly utilize **plural** endpoints:
- Contract View: `https://[network].midnightexplorer.com/contracts/[64-char-hex-address]`
- Transaction View: `https://[network].midnightexplorer.com/transactions/[64-char-hex-txhash]`
*(Singular `/contract/` or `/tx/` endpoints return HTTP 404).*
