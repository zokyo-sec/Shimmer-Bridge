import {ChainId} from '@layerzerolabs/lz-sdk';
import {type AppConfig} from '@layerzerolabs/ui-app-config';
import {OftBridgeConfig} from '@layerzerolabs/ui-bridge-oft';
import {OftBridgeApiFactory__evm} from '@layerzerolabs/ui-bridge-oft/evm';
import {
  mainnet as oftWrapperConfig,
  OftWrapperBridge__evm,
  OftWrapperBridgeConfig,
} from '@layerzerolabs/ui-bridge-oft-wrapper';
import {
  OnftBridgeApi__ERC721__evm,
  OnftBridgeApi__ERC1155__evm,
  OnftStandard,
  RPC__Enumerable__ERC721BalanceProvider,
  RPC__StaticId__ERC1155BalanceProvider,
} from '@layerzerolabs/ui-bridge-onft';
import {createWrappedTokenBridge} from '@layerzerolabs/ui-bridge-wrapped-token';
import {Currency, getNativeCurrency, isEvmChainId, Token} from '@layerzerolabs/ui-core';
import {BalanceProvider__evm, DstConfigProvider__evm, ProviderFactory} from '@layerzerolabs/ui-evm';
import {GasDropBridge} from '@layerzerolabs/ui-gas-drop';

import assert from 'assert';
import {constants} from 'ethers';
import {uniqBy} from 'lodash-es';

import {DefaultAirdropProvider__evm} from '@/bridge/sdk/airdrop/DefaultAirdropProvider__evm';
import {bridgeStore, initBridgeStore} from '@/bridge/stores/bridgeStore';

import {createWallets} from '@/core/config/createWallets';
import {CachedDstConfigProvider} from '@/core/sdk/CachedDstConfigProvider';
import {TokenListProvider} from '@/core/sdk/TokenListProvider';
import {airdropStore} from '@/core/stores/airdropStore';
import {balanceStore} from '@/core/stores/balanceStore';
import {fiatStore} from '@/core/stores/fiatStore';
import {lzConfigStore} from '@/core/stores/lzStore';
import {tokenStore} from '@/core/stores/tokenStore';
import {transactionStore} from '@/core/stores/transactionStore';
import {initTransactionStore} from '@/core/stores/transactionStore';
import {walletStore} from '@/core/stores/walletStore';
import {gasDropStore} from '@/gas/stores/gasDropStore';
import {onftStore} from '@/onft/stores/onftStore';
import {initOnftStore} from '@/onft/stores/onftStore';

export async function bootstrap(lzAppConfig: AppConfig, providerFactory: ProviderFactory) {
  // Compile a list of unique currencies used in the app based on the bridge configuration
  const currencies = getCurrenciesFromLzAppConfig(lzAppConfig);

  // Compile a list of unique chains used in the app based on the bridge configuration
  const chains = getChainsFromLzAppConfig(lzAppConfig);
  const wallets = createWallets(chains);
  walletStore.addWallets(wallets);

  // tokens that have inconsistent symbols can be mapped to single symbol
  fiatStore.addSymbols({
    METIS: 'Metis',
    'm.USDT': 'USDT',
    USDt: 'USDT',
    'WOO.e': 'WOO',
    miMATIC: 'MAI',
  });

  for (const oftConfig of lzAppConfig.bridge.oft) {
    bridgeStore.addCurrencies(oftConfig.tokens);
  }

  // WrappedAssetBridge
  // https://github.com/LayerZero-Labs/wrapped-asset-bridge
  for (const wrappedAssetConfig of lzAppConfig.bridge.wrappedToken) {
    const apis = createWrappedTokenBridge(wrappedAssetConfig, providerFactory);
    for (const api of apis) {
      bridgeStore.addBridge(api);
    }
  }

  // ONFT ERC721 & ERC1155
  // https://github.com/LayerZero-Labs/solidity-examples/tree/main#omnichainnonfungibletoken721-onft721
  for (const collection of lzAppConfig.bridge.onft) {
    const standard = collection.contracts.at(0)?.standard;
    if (standard === OnftStandard.ERC1155) {
      // Balance provider is responsible for grabbing the user's token wallet balances
      // either by sourcing the chain data or by using third-party indexing services.
      //
      // For ERC1155 tokens with limited set of tokenIds you can use RPC__StaticId__ERC1155BalanceProvider shipped with @layerzerolabs/ui-bridge-onft
      // For other implementations we recommend using a third party service
      const balanceProvider = new RPC__StaticId__ERC1155BalanceProvider(
        [BigInt(10), BigInt(128), BigInt(255)],
        providerFactory,
      );

      const api = new OnftBridgeApi__ERC1155__evm(providerFactory, collection, balanceProvider);
      onftStore.addCollection(collection);
      onftStore.addBridge(api);
    } else if (standard === OnftStandard.ERC721) {
      // Balance provider is responsible for grabbing the user's token wallet balances
      // either by sourcing the chain data or by using third-party indexing services.
      //
      // For IERC721Enumerable standard you can use RPC__Enumerable__ERC721BalanceProvider shipped with @layerzerolabs/ui-bridge-onft
      // For other implementations we recommend using a third party service
      const balanceProvider = new RPC__Enumerable__ERC721BalanceProvider(
        collection,
        providerFactory,
      );

      const api = new OnftBridgeApi__ERC721__evm(providerFactory, collection, balanceProvider);
      onftStore.addCollection(collection);
      onftStore.addBridge(api);
    } else {
      throw new Error(`Unknown ONFT standard ${standard}`);
    }
  }

  bridgeStore.addCurrencies(currencies);

  tokenStore.addProviders([
    //
    new TokenListProvider(),
  ]);

  lzConfigStore.addProviders([new DstConfigProvider__evm(providerFactory)]);

  balanceStore.addProviders([new BalanceProvider__evm(providerFactory)]);

  airdropStore.addProviders([new DefaultAirdropProvider__evm(providerFactory)]);

  if (lzAppConfig.bridge.gasDrop.length > 0) {
    const cachedDstConfigProvider = new CachedDstConfigProvider(
      new DstConfigProvider__evm(providerFactory),
    );
    for (const config of lzAppConfig.bridge.gasDrop) {
      // only one bridge is supported right now
      gasDropStore.setBridge(new GasDropBridge(config, providerFactory, cachedDstConfigProvider));
    }

    gasDropStore.addProviders([
      //
      cachedDstConfigProvider,
    ]);
  }

  if (typeof window !== 'undefined') {
    // Todo:
    // refactor to method on store
    initBridgeStore();
    initOnftStore();
    initTransactionStore(transactionStore);

    gasDropStore.subscribe();
    tokenStore.updateTokens();
  }

  function addEvmOft(oftConfig: OftBridgeConfig) {
    if (oftConfig.tokens.some((t) => isEvmChainId(t.chainId))) {
      const factory = new OftBridgeApiFactory__evm(providerFactory);
      const api = factory.create(oftConfig);
      bridgeStore.addBridge(api);
    }
  }

  function addStargateWrapperOft(
    oftConfig: OftBridgeConfig,
    wrapperConfig: Omit<OftWrapperBridgeConfig, 'oft'>,
  ) {
    assert(oftConfig.version !== 0, 'OFT Version 0 not supported in Stargate Wrapper');

    const api = new OftWrapperBridge__evm(providerFactory, {
      oft: oftConfig,
      ...wrapperConfig,
    });
    bridgeStore.addBridge(api);
  }
}

/**
 * Creates a unique string representation of a currency,
 * useful for key prop on React components
 *
 * @param c Currency
 * @returns String
 */
function currencyKey(c: Currency): string {
  return [c.chainId, c.symbol, (c as Token).address ?? '0x', c.decimals].join(':');
}

/**
 * Creates a deduplicated list of currencies from AppConfig object
 *
 * The list will contain all Tokens & Coins from OFT, WrappedToken and Stargate
 * configurations
 *
 * @param lzAppConfig AppConfig
 * @returns Currency[]
 */
function getCurrenciesFromLzAppConfig(lzAppConfig: AppConfig): Currency[] {
  return uniqBy(
    [
      ...lzAppConfig.bridge.oft.flatMap(getCurrenciesFromOftBridgeConfig),
      ...lzAppConfig.bridge.wrappedToken.flatMap((c) => c.tokens.flat()),
    ],
    currencyKey,
  );
}

function getCurrenciesFromOftBridgeConfig(oftBridgeConfig: OftBridgeConfig) {
  const tokens: Currency[] = oftBridgeConfig.tokens.slice();
  for (const native of oftBridgeConfig.native ?? []) {
    tokens.push(getNativeCurrency(native.chainId));
  }
  return tokens;
}

/**
 * Creates a list of deduplicated chain IDs from AppConfig object
 *
 * The list will contain all Tokens & Coins from OFT, WrappedToken
 * configurations
 *
 * @param lzAppConfig AppConfig
 * @returns Currency[]
 */
function getChainsFromLzAppConfig(lzAppConfig: AppConfig): ChainId[] {
  return Array.from(
    new Set(
      [
        ...lzAppConfig.bridge.oft.flatMap((c) => c.tokens),
        ...lzAppConfig.bridge.onft.flatMap((c) => c.contracts),
        ...lzAppConfig.bridge.wrappedToken.flatMap((c) => c.tokens.flat()),
      ].map((t) => t.chainId),
    ),
  );
}

function supportsStargateOftWrapper(config: OftBridgeConfig) {
  if (config.version === 0) return false;
  if (config.direct) return false;

  return config.tokens.some(({chainId}) => STARGATE_WRAPPER_SUPPORTED_CHAINS.has(chainId));
}

function getStargateWrapperConfig(lzAppConfig: AppConfig): Omit<OftWrapperBridgeConfig, 'oft'> {
  const partnerConfig = lzAppConfig.bridge.stargate?.partner;
  const wrapperConfig = partnerConfig?.partnerId
    ? {
        partnerId: partnerConfig.partnerId,
        caller: partnerConfig.feeCollector ?? constants.AddressZero,
        callerBps: partnerConfig.feeCollector ? Math.ceil(partnerConfig.feeBps ?? 0) : 0,
        wrapper: oftWrapperConfig,
      }
    : {
        partnerId: 0,
        caller: constants.AddressZero,
        callerBps: 0,
        wrapper: oftWrapperConfig,
      };

  return wrapperConfig;
}

// These are the known stargate wrapper contracts
//
// For now we only support mainnet wrappers
const STARGATE_WRAPPER_SUPPORTED_CHAINS: Set<ChainId> = new Set(
  oftWrapperConfig.map(({chainId}) => chainId),
);
