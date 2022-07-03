import { fail, ok, Result } from "@utils/monads/result.monad";
import { isDate } from "@utils/validation/is-date";
import { isUuidV4 } from "@utils/validation/is-uuidv4";
import { AccountId } from "./account-id";
import { ProfileHandle } from "./profile-handle";
import { ProfileId } from "./profile-id";

export type Profile = {
	id: ProfileId;
	accountId: AccountId;
	handle: ProfileHandle;
	createdAt: Date;
	updatedAt: Date;
};

export const validate = (profile: Profile): Result<Profile> => {
	// TODO: Should there be a fetch to assert handle is unique and accountId is valid?
	let validationErrors: string[] = [];

	if (!isUuidV4(profile.id)) {
		validationErrors.push(`${profile.id} is not a valid id`);
	}

	if (!isUuidV4(profile.accountId)) {
		validationErrors.push(`${profile.accountId} is not a valid account id`);
	}

	if (profile.handle.length < 3 || profile.handle.length > 15) {
		validationErrors.push("Handle must be 3-15 characters long");
	}

	if (!isDate(profile.createdAt)) {
		validationErrors.push("createdAt must be a valid date");
	}

	if (!isDate(profile.updatedAt)) {
		validationErrors.push("updatedAt must be a valid date");
	}

	if (validationErrors.length > 0) {
		return fail(new Error(validationErrors.join("; ")));
	}

	return ok(profile);
};
