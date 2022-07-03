import type { Result } from "@utils/monads/result.monad";
import type { Nullable } from "@utils/types/nullable";
import type { Account } from "../domain/account";
import type { Profile } from "../domain/profile";

export interface ProfileRepo {
	exists: (id: Profile["id"]) => Promise<Result<boolean>>;
	handleExists: (handle: Profile["handle"]) => Promise<Result<boolean>>;
	getByHandle: (id: Profile["handle"]) => Promise<Result<Profile>>;
	getById: (id: Profile["id"]) => Promise<Result<Profile>>;
	getByAccountReference: (accountId: Account["id"]) => Promise<Result<Nullable<Profile>>>;
	add: (account: Profile) => Promise<Result<Profile>>;
	update: (account: Profile) => Promise<Result<Profile>>;
}
