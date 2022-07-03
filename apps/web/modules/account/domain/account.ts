import type { Nullable } from "@utils/types/nullable";
import { isDate } from "@utils/validation/is-date";
import { isNullish } from "@utils/validation/is-nullish";
import { isUuidV4 } from "@utils/validation/is-uuidv4";
import { accountEmail } from "./account-email";
import type { AccountId } from "./account-id";

export type Account = {
	id: AccountId;
	provider: {
		usesProvider: boolean;
		type?: string;
		email?: string;
	};
	wallet: {
		address: string;
		chain: string;
		chainId?: number;
	};
	createdAt: string;
	updatedAt: string;
};

export const validate = (account: Account): Nullable<Error> => {
	const validationErrors: string[] = [];

	// id
	if (!isUuidV4(account.id)) {
		validationErrors.push("'Id' must be a valid id");
	}

	// provider.usesProvider
	if (isNullish(account.provider.usesProvider)) {
		validationErrors.push("'Uses Provider' is missing");
	}

	// provider.type
	if (account.provider.usesProvider && isNullish(account.provider.type)) {
		validationErrors.push("'Provider Type' is missing");
	}

	// provider.email
	const email = accountEmail(account.provider.email!);
	if (account.provider.usesProvider) {
		if (!email.get()) {
			validationErrors.push("'Provider Email' is missing");
		} else if (!email.isValid()) {
			validationErrors.push("'Provider Email' must be a valid email");
		}
	}

	// wallet.address
	if (isNullish(account.wallet.address)) {
		validationErrors.push("'Wallet Address' is missing");
	}

	// wallet.chain
	if (isNullish(account.wallet.chain)) {
		validationErrors.push("'Wallet Chain' is missing");
	}

	// wallet.chainId
	if (account.wallet.chain == "ethereum" && isNullish(account.wallet.chainId)) {
		validationErrors.push("'Chain Id' is required when 'Wallet Chain' is 'ethereum'");
	}

	// createdAt
	if (!isDate(new Date(account.createdAt))) {
		validationErrors.push("'Created At' is not a valid Date");
	}

	// updatedAt
	if (!isDate(new Date(account.updatedAt))) {
		validationErrors.push("'Updated At' is not a valid Date");
	}

	if (validationErrors.length > 0) return new Error(validationErrors.join("; "));

	return null;
};
