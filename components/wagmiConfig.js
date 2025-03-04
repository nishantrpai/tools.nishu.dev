import { farcasterFrame } from '@farcaster/frame-wagmi-connector'

export const wagmiConfig = createConfig({
  chains: [getChainInfo(UniverseChainId.Mainnet), ...ALL_CHAIN_IDS.map(getChainInfo)],
  connectors: [
    farcasterFrame(),
    injectedWithFallback(),
    walletConnect(WC_PARAMS),
    coinbaseWallet({
      appName: 'Nishu tools',
      // CB SDK doesn't pass the parent origin context to their passkey site
      // Flagged to CB team and can remove UNISWAP_WEB_URL once fixed
      // appLogoUrl: `${UNISWAP_WEB_URL}${UNISWAP_LOGO}`,
      reloadOnDisconnect: false,
      enableMobileWalletLink: true,
    }),
    safe(),
  ],
  client({ chain }) {
    return createClient({
      chain,
      batch: { multicall: true },
      pollingInterval: 12_000,
      transport: http(chain.rpcUrls.interface.http[0]),
    })
  },
})