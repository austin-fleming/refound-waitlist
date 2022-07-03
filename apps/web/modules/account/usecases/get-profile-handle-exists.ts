// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { isString } from "@utils/validation/is-string";
import type { NextApiRequest, NextApiResponse } from "next";
import { Profile } from "../domain/profile";
import { profileRepoSupabase } from "../repos/implementation/profile.repo.supabase";

export type GetProfileHandleExistsResponse = {
	detail?: string;
	exists?: boolean;
};

export default async function getProfileHandleExists(
	request: NextApiRequest,
	response: NextApiResponse<GetProfileHandleExistsResponse>,
) {
	const { handle } = request.query;

	// TODO: better errors and handle this in middleware
	if (!isString(handle))
		return response.status(400).json({ detail: `'${handle}' is not a valid handle` });

	const result = await profileRepoSupabase.handleExists(handle);
	// TODO: this should go to middleware
	// TODO: code should come from error
	return result.match({
		ok: (exists) => response.status(200).json({ exists }),
		fail: (err) => response.status(500).json({ detail: err.message }),
	});
}
