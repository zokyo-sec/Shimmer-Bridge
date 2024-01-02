export function divCeil(a: bigint, b: bigint) {
  return (a + (b - BigInt(1))) / b;
}
