export function bigIntMax(args: bigint[]): bigint {
  return args.reduce((min, e) => e > min ? e : min);
}

export function bigIntMin(args: bigint[]): bigint {
  return args.reduce((min, e) => e < min ? e : min);
}

export function sign(val: bigint): -1 | 0 | 1 {
  return val == 0n ? 0 : val > 0 ? 1 : -1;
}

export function abs(val: bigint): bigint {
  return val < 0 ? -val : val;
}
