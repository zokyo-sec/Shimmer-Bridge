import {TokenListItem} from '@layerzerolabs/ui-core';

const NATIVE_ADDRESS = null;
const MIM_NAME = 'Magic Internet Money';

export const tokenList = createTokenList([
  // ETH
  ['ETH', 'Ether', NATIVE_ADDRESS, 18, 'ethereum', 1027, 'ethereum'],
  ['ETH', 'Ether', NATIVE_ADDRESS, 18, 'arbitrum', 1027, 'ethereum'],
  ['ETH', 'Ether', NATIVE_ADDRESS, 18, 'optimism', 1027, 'ethereum'],

  // AVAX
  ['AVAX', 'AVAX', NATIVE_ADDRESS, 18, 'avalanche', null, 'avalanche-2'],

  // CRV
  ['CRV', 'Curve DAO Token', '0xD533a949740bb3306d119CC777fa900bA034cd52', 18, 'ethereum', 6538],
  ['CRV', 'Curve DAO Token', '0xc7ae4ab742f6b0b203f6710c87677005bc45ad01', 18, 'fantom', 6538],

  // MIM
  ['MIM', MIM_NAME, '0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3', 18, 'ethereum', 162],
  ['MIM', MIM_NAME, '0xfE19F0B51438fd612f6FD59C1dbB3eA319f433Ba', 18, 'bsc', 162],
  ['MIM', MIM_NAME, '0x130966628846BFd36ff31a822705796e8cb8C18D', 18, 'avalanche', 162],
  ['MIM', MIM_NAME, '0x49a0400587A7F65072c87c4910449fDcC5c47242', 18, 'polygon', 162],
  ['MIM', MIM_NAME, '0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A', 18, 'arbitrum', 162],
  ['MIM', MIM_NAME, '0xB153FB3d196A8eB25522705560ac152eeEc57901', 18, 'optimism', 162],
  ['MIM', MIM_NAME, '0x82f0B8B456c1A451378467398982d4834b6829c1', 18, 'fantom', 162],
  ['MIM', MIM_NAME, '0x0caE51e1032e8461f4806e26332c030E34De3aDb', 18, 'moonriver', 162],
  ['MIM', MIM_NAME, '0x471EE749bA270eb4c1165B5AD95E614947f6fCeb', 18, 'kava', 162],
  ['MIM', MIM_NAME, '0x4A3A6Dd60A34bB2Aba60D73B4C88315E9CeB6A3D', 18, 'base', 162],

  // WETH
  ['WETH', 'Wrapped Ether', '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', 18, 'ethereum', 2396],

  // BTC.b
  ['BTC.b', 'BTC.b', '0x2297aebd383787a160dd0d9f71508148769342e3', 8, 'ethereum', 1],
  ['BTC.b', 'BTC.b', '0x2297aebd383787a160dd0d9f71508148769342e3', 8, 'bsc', 1],
  ['BTC.b', 'BTC.b', '0x2297aebd383787a160dd0d9f71508148769342e3', 8, 'polygon', 1],
  ['BTC.b', 'BTC.b', '0x2297aebd383787a160dd0d9f71508148769342e3', 8, 'arbitrum', 1],
  ['BTC.b', 'BTC.b', '0x2297aebd383787a160dd0d9f71508148769342e3', 8, 'optimism', 1],
  ['BTC.b', 'BTC.b', '0x2297aebd383787a160dd0d9f71508148769342e3', 8, 'coredao', 1],
  ['BTC.b', 'BTC.b', '0x152b9d0fdc40c096757f570a51e494bd4b943e50', 8, 'avalanche', 1],

  // CAKE
  ['CAKE', 'Cake', '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82', 18, 'bsc', 7186],
  ['CAKE', 'Cake', '0x152649ea73beab28c5b49b26eb48f7ead6d4c898', 18, 'ethereum', 7186],
  ['CAKE', 'Cake', '0x1b896893dfc86bb67Cf57767298b9073D2c1bA2c', 18, 'arbitrum', 7186],
  ['CAKE', 'Cake', '0x0d1e753a25ebda689453309112904807625befbe', 18, 'zkevm', 7186],

  // JOE
  ['JOE', 'JOE', '0x371c7ec6d8039ff7933a2aa28eb827ffe1f52f07', 18, 'bsc', 11396],
  ['JOE', 'JOE', '0x371c7ec6d8039ff7933a2aa28eb827ffe1f52f07', 18, 'arbitrum', 11396],
  ['JOE', 'JOE', '0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd', 18, 'avalanche', 11396],
  ['JOE', 'JOE', '0x371c7ec6d8039ff7933a2aa28eb827ffe1f52f07', 18, 'ethereum', 11396],

  //
]);

type TokenListItemTuple = [
  symbol: string,
  name: string,
  address: string | null,
  decimals: number,
  chainKey: string,
  coinMarketCapId: number | null,
  coinGeckoId?: string,
];

function createTokenList<T extends TokenListItemTuple>(
  items: T[],
): (TokenListItem & {coinMarketCapId?: number | string; coinGeckoId?: string})[] {
  return items.map(([symbol, name, address, decimals, chainKey, coinMarketCapId, coinGeckoId]) => ({
    symbol,
    chainKey,
    decimals,
    address,
    name,
    //
    price: {},
    coinMarketCapId: coinMarketCapId ?? undefined,
    coinGeckoId: coinGeckoId ?? undefined,
  }));
}
