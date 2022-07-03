import type { NextApiRequest, NextApiResponse } from "next";
import type { Profile } from "../domain/profile";
import { profileRepoSupabase } from "../repos/implementation/profile.repo.supabase";

export type AddProfileResponse = {
	data?: Profile;
	detail?: string;
};

export default async function addAccount(
	request: NextApiRequest,
	response: NextApiResponse<AddProfileResponse>,
) {
	const { method, body } = request;

	if (method !== "POST") {
		return response.status(405).json({ detail: "Invalid Method" });
	}

	if (!body) {
		return response.status(400).json({ detail: "Empty request" });
	}

	return (await profileRepoSupabase.add(body as Profile)).match({
		ok: (profile) => response.status(200).json({ data: profile }),
		// TODO: this should go to middleware
		// TODO: code should come from error
		fail: (err) => response.status(500).json({ detail: `${err}` }),
	});
}
