import { CosmWasmClient } from "npm:@cosmjs/cosmwasm-stargate";
import { timeOfRound } from "./drand.ts";
import { drandAddress, rpcEndpoint } from "./env.ts";
import { BeaconsResponse, ConfigResponse } from "./oracle.ts";
import { bigIntMax, bigIntMin } from "./stats.ts";

function warnLog(msg: string) {
  console.warn(`%c${msg}`, "color: orange");
}

function nsToSec(ns: bigint): number {
  // truncate last 3 digits to make to make value fit in safe integer range
  return Number(ns / BigInt(1000)) / 1000000;
}

if (import.meta.main) {
  const client = await CosmWasmClient.connect(rpcEndpoint);

  const { min_round: min }: ConfigResponse = await client.queryContractSmart(
    drandAddress,
    { config: {} },
  );
  // console.log(min);

  const { beacons: [beaconLow] }: BeaconsResponse = await client.queryContractSmart(
    drandAddress,
    {
      beacons_asc: { start_after: null, limit: 1 },
    },
  );
  // console.log(beaconLow);

  const { beacons: [beaconHigh] }: BeaconsResponse = await client.queryContractSmart(
    drandAddress,
    {
      beacons_desc: { start_after: null, limit: 1 },
    },
  );
  // console.log(beaconHigh);

  const low = min; // beaconLow.round;
  const high = beaconHigh.round;

  const count = high - low + 1;
  console.log(
    `Verification range [${low}, ${high}] (${count} round between ${
      timeOfRound(low).toISOString()
    } and ${timeOfRound(high).toISOString()})`,
  );

  let pos = low; // lowest checked round
  const lowDiff = BigInt(beaconLow.verified) - BigInt(beaconLow.published);
  const diffs = [lowDiff];
  while (pos < beaconHigh.round) {
    const { beacons }: BeaconsResponse = await client.queryContractSmart(
      drandAddress,
      { beacons_asc: { start_after: pos, limit: 400 } },
    );
    const rounds = beacons.map((b) => b.round);
    diffs.push(...beacons.map((b) => BigInt(b.verified) - BigInt(b.published)));

    // console.info(`Rounds in latest request ${rounds}`);
    for (const round of rounds) {
      const expected = pos + 1;
      if (round != expected) {
        warnLog(`Missing round ${expected}.`);
      }
      pos += 1;
    }
    const processed = pos - beaconLow.round + 1;
    const done = 100 * (processed / count);
    console.log(`Processed rounds ${processed} (${done.toFixed(2)}%)`);
  }

  console.log(`Verification times processed: ${diffs.length}`);
  console.log(`Verification time minimum: ${nsToSec(bigIntMin(diffs)).toFixed(2)}s`);
  console.log(`Verification time maximum: ${nsToSec(bigIntMax(diffs)).toFixed(2)}s`);
  const m = new Map<string, number>();
  for (const d of diffs) {
    let slotLowEnd = null;
    const dMs = d / 1000000n;
    if (dMs > -11_000n) slotLowEnd = -11_000n;
    if (dMs > -10_000n) slotLowEnd = -10_000n;
    if (dMs > -9_000n) slotLowEnd = -9_000n;
    if (dMs > -8_000n) slotLowEnd = -8_000n;
    if (dMs > -7_000n) slotLowEnd = -7_000n;
    if (dMs > -6_000n) slotLowEnd = -6_000n;
    if (dMs > -5_000n) slotLowEnd = -5_000n;
    if (dMs > -4_000n) slotLowEnd = -4_000n;
    if (dMs > -3_000n) slotLowEnd = -3_000n;
    if (dMs > -2_000n) slotLowEnd = -2_000n;
    if (dMs > -1_000n) slotLowEnd = -1_000n;
    if (dMs > -0n) slotLowEnd = 0n;
    if (dMs > 1_000n) slotLowEnd = 1_000n;
    if (dMs > 2_000n) slotLowEnd = 2_000n;
    if (dMs > 3_000n) slotLowEnd = 3_000n;
    if (dMs > 4_000n) slotLowEnd = 4_000n;
    if (dMs > 5_000n) slotLowEnd = 5_000n;
    if (dMs > 6_000n) slotLowEnd = 6_000n;
    if (dMs > 7_000n) slotLowEnd = 7_000n;
    if (dMs > 8_000n) slotLowEnd = 8_000n;
    if (dMs > 9_000n) slotLowEnd = 9_000n;
    if (dMs > 10_000n) slotLowEnd = 10_000n;
    if (dMs > 11_000n) slotLowEnd = 11_000n;
    if (dMs > 12_000n) slotLowEnd = null;

    const key = `${slotLowEnd}`;
    m.set(key, (m.get(key) ?? 0) + 1);
  }
  // print csv
  for (const [key, val] of m.entries()) {
    console.log(`${key},${val}`);
  }
}
