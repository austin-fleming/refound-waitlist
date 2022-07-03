import type { Nullable } from "@utils/types/nullable";
import { isString } from "@utils/validation/is-string";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Profile } from "../domain/profile";
import { profileRepoSupabase } from "../repos/implementation/profile.repo.supabase";

export type GetProfileByAccountReferenceResponse = {
	detail?: string;
	data?: Nullable<Profile>;
};

export default async function getProfileByAccountReference(
	request: NextApiRequest,
	response: NextApiResponse<GetProfileByAccountReferenceResponse>,
) {
	const { id: accountId } = request.query;

	if (!isString(accountId))
		return response.status(400).json({ detail: `'${accountId}' is not a valid account id` });

	const result = await profileRepoSupabase.getByAccountReference(accountId);

	// TODO: this should go to middleware
	// TODO: code should come from error
	// TODO: just returning err directly is a security risk
	return result.match({
		ok: (profile) => response.status(200).json({ data: profile }),
		fail: (err) => response.status(500).json({ detail: err.message }),
	});
}
