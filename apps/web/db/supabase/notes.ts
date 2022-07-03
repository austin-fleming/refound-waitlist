export type ProviderSchema = {
	email: string;
	loginType: string;
};

export type WalletSchema = {
	chain: string;
	pubKey: string;
	email?: string;
};
