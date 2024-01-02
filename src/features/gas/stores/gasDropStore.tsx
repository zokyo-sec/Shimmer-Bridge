import {ChainId} from '@layerzerolabs/lz-sdk';
import {waitForAllMessagesReceived} from '@layerzerolabs/scan-client';
import {
  Currency,
  CurrencyAmount,
  DstConfigProvider,
  FeeQuote,
  getExpectedDate,
  getNativeCurrency,
  getScanLink,
  isEvmChainId,
  Percent,
  sumUnsafe,
  tryParseCurrencyAmount,
} from '@layerzerolabs/ui-core';
import {GasDropBridge, GasDropInput, QuoteInput, QuoteOutput} from '@layerzerolabs/ui-gas-drop';
import {ActiveWallet, assertWallet} from '@layerzerolabs/ui-wallet';
import assert from 'assert';
import {Signer} from 'ethers';
import {action, autorun, computed, flow, makeAutoObservable} from 'mobx';
import {fromPromise} from 'mobx-utils';
import {toast} from 'react-toastify';

import {balanceStore} from '@/core/stores/balanceStore';
import {lzConfigStore} from '@/core/stores/lzStore';
import {transactionStore} from '@/core/stores/transactionStore';
import {getWalletBalance} from '@/core/stores/utils';
import {walletStore} from '@/core/stores/walletStore';
import {Toast} from '@/core/ui/Toast';
import {FromPromise, fromPromiseValue} from '@/core/utils/fromPromise';
import {handleError} from '@/core/utils/handleError';
import {parseWalletError} from '@/core/utils/parseWalletError';

export type ValidationError = string;

export enum InputField {
  SRC = 'SRC',
  DST = 'DST',
}

export class GasDropItem {
  protected readonly promise = {
    // pure message cost without any gas conversion
    quote: undefined as undefined | FromPromise<QuoteOutput>,
    minSrcAmount: undefined as undefined | FromPromise<CurrencyAmount>,
    maxSrcAmount: undefined as undefined | FromPromise<CurrencyAmount>,
  };

  public readonly form = {
    input: InputField.SRC,
    dstAddress: '',
    amount: '',
    dstChainId: undefined as ChainId | undefined,
  };

  constructor(protected gasDropStore: GasDropStore) {
    makeAutoObservable(
      this,
      {
        updateQuote: action,
        srcAmount: computed.struct,
        dstAmount: computed.struct,
        srcBalance: computed.struct,
        dstBalance: computed.struct,
        minSrcAmount: computed.struct,
        maxDstAmount: computed.struct,
      },
      {
        deep: true,
      },
    );

    autorun(() => {
      // react on changes of following properties
      if (this.srcChainId && this.dstChainId && this.form.amount && this.form.input) {
        this.updateQuote();
      }
    });

    autorun(() => {
      if (this.srcChainId && this.dstChainId) {
        this.updateMinSrcAmount();
      }
    });

    autorun(() => {
      if (this.srcChainId && this.dstChainId) {
        this.updateMaxSrcAmount();
      }
    });
  }

  get quote(): QuoteOutput | undefined {
    return fromPromiseValue(this.promise.quote);
  }

  get srcChainId(): ChainId | undefined {
    return this.gasDropStore.srcChainId;
  }

  get srcCurrency(): Currency | undefined {
    if (!this.srcChainId) return undefined;
    return getNativeCurrency(this.srcChainId);
  }

  get dstCurrency(): Currency | undefined {
    if (!this.dstChainId) return undefined;
    return getNativeCurrency(this.dstChainId);
  }

  get srcCost(): FeeQuote | undefined {
    return this.quote?.fee;
  }

  get srcBalance(): CurrencyAmount | undefined {
    const {srcCurrency, srcAddress} = this;
    if (!srcAddress) return undefined;
    if (!srcCurrency) return undefined;
    return balanceStore.getBalance(srcCurrency, srcAddress);
  }

  get dstBalance(): CurrencyAmount | undefined {
    const {dstCurrency, dstAddress} = this;
    if (!dstAddress) return undefined;
    if (!dstCurrency) return undefined;
    return balanceStore.getBalance(dstCurrency, dstAddress);
  }

  get srcAddress(): string | undefined {
    return this.gasDropStore.srcAddress;
  }

  get dstAddress(): string | undefined {
    if (this.form.dstAddress) {
      return this.form.dstAddress;
    }
    return this.gasDropStore.srcAddress;
  }

  get maxDstAmount(): CurrencyAmount | undefined {
    const {srcChainId, dstChainId} = this;
    if (!srcChainId) return undefined;
    if (!dstChainId) return undefined;
    return lzConfigStore.getDstConfig(srcChainId, dstChainId)?.dstNativeAmtCap;
  }

  public setDstAmount(amount: string) {
    this.form.input = InputField.DST;
    this.form.amount = amount;
  }

  public setSrcAmount(amount: string) {
    this.form.input = InputField.SRC;
    this.form.amount = amount;
  }

  public setDstChainId(chainId: ChainId) {
    this.form.dstChainId = chainId;
  }

  setMaxSrcAmount = () => {
    const {srcBalance, maxSrcAmount} = this;

    // No maximum no action
    if (maxSrcAmount == null) return;

    if (srcBalance == null || srcBalance.greaterThan(maxSrcAmount)) {
      // If we don't have any balance or the balance is larger than the maximum amount,
      // just use the maximum amount without capping it
      this.setSrcAmount(maxSrcAmount.toFixed(6));
    } else {
      // If the balance is lower than the maximum, just use balance
      this.setSrcAmount(srcBalance.toFixed(6));
    }
  };

  setMaxDstAmount = () => {
    const {maxDstAmount} = this;
    if (!maxDstAmount) return;
    this.form.input = InputField.DST;
    this.form.amount = maxDstAmount.toFixed(6);
  };

  get dstChainId(): ChainId | undefined {
    return this.form.dstChainId;
  }

  get srcAmount(): CurrencyAmount | undefined {
    if (!this.srcChainId) return undefined;
    if (this.form.amount === '') return undefined;

    if (this.form.input === InputField.SRC) {
      return tryParseCurrencyAmount(this.srcCurrency, this.form.amount);
    }

    if (this.form.input === InputField.DST) {
      return fromPromiseValue(this.promise.quote)?.srcAmount;
    }

    return undefined;
  }

  get dstAmount(): CurrencyAmount | undefined {
    if (!this.dstChainId) return undefined;
    if (this.form.amount === '') return undefined;

    if (this.form.input === InputField.DST) {
      return tryParseCurrencyAmount(this.dstCurrency, this.form.amount);
    }

    if (this.form.input === InputField.SRC) {
      const dstAmount = fromPromiseValue(this.promise.quote)?.dstAmount;
      if (!dstAmount) return undefined;
      if (dstAmount.lessThan(0)) return dstAmount.multiply(0);
      return dstAmount;
    }

    return undefined;
  }

  get minSrcAmount(): CurrencyAmount | undefined {
    return fromPromiseValue(this.promise.minSrcAmount);
  }

  get maxSrcAmount(): CurrencyAmount | undefined {
    return fromPromiseValue(this.promise.maxSrcAmount);
  }

  get isUpdatingQuote(): boolean {
    return this.promise.quote?.state === 'pending';
  }

  updateMinSrcAmount = action(async () => {
    this.promise.minSrcAmount = undefined;
    const {srcChainId, dstChainId} = this;
    const bridge = this.gasDropStore.bridge;
    assert(srcChainId);
    assert(dstChainId);
    assert(bridge);
    this.promise.minSrcAmount = fromPromise(bridge.getMinSrcAmount(srcChainId, dstChainId));
  });

  updateMaxSrcAmount = action(async () => {
    this.promise.maxSrcAmount = undefined;
    const {srcChainId, dstChainId} = this;
    const bridge = this.gasDropStore.bridge;
    assert(srcChainId);
    assert(dstChainId);
    assert(bridge);
    this.promise.maxSrcAmount = fromPromise(bridge.getMaxSrcAmount(srcChainId, dstChainId));
  });

  updateQuote = action(async () => {
    // reset
    this.promise.quote = undefined;
    const {dstChainId, srcChainId, srcAmount, dstAmount, form} = this;
    const bridge = this.gasDropStore.bridge;

    assert(srcChainId, 'srcChainId');
    assert(dstChainId, 'dstChainId');
    assert(bridge, 'bridge');
    if (form.input === InputField.SRC) {
      assert(srcAmount, 'srcAmount');
      const input: QuoteInput = {
        srcAmount,
        srcChainId,
        dstChainId,
      };
      return (this.promise.quote = fromPromise(bridge.getQuote(input)));
    } else if (form.input === InputField.DST) {
      assert(dstAmount, 'dstAmount');
      const input: QuoteInput = {
        dstAmount,
        srcChainId,
        dstChainId,
      };
      return (this.promise.quote = fromPromise(bridge.getQuote(input)));
    }
    throw new Error('Unexpected error');
  });
}

export class GasDropStore {
  public bridge: GasDropBridge | undefined = undefined;
  public isExecuting = false;
  public isSigning = false;
  public isMining = false;

  public items: GasDropItem[] = [];
  public srcChainId: ChainId | undefined = undefined;

  public dstConfigProviders: DstConfigProvider[] = [];

  get native(): Currency[] {
    return this.chains.map((chainId) => getNativeCurrency(chainId));
  }

  get srcCurrency(): Currency | undefined {
    if (!this.srcChainId) return undefined;
    return getNativeCurrency(this.srcChainId);
  }

  get srcCurrencyOptions(): CurrencyOption[] {
    return this.native.map((currency) => {
      const disabled = false;
      const balance = getWalletBalance(currency);
      const isZero = !balance || balance?.equalTo(0);
      return {
        currency,
        disabled,
        overlay: disabled && !isZero ? 'Not available' : undefined,
      };
    });
  }

  get dstCurrencyOptions(): CurrencyOption[] {
    return this.native.map((currency) => {
      const disabled = false;
      const balance = getWalletBalance(currency);
      const isZero = !balance || balance?.equalTo(0);
      return {
        currency,
        disabled,
        overlay: disabled && !isZero ? 'Not available' : undefined,
      };
    });
  }

  get chains(): ChainId[] {
    if (!this.bridge) return [];
    // todo: support multiple bridges
    return this.bridge.config.chains;
  }

  constructor() {
    makeAutoObservable(
      this,
      {
        isMining: true,
        isExecuting: true,
        isSigning: true,
        items: true,
        srcChainId: true,
        srcWallet: true,
        srcAddress: true,
        srcCurrency: computed.struct,
        srcAmount: computed.struct,
        srcNativeBalance: computed.struct,
        errors: computed.struct,
        slippage: computed.struct,
        native: computed.struct,
        chains: computed.struct,
        fee: computed.struct,
        srcCurrencyOptions: computed.struct,
        dstCurrencyOptions: computed.struct,
        updateLimit: action,
      },
      {autoBind: true},
    );
  }

  protected disposers: (() => void)[] = [];
  subscribe = () => {
    if (this.disposers.length === 0) {
      this.disposers = [
        autorun(() => {
          const {srcChainId} = this;
          if (!srcChainId) return;
          this.updateLimit();
        }),
        autorun(() => {
          const {srcAddress} = this;
          if (!srcAddress) return;
          this.updateBalances();
        }),
      ];
    }
  };

  unsubscribe = () => {
    this.disposers.forEach((disposer) => disposer());
    this.disposers = [];
  };

  get srcAmount(): CurrencyAmount | undefined {
    // adding slippage
    const {fee, slippage} = this;
    if (!fee) return undefined;
    if (!slippage) return undefined;
    return fee.nativeFee.multiply(new Percent(100, 100).add(slippage));
  }

  get slippage(): Percent | undefined {
    return new Percent(1, 100);
  }

  get srcNativeBalance(): CurrencyAmount | undefined {
    const {srcAddress, srcChainId} = this;
    if (!srcChainId) return undefined;
    if (!srcAddress) return undefined;
    const native = getNativeCurrency(srcChainId);
    return balanceStore.getBalance(native, srcAddress);
  }

  get srcAddress(): string | undefined {
    return this.srcWallet?.address;
  }

  get srcWallet(): ActiveWallet<Signer> | undefined {
    return walletStore.evm;
  }

  get fee(): FeeQuote | undefined {
    const nativeFee = this.items.map((i) => i.srcCost?.nativeFee);
    const totalFee = sumUnsafe(nativeFee);
    if (!totalFee) return undefined;
    return {
      nativeFee: totalFee,
      zroFee: totalFee.multiply(0),
    };
  }

  get errors() {
    const errors: ValidationError[] = [];
    function addError(error: string) {
      errors.push(error);
    }

    if (this.srcAmount && this.srcNativeBalance) {
      if (this.srcAmount.greaterThan(this.srcNativeBalance)) {
        addError('Insufficient funds');
      }
    }

    for (const item of this.items) {
      if (item.srcChainId === item.dstChainId) {
        addError('Select different network');
      }
      if (!item.dstAmount) {
        if (item.isUpdatingQuote) addError('Getting a quote');
        else addError('Enter amount');
      } else if (item.dstAmount.equalTo(0)) {
        addError('Enter bigger amount');
      }
      if (!item.maxDstAmount) {
        addError('Checking limits');
      }
      if (item.dstAmount && item.maxDstAmount) {
        if (item.dstAmount.greaterThan(item.maxDstAmount)) {
          addError('Amount exceeds limit');
        }
      }
    }
    return errors;
  }

  switch() {
    const {srcChainId} = this;
    this.srcChainId = undefined;
    for (const item of this.items) {
      const dstChainId = item.dstChainId;
      if (!this.srcChainId && dstChainId) {
        this.srcChainId = dstChainId;
      }
      item.form.dstChainId = srcChainId;
    }
  }

  setSrcChainId(chainId: number | undefined) {
    this.srcChainId = chainId;
  }

  setBridge(bridge: GasDropBridge) {
    this.bridge = bridge;
  }

  addItem(form: Partial<{dstChainId: ChainId; dstAmount: string}> = {}) {
    const item = new GasDropItem(this);
    if (form.dstChainId) item.setDstChainId(form.dstChainId);
    if (form.dstAmount) item.setDstAmount(form.dstAmount);
    this.items.push(item);
    return item;
  }

  delItem(item: GasDropItem) {
    this.items = this.items.filter((i) => i !== item);
  }

  transfer = flow(function* (this: GasDropStore) {
    assert(this.isExecuting === false);
    try {
      this.isExecuting = true;
      const {srcWallet, srcAddress, srcChainId, bridge, fee, srcAmount} = this;
      assert(srcWallet);
      assert(srcAddress);
      assert(srcChainId);
      assert(bridge);
      assert(fee);
      assert(srcAmount);

      const items: GasDropInput['items'] = this.items.map((item) => ({
        dstAddress: item.dstAddress!,
        dstAmount: item.dstAmount!,
        dstChainId: item.dstChainId!,
      }));

      const input: GasDropInput = {
        fee,
        srcAmount,
        srcChainId,
        srcAddress,
        items,
      };

      yield srcWallet.switchChain(input.srcChainId);

      const unsignedTx: Awaited<ReturnType<(typeof bridge)['transfer']>> = yield bridge.transfer(
        input,
      );

      // ensure sending from correct wallet
      yield assertWallet(srcWallet, {address: srcAddress, chainId: srcChainId});

      this.isSigning = true;
      const response: Awaited<ReturnType<(typeof unsignedTx)['signAndSubmitTransaction']>> =
        yield unsignedTx.signAndSubmitTransaction(srcWallet.signer);
      this.isSigning = false;

      this.isMining = true;

      const receipt: Awaited<ReturnType<(typeof response)['wait']>> = yield response.wait();

      this.isMining = false;

      toast.success(
        <Toast>
          <h1>Transaction Submitted</h1>
          <p>
            <a href={getScanLink(srcChainId, receipt.txHash)} target='_blank' rel='noreferrer'>
              View on block explorer
            </a>
          </p>
        </Toast>,
      );

      for (const item of items) {
        const txHistoryEntry = transactionStore.create({
          chainId: srcChainId,
          txHash: receipt.txHash,
          type: 'GAS',
          input,
          expectedDate: getExpectedDate(srcChainId, item.dstChainId),
        });
        // todo: correct support support for granular message status update
        waitForAllMessagesReceived(srcChainId, response.txHash).then((messages) => {
          // todo: find exact match
          const message = messages.find((m) => m.dstChainId === item.dstChainId);
          txHistoryEntry.update({
            completed: true,
            confirmation: {
              chainId: item.dstChainId,
              txHash: message?.dstTxHash!,
            },
          });
        });
      }
    } catch (e) {
      handleError(e, () => {
        const {message, title} = parseWalletError(e);
        toast.error(
          <Toast>
            <h1>{title}</h1>
            <p>{message}</p>
          </Toast>,
        );
      });
      throw e;
    } finally {
      this.isSigning = false;
      this.isExecuting = false;
      yield this.updateBalances();
    }
  });

  updateLimit() {
    const {srcChainId, chains} = this;
    assert(srcChainId);
    for (const dstChainId of chains) {
      if (dstChainId === srcChainId) continue;
      if (lzConfigStore.getDstConfig(srcChainId, dstChainId)) continue;
      lzConfigStore.updateDstConfig(srcChainId, dstChainId);
    }
  }

  async estimateGasCost() {
    const {srcChainId, srcAddress, bridge, errors} = this;
    assert(srcChainId);
    assert(srcAddress);
    assert(bridge);
    assert(errors.length === 0);

    const items: GasDropInput['items'] = this.items.map((item) => ({
      dstAddress: item.dstAddress!,
      dstAmount: item.dstAmount!,
      dstChainId: item.dstChainId!,
    }));

    const input: Omit<GasDropInput, 'fee' | 'srcAddress' | 'srcAmount'> = {
      srcChainId,
      items,
    };
    const fee = await bridge.estimateSendFee(input);
    return fee;
  }

  async updateBalances() {
    const {evm} = walletStore;
    const {native} = this;
    const promises = native.map((token) => {
      if (evm && isEvmChainId(token.chainId)) {
        balanceStore.updateBalance(token, evm.address);
      }
    });
    return Promise.allSettled(promises);
  }

  addProviders(providers: DstConfigProvider[]) {
    this.dstConfigProviders.push(...providers);
  }
}

type CurrencyOption = {
  currency: Currency;
  disabled?: boolean;
  valid?: boolean;
  overlay?: React.ReactNode;
};

export const gasDropStore = new GasDropStore();
