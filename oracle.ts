export interface QueriedBeacon {
  readonly round: number;
  readonly published: string;
  readonly verified: string;
  readonly randomness: string;
}

export interface BeaconsResponse {
  readonly beacons: ReadonlyArray<QueriedBeacon>;
}

export interface ConfigResponse {
  readonly min_round: number;
  // ... more elements here, see contract
}
