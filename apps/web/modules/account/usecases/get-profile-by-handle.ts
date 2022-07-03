// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { isString } from "@utils/validation/is-string";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Profile } from "../domain/profile";
import { profileRepoSupabase } from "../repos/implementation/profile.repo.supabase";

type Data = {
	detail?: string;
	data?: Profile;
};

export default async function getProfileByHandle(
	request: NextApiRequest,
	response: NextApiResponse<Data>,
) {
	const { handle } = request.query;

	// TODO: better errors and handle this in middleware
	if (!isString(handle))
		return response.status(400).json({ detail: `'${handle}' is not a valid handle` });

	const result = await profileRepoSupabase.getByHandle(handle);
	// TODO: this should go to middleware
	// TODO: code should come from error
	return result.match({
		ok: (data) => response.status(200).json({ data }),
		fail: (err) => response.status(500).json({ detail: `${err}` }),
	});
}
