const DRAND_GENESIS = new Date(1595431050_000);
const DRAND_ROUND_LENGTH = 30_000; // in milliseconds

// See TimeOfRound implementation: https://github.com/drand/drand/blob/eb36ba81e3f28c966f95bcd602f60e7ff8ef4c35/chain/time.go#L30-L33
export function timeOfRound(round: number): Date {
  return new Date(DRAND_GENESIS.getTime() + (round - 1) * DRAND_ROUND_LENGTH);
}
