import { Account, validate } from "../domain/account";
import { AccountDSO } from "../dso/account.dso";

const dsoToDomain = (dso: AccountDSO): Account => {
	const account: Account = {
		id: dso.id,
		provider: {
			usesProvider: dso.uses_provider,
			type: dso.provider_type,
			email: dso.provider_email,
		},
		wallet: {
			address: dso.wallet_address,
			chain: dso.wallet_chain,
			chainId: dso.wallet_chain_id,
		},
		createdAt: new Date(dso.created_at),
		updatedAt: new Date(dso.updated_at),
	};

	validate(account);

	return account;
};

const domainToDso = (account: Account): AccountDSO => {
	// Trust that verifying the state of the entity will satisfy DB constraints
	validate(account);

	const dso: AccountDSO = {
		id: account.id,
		uses_provider: account.provider.usesProvider,
		provider_type: account.provider.type,
		provider_email: account.provider.email,
		wallet_address: account.wallet.address,
		wallet_chain: account.wallet.chain,
		wallet_chain_id: account.wallet.chainId,
		created_at: account.createdAt.toISOString(),
		updated_at: account.updatedAt.toISOString(),
	};

	return dso;
};

export const accountMapper = {
	dsoToDomain,
	domainToDso,
};
