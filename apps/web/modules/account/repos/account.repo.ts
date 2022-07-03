import type { Result } from "@utils/monads/result.monad";
import type { Nullable } from "@utils/types/nullable";
import type { Account } from "../domain/account";

export interface AccountRepo {
	exists: (id: Account["id"]) => Promise<Result<boolean>>;
	walletAddressExists: (walletAddress: Account["wallet"]["address"]) => Promise<Result<boolean>>;
	get: (id: Account["id"]) => Promise<Result<Account>>;
	getByWalletAddress: (address: Account["wallet"]["address"]) => Promise<Result<Nullable<Account>>>;
	add: (account: Account) => Promise<Result<Account>>;
	update: (account: Account) => Promise<Result<Account>>;
}
