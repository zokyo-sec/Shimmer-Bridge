import {Wallet} from '@layerzerolabs/ui-wallet';
import {groupBy} from 'lodash-es';
import {observer} from 'mobx-react';
import React, {useEffect, useRef, useState} from 'react';

import {transactionStore} from '@/core/stores/transactionStore';
import {uiStore, WalletTab} from '@/core/stores/uiStore';
import {walletStore} from '@/core/stores/walletStore';
import {Button} from '@/core/ui/Button';
import {Icon} from '@/core/ui/Icon';
import {Input} from '@/core/ui/Input';
import {Modal, ModalProps} from '@/core/ui/Modal';
import {Box, SxProps} from '@/core/ui/system';
import {Tabs} from '@/core/ui/Tabs';
import {WalletIcon} from '@/core/ui/WalletIcon';
import {formatAddress} from '@/core/utils/formatAddress';

import {TransactionItem} from './TransactionItem';

export type AccountModalProps = Omit<ModalProps, 'title' | 'children'> & {title?: string};

export const AccountModal = observer(({title = 'Connect Wallet', ...props}: AccountModalProps) => {
  const {...modalProps} = props;
  const {wallets} = walletStore;

  const walletGroups = Object.entries(
    groupBy(Object.values(wallets), (wallet) => wallet.chainType),
  ).map(([chainType, wallets]) => {
    const connected = wallets.find((w) => w.isConnected || w.isConnecting);

    return {
      chainType: chainType,
      active: connected,
      wallets: connected ? [connected] : wallets,
    };
  });

  return (
    <Modal title={title} overlay {...modalProps}>
      <Tabs
        activeTab={uiStore.walletModal.activeTab}
        setActiveTab={(tab) => uiStore.walletModal.setActiveTab(tab as WalletTab)}
        sx={{mx: 2}}
      >
        <Tabs.Tab title={WalletTab.WALLET}>
          <Box sx={{width: '100%'}}>
            {walletGroups.map((group) => (
              <WalletGroup
                key={group.chainType}
                isConnected={group.active?.isConnected || false}
                onDisconnect={group.active?.disconnect}
                heading={
                  <Box typography='p3' color='text.secondary'>
                    {group.chainType}
                  </Box>
                }
              >
                {group.wallets.map((wallet) => {
                  return <WalletItem key={wallet.type} wallet={wallet} />;
                })}
              </WalletGroup>
            ))}
          </Box>
          <Box sx={{mt: 'auto', pb: 2}}>
            <Box component='span' typography='p3' sx={{mr: 0.5}} color='text.secondary'>
              Is this your first time?
            </Box>
            <Box
              component='a'
              href='https://wiki.iota.org/get-started/tools/shimmer-bridge'
              target='_blank'
              color='primary.main'
              typography='p3'
            >
              Learn more
            </Box>
          </Box>
        </Tabs.Tab>

        <Tabs.Tab title={WalletTab.TRANSACTIONS}>
          <Box sx={{width: '100%'}}>
            {transactionStore.recentTransactions.map((tx, index) => (
              <TransactionItem tx={tx} key={tx.txHash ?? index} />
            ))}
          </Box>
        </Tabs.Tab>
      </Tabs>
    </Modal>
  );
});

type WalletGroupProps = React.PropsWithChildren<{
  heading: React.ReactNode;
  isConnected?: boolean;
  onDisconnect?: () => void;
  onPasteAccount?: (value: string) => void;
  sx?: SxProps;
}>;

const WalletGroup: React.FC<WalletGroupProps> = ({
  children,
  heading,
  isConnected,
  onDisconnect,
  onPasteAccount,
  sx,
}) => {
  const [isPaste, setIsPaste] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isPaste) inputRef.current?.focus();
  }, [isPaste]);
  return (
    <Box sx={sx}>
      <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
        {heading}
        <Box>
          {isConnected ? (
            <Button variant='incognito' onClick={onDisconnect}>
              <Box typography='p3' color='text.secondary'>
                Disconnect
              </Box>
            </Button>
          ) : onPasteAccount ? (
            <Button variant='incognito' onClick={() => setIsPaste(!isPaste)}>
              <Box typography='p3' color='text.secondary'>
                or{' '}
              </Box>
              <Box typography='p3'>{isPaste ? 'Connect Wallet' : 'Paste Account'}</Box>
            </Button>
          ) : null}
        </Box>
      </Box>
      <Box sx={{mt: 1}}>
        <Input
          ref={inputRef}
          size='md'
          placeholder='Paste Address'
          endAdornment={<InputStateAdornment type='success' />}
          sx={{height: 56, display: isPaste ? undefined : 'none'}}
        />

        {!isPaste && children}
      </Box>
    </Box>
  );
};

const InputStateAdornment: React.FC<{type?: 'pending' | 'success' | 'error'}> = ({type}) => {
  if (!type) {
    return null;
  }
  if (type === 'pending') {
    return <Icon type='spinner' size={16} />;
  }
  if (type === 'success') {
    return <Icon type='checkmark' size={16} sx={{color: (t) => t.palette.success.main}} />;
  }
  if (type === 'error') {
    return <Icon type='info' size={16} sx={{color: (t) => t.palette.warning.main}} />;
  }
  return null;
};

const WalletItem: React.FC<{
  wallet: Wallet<unknown>;
}> = observer(({wallet}) => {
  return (
    <Button
      variant='incognito'
      onClick={wallet.isConnected ? wallet.disconnect : wallet.connect}
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        padding: 1.5,
        mb: 1,
      }}
    >
      <WalletIcon type={wallet.type} />
      <Box typography='p2' sx={{ml: 2}}>
        {wallet.isConnecting
          ? 'Connecting...'
          : wallet.isConnected && wallet.address
          ? `${formatAddress(wallet.address, 16)}`
          : wallet.isAvailable
          ? `Connect ${wallet.type}`
          : `Get ${wallet.type} Wallet`}
      </Box>
    </Button>
  );
});
