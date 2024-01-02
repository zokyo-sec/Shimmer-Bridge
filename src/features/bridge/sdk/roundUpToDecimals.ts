import {CurrencyAmount} from '@layerzerolabs/ui-core';

import {divCeil} from './math/divCeil';

export function roundUpToDecimals(amount: CurrencyAmount, roundDecimals: number) {
  const localDecimals = amount.currency.decimals;
  const diff = localDecimals - roundDecimals;
  if (diff > 0) {
    return CurrencyAmount.fromRawAmount(
      amount.currency,
      divCeil(amount.quotient, BigInt(10 ** diff)),
    ).multiply(10 ** diff);
  }
  return amount;
}
