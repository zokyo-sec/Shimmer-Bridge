import {isToken} from '@layerzerolabs/ui-core';
import {
  createFailoverProviderFactory,
  createMulticallProviderFactory,
  ERC20__api,
} from '@layerzerolabs/ui-evm';
import {describe, expect, test} from 'vitest';

import {wrappedTokenBridge} from './config';

describe(
  'config',
  () => {
    const providerFactory = createMulticallProviderFactory(createFailoverProviderFactory());
    const erc20 = new ERC20__api(providerFactory);
    const tokens = wrappedTokenBridge.tokens.flat().filter(isToken);

    test.concurrent.each(tokens)('$symbol:$chainId:$address', async (tokenDefinition) => {
      const actualDefinition = await erc20.getToken(tokenDefinition);
      expect(actualDefinition).toEqual(tokenDefinition);
    });
  },
  {timeout: 20_000},
);
