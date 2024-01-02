import {tryGetNetwork} from '@layerzerolabs/ui-core';
import {observer} from 'mobx-react';
import {useEffect} from 'react';

import {CurrencySelect} from '@/bridge/ui/CurrencySelect';
import {fiatStore} from '@/core/stores/fiatStore';
import {uiStore} from '@/core/stores/uiStore';
import {Button} from '@/core/ui/Button';
import {Details} from '@/core/ui/Details';
import {Input, InputAdornment} from '@/core/ui/Input';
import {InputsGroup} from '@/core/ui/InputsGroup';
import {SwapButton} from '@/core/ui/SwapButton';
import {Box} from '@/core/ui/system';
import {Alerts} from '@/gas/ui/Alerts';

import {useDefaultSrcChain} from '../hooks/useDefaultSrcChain';
import {gasDropStore, InputField} from '../stores/gasDropStore';

export const GasBridge = observer(() => {
  const {isExecuting, srcWallet, errors, items} = gasDropStore;

  const item = items.at(0);

  const [error] = errors;

  const {srcCurrency, dstCurrency} = item ?? {};
  const srcChain = tryGetNetwork(gasDropStore.srcChainId);
  const dstChain = tryGetNetwork(item?.dstChainId);

  const outputAmount = item?.dstAmount;
  const outputFiat = fiatStore.getFiatAmount(outputAmount);

  useDefaultSrcChain();

  useEffect(() => {
    if (gasDropStore.items.length === 0) {
      const dstChainId = gasDropStore.chains.find((chainId) => chainId !== gasDropStore.srcChainId);
      gasDropStore.addItem({
        dstChainId,
      });
    }
  }, [item]);

  return (
    <Box display='flex' flexDirection='column'>
      <InputsGroup>
        <InputsGroup.Top>
          <CurrencySelect
            sx={{flex: 2}}
            label={srcChain?.name ?? 'From'}
            title='From'
            options={gasDropStore.srcCurrencyOptions}
            value={srcCurrency}
            onSelect={(currency) => gasDropStore.setSrcChainId(currency.chainId)}
          />
        </InputsGroup.Top>
        <InputsGroup.Bottom>
          <Input
            size='lg'
            value={
              (item?.form.input === InputField.SRC
                ? item.form.amount
                : item?.srcAmount?.toFixed(6)) ?? ''
            }
            onChange={(event) => item?.setSrcAmount(event.target.value)}
            startAdornment={
              <Button size='xs' variant='tertiary' onClick={item?.setMaxSrcAmount}>
                Max
              </Button>
            }
            endAdornment={
              <InputAdornment>
                <Box typography='p3' sx={{gap: 1, display: 'flex'}}>
                  <Box component='span' color='text.secondary'>
                    {item?.srcBalance?.currency.symbol}
                  </Box>
                </Box>
                <Box color='text.secondary' typography='p3'>
                  {item?.srcBalance?.toFixed(6) ?? '--'}
                </Box>
              </InputAdornment>
            }
          />
        </InputsGroup.Bottom>
      </InputsGroup>
      <SwapButton onClick={gasDropStore.switch} />
      <InputsGroup>
        <InputsGroup.Top>
          <CurrencySelect
            sx={{flex: 2}}
            label={dstChain?.name ?? 'To'}
            title='To'
            options={gasDropStore.dstCurrencyOptions}
            onSelect={(currency) => item?.setDstChainId(currency.chainId)}
            value={dstCurrency}
          />
        </InputsGroup.Top>
        <InputsGroup.Bottom>
          <Input
            size='lg'
            value={
              (item?.form.input === InputField.DST
                ? item.form.amount
                : item?.dstAmount?.toFixed(6)) ?? ''
            }
            onChange={(event) => item?.setDstAmount(event.target.value)}
            startAdornment={
              <Button size='xs' variant='tertiary' onClick={item?.setMaxDstAmount}>
                Max
              </Button>
            }
            endAdornment={
              <InputAdornment>
                <Box typography='p3' sx={{gap: 1, display: 'flex'}}>
                  <Box component='span' color='text.secondary'>
                    {item?.dstBalance?.currency.symbol}
                  </Box>
                </Box>
                <Box color='text.secondary' typography='p3'>
                  {item?.dstBalance?.toFixed(6) ?? '--'}
                </Box>
              </InputAdornment>
            }
          />
        </InputsGroup.Bottom>
      </InputsGroup>
      <Details
        sx={{my: '24px'}}
        items={[
          {
            label: 'You will receive',
            value: outputAmount
              ? `${outputAmount.toFixed(6)} ${fiatStore.getSymbol(outputAmount.currency)}` +
                (outputFiat ? ` ≈ ${outputFiat.value.toFixed(2)} ${outputFiat.currency}` : '')
              : '--',
          },
        ]}
      />
      {srcWallet?.address ? (
        error ? (
          <Button variant='primary' type='button' disabled>
            {error}
          </Button>
        ) : isExecuting ? (
          <Button variant='primary' type='button'>
            Sending ...
          </Button>
        ) : (
          <Button variant='primary' type='button' onClick={gasDropStore.transfer}>
            Transfer
          </Button>
        )
      ) : (
        <Button variant='primary' type='button' onClick={uiStore.walletModal.open}>
          Connect
        </Button>
      )}
      <Alerts />
    </Box>
  );
});
