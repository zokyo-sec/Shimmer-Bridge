import {tryGetNetwork} from '@layerzerolabs/ui-core';
import {observer} from 'mobx-react';

import {fiatStore} from '@/core/stores/fiatStore';
import {Alert, AlertType} from '@/core/ui/Alert';
import {Box} from '@/core/ui/system';
import {gasDropStore} from '@/gas/stores/gasDropStore';

export const Alerts = observer(() => {
  const {srcChainId, srcWallet} = gasDropStore;
  const item = gasDropStore.items.at(0);

  return (
    <Alert
      key='transfer'
      open={gasDropStore.isExecuting}
      type={AlertType.LOADING}
      title={
        srcWallet?.isSwitchingChain
          ? 'Switch chain'
          : gasDropStore.isMining
          ? 'Submitting transaction'
          : 'Confirm in your wallet'
      }
    >
      <div>
        Transferring {item?.dstAmount?.toSignificant()}{' '}
        {fiatStore.getSymbol(item?.dstAmount?.currency)} from {tryGetNetwork(srcChainId)?.name} to{' '}
        {tryGetNetwork(item?.dstChainId)?.name}
      </div>

      <Box color='text.secondary' typography='p3' sx={{mt: 3}}>
        {srcWallet?.isSwitchingChain ? (
          'Please check pending wallet actions if you did not receive a transaction prompt.'
        ) : gasDropStore.isSigning ? (
          'Please check pending wallet actions if you did not receive a transaction prompt.'
        ) : gasDropStore.isMining ? (
          'Waiting for blockchain confirmation...'
        ) : (
          <>&nbsp;</>
        )}
      </Box>
    </Alert>
  );
});
