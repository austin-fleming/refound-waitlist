import type { Result } from "@utils/monads/result.monad";
import { fail, ok } from "@utils/monads/result.monad";
import type { Profile } from "../domain/profile";
import { validate } from "../domain/profile";
import type { ProfileDSO } from "../dso/profile.dso";

const dsoToDomain = (dso: ProfileDSO): Result<Profile> => {
	const profile: Profile = {
		id: dso.id,
		accountId: dso.account_id,
		handle: dso.handle,
		createdAt: dso.created_at,
		updatedAt: dso.updated_at,
	};

	return validate(profile);
};

const domainToDso = (profile: Profile): Result<ProfileDSO> => {
	// Trust that verifying the state of the entity will satisfy DB constraints
	const result = validate(profile);
	if (result.isFail()) {
		return fail(result.unsafeUnwrapFail());
	}

	const dso: ProfileDSO = {
		id: profile.id,
		account_id: profile.accountId,
		handle: profile.handle,
		created_at: profile.createdAt,
		updated_at: profile.updatedAt,
	};

	return ok(dso);
};

export const profileMapper = {
	dsoToDomain,
	domainToDso,
};
