import {chainKeyToEndpointId} from '@layerzerolabs/ui-core';
import {useEffect} from 'react';

import {walletStore} from '@/core/stores/walletStore';
import {gasDropStore} from '@/gas/stores/gasDropStore';

export function useDefaultSrcChain() {
  const {chainKey} = walletStore.evm ?? {};
  // todo: assign tokens to chainKey instead of chainId
  const chainId = chainKey ? chainKeyToEndpointId(chainKey, 1) : undefined;
  useEffect(() => {
    if (!chainId) return;
    if (gasDropStore.srcChainId) return;
    if (gasDropStore.chains.includes(chainId)) {
      gasDropStore.setSrcChainId(chainId);
    } else {
      gasDropStore.setSrcChainId(gasDropStore.chains.at(0));
    }
  }, [chainId]);
}
