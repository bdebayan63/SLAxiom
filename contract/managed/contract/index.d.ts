import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
  getPrivateUptime(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  getPrivateLatency(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  getPrivateIncidents(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  getPrivateSalt(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  initialize(context: __compactRuntime.CircuitContext<PS>,
             owner_0: Uint8Array,
             provider_0: Uint8Array,
             initialPolicyHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  updatePolicy(context: __compactRuntime.CircuitContext<PS>,
               newPolicyHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  verifySla(context: __compactRuntime.CircuitContext<PS>,
            periodId_0: Uint8Array,
            minUptimeBps_0: bigint,
            maxLatencyP95Ms_0: bigint,
            maxIncidents_0: bigint,
            nonce_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  initialize(context: __compactRuntime.CircuitContext<PS>,
             owner_0: Uint8Array,
             provider_0: Uint8Array,
             initialPolicyHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  updatePolicy(context: __compactRuntime.CircuitContext<PS>,
               newPolicyHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  verifySla(context: __compactRuntime.CircuitContext<PS>,
            periodId_0: Uint8Array,
            minUptimeBps_0: bigint,
            maxLatencyP95Ms_0: bigint,
            maxIncidents_0: bigint,
            nonce_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  initialize(context: __compactRuntime.CircuitContext<PS>,
             owner_0: Uint8Array,
             provider_0: Uint8Array,
             initialPolicyHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  updatePolicy(context: __compactRuntime.CircuitContext<PS>,
               newPolicyHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  verifySla(context: __compactRuntime.CircuitContext<PS>,
            periodId_0: Uint8Array,
            minUptimeBps_0: bigint,
            maxLatencyP95Ms_0: bigint,
            maxIncidents_0: bigint,
            nonce_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly isInitialized: boolean;
  readonly contractOwner: Uint8Array;
  readonly authorizedProvider: Uint8Array;
  readonly policyCommitment: Uint8Array;
  readonly verificationCount: bigint;
  readonly lastPeriodId: Uint8Array;
  readonly lastVerificationResult: boolean;
  readonly lastCreditBand: bigint;
  readonly lastNullifier: Uint8Array;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
