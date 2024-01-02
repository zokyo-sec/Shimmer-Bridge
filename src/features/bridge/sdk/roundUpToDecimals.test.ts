import {Coin, parseCurrencyAmount} from '@layerzerolabs/ui-core';
import {describe, expect, it, test} from 'vitest';

import {divCeil} from './math/divCeil';
import {roundUpToDecimals} from './roundUpToDecimals';

describe('divCeil', () => {
  const cases = [
    {a: 1n, b: 2n, expected: 1n},
    {a: 100001n, b: 2n, expected: 50001n},
    {a: 123456n, b: 1n, expected: 123456n},
    {a: 123456n, b: 10n, expected: 12346n},
    {a: 123456n, b: 100n, expected: 1235n},
    {a: 123456n, b: 1000n, expected: 124n},
    {a: 123456n, b: 10000n, expected: 13n},
    {a: 123456n, b: 100000n, expected: 2n},
  ];

  test.each(cases)('divCeil($a, $b) = $expected', ({a, b, expected}) => {
    expect(divCeil(a, b)).toBe(expected);
  });
});

describe('roundUpToDecimals', () => {
  const eth = Coin.from({symbol: 'ETH', decimals: 18, chainId: 101});
  const cases = [
    {amount: '1.23456789012344', decimals: 6, expected: '1.234568'},
    {amount: '0.23456789012344', decimals: 6, expected: '0.234568'},
    {amount: '0.00000100000000', decimals: 6, expected: '0.000001'},
    {amount: '0.00000010000000', decimals: 6, expected: '0.000001'},
    {amount: '0.00000001000000', decimals: 6, expected: '0.000001'},
    {amount: '0.00000000000001', decimals: 6, expected: '0.000001'},
    {amount: '0.00000000000000', decimals: 6, expected: '0'},
  ];
  test.each(cases)(`$amount ${eth.symbol} => $expected`, (input) => {
    const amount = parseCurrencyAmount(eth, input.amount);
    const rounded = roundUpToDecimals(amount, input.decimals);
    expect(rounded.toExact()).toBe(input.expected);
  });
});
