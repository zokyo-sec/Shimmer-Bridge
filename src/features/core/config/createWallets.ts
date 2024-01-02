import {ChainId} from '@layerzerolabs/lz-sdk';
import {toEvmChainId} from '@layerzerolabs/ui-core';
import {Wallet} from '@layerzerolabs/ui-wallet';
import {
  BraveWallet,
  CoinbaseWallet,
  CoreWallet,
  MetaMaskWallet,
  PhantomWallet as PhantomWalletEvm,
  WalletConnect,
} from '@layerzerolabs/ui-wallet-evm';

export function createWallets(chains: ChainId[]): Record<string, Wallet<unknown>> {
  const wallets: Record<string, Wallet<unknown>> = {};

  // evm
  wallets.metamaskWallet = new MetaMaskWallet();
  wallets.coinbaseWallet = new CoinbaseWallet();
  wallets.coreWallet = new CoreWallet();
  wallets.braveWallet = new BraveWallet();
  wallets.walletConnect = new WalletConnect({
    projectId: '10b5df65476df304efbb9a6b0c42f8b0',
    chains: [], // do not require any chains!
    optionalChains: chains.map(toEvmChainId) as [number, ...number[]],
    showQrModal: true,
  });
  wallets.phantomEvm = new PhantomWalletEvm();

  if (typeof window !== 'undefined') {
    Object.values(wallets).forEach((wallet) =>
      wallet.autoConnect().catch(() => {
        // could not auto connect
      }),
    );
  }

  return wallets;
}
