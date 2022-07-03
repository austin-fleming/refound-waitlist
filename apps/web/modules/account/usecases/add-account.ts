import type { NextApiRequest, NextApiResponse } from "next";
import type { Account } from "../domain/account";
import { accountRepoSupabase } from "../repos/implementation/account.repo.supabase";

export type AddAccountResponse = {
	account?: Account;
	detail?: string;
};

export default async function addAccount(
	request: NextApiRequest,
	response: NextApiResponse<AddAccountResponse>,
) {
	const { method, body } = request;

	if (method !== "POST") {
		return response.status(405).json({ detail: "Invalid Method" });
	}

	if (!body) {
		return response.status(400).json({ detail: "Empty request" });
	}
	console.log("ADDING BODY: ", JSON.stringify(body));

	return (await accountRepoSupabase.add(body as Account)).match({
		ok: (account) => response.status(200).json({ account }),
		// TODO: this should go to middleware
		// TODO: code should come from error
		fail: (err) => response.status(500).json({ detail: `${err}` }),
	});
}
