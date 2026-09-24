# SLAxiom — Dual-State Privacy Model & Cryptographic Specification

## 1. Architectural Privacy Premise

Traditional Service Level Agreement (SLA) verification forces service providers into an adversarial reporting dilemma:
- **Over-Disclosure:** To prove compliance with a contract (e.g. 99.9% uptime or < 250ms latency), providers must export and share proprietary telemetry logs, customer transaction volumes, internal IP topologies, and server incident reports.
- **Under-Verification:** Alternatively, clients must blindly trust self-attested vendor status pages, leading to contract disputes, delayed payments, and uncredited service degradations.

**SLAxiom solves this through Midnight Network's Dual-State Execution Model.**

---

## 2. Dual-State Data Flow

```
┌─────────────────────────────────────────────────────────┐
│               Client-Side Private Witness               │
│               (Local Browser / Prover Memory)           │
│                                                         │
│  • Actual Uptime (bps):      9995  (99.95%)             │
│  • Actual P95 Latency (ms):  182                        │
│  • Actual Incident Count:    1                          │
│  • Cryptographic Salt:       0x7f4e9102...              │
│  • Internal Server Identifiers & Cluster Logs           │
└───────────────────────────┬─────────────────────────────┘
                            │
                            │ Compact 0.5.2 Polynomial Constraints
                            ▼
┌─────────────────────────────────────────────────────────┐
│             Halo 2 Zero-Knowledge Circuit               │
│                                                         │
│  Asserts:                                               │
│    actualUptime >= minUptimeBps                         │
│    actualLatency <= maxLatencyP95Ms                     │
│    actualIncidents <= maxIncidents                      │
│                                                         │
│  Evaluates:                                             │
│    creditBand = (!uptimePassed) ? 25 :                  │
│                 (!latencyPassed || !incidentsPassed)    │
│                 ? 10 : 0                                │
└───────────────────────────┬─────────────────────────────┘
                            │
                            │ disclose(isCompliant)
                            │ disclose(creditBand)
                            │ disclose(periodId)
                            │ disclose(nonce)
                            ▼
┌─────────────────────────────────────────────────────────┐
│               Midnight Public Ledger State              │
│               (Immutable On-Chain Settlement)           │
│                                                         │
│  • isInitialized:            true                       │
│  • contractOwner:            0x4c164108...              │
│  • authorizedProvider:       0x30108d2c...              │
│  • policyCommitment:         0xd6abf137...              │
│  • lastPeriodId:             2026-Q3-PROD               │
│  • lastVerificationResult:   true (COMPLIANT)           │
│  • lastCreditBand:           0%                         │
│  • lastNullifier:            0x498c5346...              │
│  • verificationCount:        1                          │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Information Disclosure Boundary

| Data Element | Visibility Domain | Cryptographic Representation |
|:---|:---|:---|
| **Raw Telemetry Metrics** | Private (Client Memory Only) | Evaluated in arithmetic circuit; never published |
| **Customer Request Logs** | Private (Client Memory Only) | Never enters proving engine |
| **Server Topologies & IPs**| Private (Client Memory Only) | Never referenced in circuit |
| **Witness Salt** | Private (Client Memory Only) | Blinding factor for anti-replay nullifier |
| **Contract Policy Hash** | Public (On-Chain Ledger) | 32-byte SHA-256 commitment of contractual rules |
| **Compliance Outcome** | Public (On-Chain Ledger) | Disclosed boolean (`true` = Compliant, `false` = Breach) |
| **Service Credit Tier** | Public (On-Chain Ledger) | Disclosed `Uint<16>` (0%, 10%, or 25%) |
| **Settlement Period ID** | Public (On-Chain Ledger) | Disclosed 32-byte string/hash binding |
| **Anti-Replay Nullifier** | Public (On-Chain Ledger) | Disclosed 32-byte hash preventing proof reuse |

---

## 4. Cryptographic Proof Invariants

1. **Strict Witness Confidentiality:** No witness variable is ever assigned to a ledger variable without an explicit compiler `disclose()` declaration.
2. **Commitment Binding:** Contract policies are hashed into a 32-byte commitment. The verification circuit asserts against the committed hash, preventing post-facto policy alteration.
3. **Anti-Replay Nullifiers:** Each verification binds `periodId`, `salt`, and `policyCommitment` into a unique nullifier recorded on-chain, preventing replay attacks.
4. **Initialization Guards:** Re-initialization attacks are blocked via an on-chain boolean guard:
   ```compact
   assert(!isInitialized, "Contract already initialized");
   ```
