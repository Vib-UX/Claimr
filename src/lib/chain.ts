import { defineChain } from "viem";

/**
 * Monad Testnet (chain id 10143).
 * Defined locally with `defineChain` so the app does not depend on a specific
 * viem release shipping the chain. Swap to `viem/chains` `monad` (mainnet, 143)
 * when going to production.
 */
export const monadTestnet = defineChain({
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet-rpc.monad.xyz"] },
    public: { http: ["https://testnet-rpc.monad.xyz"] },
  },
  blockExplorers: {
    default: {
      name: "MonadScan",
      url: "https://testnet.monadscan.com",
    },
  },
  testnet: true,
});

export const ACTIVE_CHAIN = monadTestnet;

export function explorerTxUrl(hash: string): string {
  return `${ACTIVE_CHAIN.blockExplorers.default.url}/tx/${hash}`;
}

export function explorerAddressUrl(address: string): string {
  return `${ACTIVE_CHAIN.blockExplorers.default.url}/address/${address}`;
}

/**
 * Placeholder POAP collection address. Replace with the deployed ERC-721
 * (OpenZeppelin-based) contract address once `contracts/` is deployed +
 * verified via the monskills `wallet/` + verification flow.
 */
export const POAP_CONTRACT_ADDRESS = (process.env
  .NEXT_PUBLIC_POAP_CONTRACT_ADDRESS ??
  "0x0000000000000000000000000000000000000000") as `0x${string}`;
