import { Result } from "@utils/monads/result.monad";
import { Profile } from "../domain/profile";

export interface ProfileRepo {
	exists: (id: Profile["id"]) => Promise<Result<boolean>>;
	handleExists: (handle: Profile["handle"]) => Promise<Result<boolean>>;
	getByHandle: (id: Profile["handle"]) => Promise<Result<Profile>>;
	getById: (id: Profile["id"]) => Promise<Result<Profile>>;
	add: (account: Profile) => Promise<Result<Profile>>;
	update: (account: Profile) => Promise<Result<Profile>>;
}
