import {chainKeyToEndpointId, Token} from '@layerzerolabs/ui-core';
import {
  createFailoverProviderFactory,
  createMulticallProviderFactory,
  ERC20__api,
} from '@layerzerolabs/ui-evm';
import fs from 'fs';
import path from 'path';

main('shimmer', [
  // put addresses here
  '0x4638C9fb4eFFe36C49d8931BB713126063BF38f9',
  '0x2A6F394085B8E33fbD9dcFc776BCE4ed95F1900D',
  '0xE6373A7Bb9B5a3e71D1761a6Cb4992AD8537Bf28',
  '0xEAf8553fD72417C994525178fC917882d5AEc725',
  '0xb0119035d08CB5f467F9ed8Eae4E5f9626Aa7402',
  '0xeCE555d37C37D55a6341b80cF35ef3BC57401d1A',
  '0xa4f8C7C1018b9dD3be5835bF00f335D9910aF6Bd',
])
  // save to file
  .then((tokens) => save('shimmer.json', tokens));

async function main(chainKey: string, addresses: string[]) {
  const providerFactory = createMulticallProviderFactory(createFailoverProviderFactory());
  const chainId = chainKeyToEndpointId(chainKey, 1);
  const erc20 = new ERC20__api(providerFactory);

  const tokens: Token[] = await Promise.all(
    addresses.map((address) => erc20.getToken({chainId, address})),
  );
  return tokens;
}

function save(fileName: string, tokens: Token[]) {
  const serialized = tokens.map((t) => ({
    chainId: t.chainId,
    address: t.address,
    name: t.name,
    symbol: t.symbol,
    decimals: t.decimals,
  }));
  const filePath = path.join(__dirname, '../', fileName);
  fs.writeFileSync(filePath, JSON.stringify(serialized, null, 2));
}
