import { CHAIN_NAMESPACES, CustomChainConfig } from "@web3auth/base";
import { UIConfig } from "@web3auth/web3auth";

export const WEB3AUTH_NETWORK_CONFIG = {
	mainnet: {
		displayName: "Mainnet",
	},
	testnet: {
		displayName: "Testnet",
	},
	cyan: {
		displayName: "Cyan",
	},
} as const;
export type Web3AuthNetworkConfigType = keyof typeof WEB3AUTH_NETWORK_CONFIG;

export const WEB3AUTH_CHAIN_CONFIG: Record<string, CustomChainConfig> = {
	mainnet: {
		displayName: "Ethereum Mainnet",
		chainNamespace: CHAIN_NAMESPACES.EIP155,
		chainId: "0x1",
		rpcTarget: `https://mainnet.infura.io/v3/776218ac4734478c90191dde8cae483c`,
		blockExplorer: "https://etherscan.io/",
		ticker: "ETH",
		tickerName: "Ethereum",
	},
	solana: {
		chainNamespace: CHAIN_NAMESPACES.SOLANA,
		rpcTarget: "https://api.mainnet-beta.solana.com",
		blockExplorer: "https://explorer.solana.com/",
		chainId: "0x1",
		displayName: "Solana Mainnet",
		ticker: "SOL",
		tickerName: "Solana",
	},
	polygon: {
		chainNamespace: CHAIN_NAMESPACES.EIP155,
		rpcTarget: "https://polygon-rpc.com",
		blockExplorer: "https://polygonscan.com/",
		chainId: "0x89",
		displayName: "Polygon Mainnet",
		ticker: "matic",
		tickerName: "Matic",
	},
} as const;
export type Web3AuthChainConfigType = keyof typeof WEB3AUTH_CHAIN_CONFIG;

export const WEB3AUTH_WHITELABEL_CONFIG: UIConfig = {
	appLogo: "https://images.web3auth.io/web3auth-logo-w.svg",
	theme: "dark",
	loginMethodsOrder: ["facebook", "google"],
};
