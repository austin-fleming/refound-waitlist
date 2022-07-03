export type ProviderSchema = {
	usesVerifier: true;
	email: string;
	typeOfLogin: string; // google, twitter
	verifier: string; // torus
	verifierId: string;
	preferredEmail?: string;
};

export type WalletSchema = {
	usesVerifier: false;
	chain: string;
	pubKey: string;
	email?: string;
	preferredEmail?: string;
};
