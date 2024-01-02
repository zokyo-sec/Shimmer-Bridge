import {ChainId} from '@layerzerolabs/lz-sdk';
import {AppConfig, createAppConfig} from '@layerzerolabs/ui-app-config';
import {WrappedTokenBridgeConfig} from '@layerzerolabs/ui-bridge-wrapped-token';
import {getNativeCurrency, Token} from '@layerzerolabs/ui-core';

const ORIGINAL_BRIDGE_ADDRESS = '0x9C6D5a71FdD306329287a835e9B8EDb7F0F17898';

export const wrappedTokenBridge: WrappedTokenBridgeConfig = {
  version: 2,
  original: [
    {address: ORIGINAL_BRIDGE_ADDRESS, chainId: ChainId.ETHEREUM},
    {address: ORIGINAL_BRIDGE_ADDRESS, chainId: ChainId.BSC},
    {address: ORIGINAL_BRIDGE_ADDRESS, chainId: ChainId.POLYGON},
    {address: ORIGINAL_BRIDGE_ADDRESS, chainId: ChainId.AVALANCHE},
    {address: ORIGINAL_BRIDGE_ADDRESS, chainId: ChainId.ARBITRUM},
    {address: ORIGINAL_BRIDGE_ADDRESS, chainId: ChainId.OPTIMISM},
    {address: ORIGINAL_BRIDGE_ADDRESS, chainId: ChainId.BASE},
    {address: ORIGINAL_BRIDGE_ADDRESS, chainId: ChainId.FANTOM},
  ],
  wrapped: {
    address: '0x9C6D5a71FdD306329287a835e9B8EDb7F0F17898',
    chainId: ChainId.SHIMMER,
  },
  // tokens is a two dimensional array where each list of tokens can be exchanged with others in its array
  tokens: [
    [
      // USDC
      Token.from({
        chainId: ChainId.SHIMMER,
        address: '0xeCE555d37C37D55a6341b80cF35ef3BC57401d1A',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      }),
      Token.from({
        chainId: ChainId.ETHEREUM,
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      }),
      Token.from({
        chainId: ChainId.BSC,
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 18,
        address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      }),
      Token.from({
        chainId: ChainId.ARBITRUM,
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      }),
      Token.from({
        chainId: ChainId.POLYGON,
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
      }),
      Token.from({
        chainId: ChainId.BASE,
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      }),
      Token.from({
        chainId: ChainId.AVALANCHE,
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
      }),
      Token.from({
        chainId: ChainId.OPTIMISM,
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
      }),
      Token.from({
        chainId: ChainId.FANTOM,
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        address: '0x28a92dde19D9989F39A49905d7C9C2FAc7799bDf',
      }),
    ],
    [
      //  USDT
      Token.from({
        chainId: ChainId.SHIMMER,
        address: '0xa4f8C7C1018b9dD3be5835bF00f335D9910aF6Bd',
        name: 'Tether USD',
        symbol: 'USDT',
        decimals: 6,
      }),
      Token.from({
        chainId: ChainId.ETHEREUM,
        name: 'Tether USD',
        symbol: 'USDT',
        decimals: 6,
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      }),
      Token.from({
        chainId: ChainId.BSC,
        name: 'Tether USD',
        symbol: 'USDT',
        decimals: 18,
        address: '0x55d398326f99059fF775485246999027B3197955',
      }),
      Token.from({
        chainId: ChainId.ARBITRUM,
        name: 'Tether USD',
        symbol: 'USDT',
        decimals: 6,
        address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      }),
      Token.from({
        chainId: ChainId.POLYGON,
        name: '(PoS) Tether USD',
        symbol: 'USDT',
        decimals: 6,
        address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      }),
      Token.from({
        chainId: ChainId.OPTIMISM,
        name: 'Tether USD',
        symbol: 'USDT',
        decimals: 6,
        address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
      }),
      Token.from({
        chainId: ChainId.AVALANCHE,
        name: 'TetherToken',
        symbol: 'USDt',
        decimals: 6,
        address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
      }),
    ],
    [
      // WBTC
      Token.from({
        chainId: ChainId.SHIMMER,
        address: '0xb0119035d08CB5f467F9ed8Eae4E5f9626Aa7402',
        name: 'Wrapped Bitcoin',
        symbol: 'WBTC',
        decimals: 8,
      }),
      Token.from({
        chainId: ChainId.ETHEREUM,
        name: 'Wrapped BTC',
        symbol: 'WBTC',
        decimals: 8,
        address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      }),
      Token.from({
        chainId: ChainId.ARBITRUM,
        name: 'Wrapped BTC',
        symbol: 'WBTC',
        decimals: 8,
        address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
      }),
      Token.from({
        chainId: ChainId.POLYGON,
        name: '(PoS) Wrapped BTC',
        symbol: 'WBTC',
        decimals: 8,
        address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
      }),
      Token.from({
        chainId: ChainId.OPTIMISM,
        name: 'Wrapped BTC',
        symbol: 'WBTC',
        decimals: 8,
        address: '0x68f180fcCe6836688e9084f035309E29Bf0A2095',
      }),
    ],
    [
      // ETH/WETH
      getNativeCurrency(ChainId.ETHEREUM), // NATIVE
      Token.from({
        chainId: ChainId.SHIMMER,
        address: '0x4638C9fb4eFFe36C49d8931BB713126063BF38f9',
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
      }),
      Token.from({
        chainId: ChainId.ARBITRUM,
        name: 'Wrapped Ether',
        symbol: 'WETH',
        decimals: 18,
        address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
      }),
      Token.from({
        chainId: ChainId.POLYGON,
        name: 'Wrapped Ether',
        symbol: 'WETH',
        decimals: 18,
        address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      }),
      Token.from({
        chainId: ChainId.OPTIMISM,
        name: 'Wrapped Ether',
        symbol: 'WETH',
        decimals: 18,
        address: '0x4200000000000000000000000000000000000006',
      }),
      Token.from({
        chainId: ChainId.BASE,
        name: 'Wrapped Ether',
        symbol: 'WETH',
        decimals: 18,
        address: '0x4200000000000000000000000000000000000006',
      }),
    ],
    [
      // AVAX
      getNativeCurrency(ChainId.AVALANCHE), // NATIVE
      Token.from({
        chainId: ChainId.SHIMMER,
        address: '0xEAf8553fD72417C994525178fC917882d5AEc725',
        name: 'AVAX',
        symbol: 'AVAX',
        decimals: 18,
      }),
    ],
    [
      // MATIC
      getNativeCurrency(ChainId.POLYGON), // NATIVE
      Token.from({
        chainId: ChainId.SHIMMER,
        address: '0xE6373A7Bb9B5a3e71D1761a6Cb4992AD8537Bf28',
        name: 'Matic',
        symbol: 'MATIC',
        decimals: 18,
      }),
    ],
    [
      // BNB
      getNativeCurrency(ChainId.BSC), // NATIVE
      Token.from({
        chainId: ChainId.SHIMMER,
        address: '0x2A6F394085B8E33fbD9dcFc776BCE4ed95F1900D',
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
      }),
    ],
    [
      // FTM
      getNativeCurrency(ChainId.FANTOM), // NATIVE
      Token.from({
        chainId: ChainId.SHIMMER,
        address: '0x8C96Dd1A8B1952Ce6F3a582170bb173eD591D40D',
        name: 'FTM',
        symbol: 'FTM',
        decimals: 18,
      }),
    ],
  ],
};

// only example tokens should be included in the bridge
export const appConfig: AppConfig = createAppConfig({
  bridge: {
    wrappedToken: [
      //
      wrappedTokenBridge,
    ],
  },
});
