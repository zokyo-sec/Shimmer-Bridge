import type {TransferInput} from '@layerzerolabs/ui-bridge-sdk';
import {formatCurrencyAmount} from '@layerzerolabs/ui-core';
import {observer} from 'mobx-react';

import {Transaction} from '@/core/stores/transactionStore';
import {uiStore} from '@/core/stores/uiStore';
import {walletStore} from '@/core/stores/walletStore';

import {Tracker as TrackerBase, TrackerProps} from '@/core/ui/Tracker';
import {TrackerCarousel, TrackerCarouselProps} from '@/core/ui/TrackerCarousel';

export type BridgeTrackerProps = Omit<TrackerCarouselProps, 'txs'>;

export const BridgeTracker: React.FC<BridgeTrackerProps> = observer((props) => {
  return (
    <TrackerCarousel
      {...props}
      txs={uiStore.txProgress.transactions}
      renderTracker={renderTracker}
    />
  );
});

function renderTracker(tx: Transaction) {
  return <Tracker tx={tx} key={tx.txHash} />;
}

function isTransferInput(input: unknown): input is TransferInput {
  if (!input) return false;
  const tx = input as TransferInput;
  // naive
  return Boolean(tx.srcChainId && tx.dstChainId && tx.srcAddress && tx.dstAddress && tx.amount);
}

export const Tracker: React.FC<TrackerProps> = observer(({tx, ...props}) => {
  const input = tx.input;
  if (!isTransferInput(input)) {
    // default on close if txHash provided
    const onClose =
      props.onClose ?? tx.txHash ? () => uiStore.txProgress.dismiss(tx.txHash) : undefined;
    return <TrackerBase tx={tx} {...props} onClose={onClose} />;
  }

  const isDstWalletConnected = walletStore.active.some((w) => w.address === input.dstAddress);

  return (
    <TrackerBase
      {...props}
      tx={tx}
      onClose={tx.completed || tx.error ? () => uiStore.txProgress.dismiss(tx.txHash) : undefined}
    >
      {input.amount ? formatCurrencyAmount(input.amount) + ' ' + input.amount.currency.symbol : ''}
    </TrackerBase>
  );
});
