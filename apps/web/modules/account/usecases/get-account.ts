import type { NextApiRequest, NextApiResponse } from "next";
import type { Account } from "../domain/account";
import { isString } from "@utils/validation/is-string";
import { accountRepoSupabase } from "../repos/implementation/account.repo.supabase";

type Data = {
	detail?: string;
	data?: Account;
};

export default async function getAccount(request: NextApiRequest, response: NextApiResponse<Data>) {
	const { id } = request.query;

	// TODO: better errors and handle this in middleware
	if (!isString(id)) return response.status(400).json({ detail: `'${id}' is not a valid id` });

	const result = await accountRepoSupabase.get(id);
	// TODO: this should go to middleware
	// TODO: code should come from error
	return result.match({
		ok: (data) => response.status(200).json({ data }),
		fail: (err) => response.status(500).json({ detail: `${err}` }),
	});
}
