import { Result } from "@utils/monads/result.monad";
import { Account } from "../domain/account";

export interface AccountRepo {
	exists: (id: Account["id"]) => Promise<Result<boolean>>;
	get: (id: Account["id"]) => Promise<Result<Account>>;
	add: (account: Account) => Promise<Result<Account>>;
	update: (account: Account) => Promise<Result<Account>>;
}
