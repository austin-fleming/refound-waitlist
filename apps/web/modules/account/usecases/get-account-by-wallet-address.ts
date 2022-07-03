import type { NextApiRequest, NextApiResponse } from "next";
import type { Account } from "../domain/account";
import { isString } from "@utils/validation/is-string";
import { accountRepoSupabase } from "../repos/implementation/account.repo.supabase";
import type { Nullable } from "@utils/types/nullable";

export type GetAccountByWalletAddressResponse = {
	detail?: string;
	data?: Nullable<Account>;
};

export default async function getAccountByWalletAddress(
	request: NextApiRequest,
	response: NextApiResponse<GetAccountByWalletAddressResponse>,
) {
	const { address } = request.query;

	// TODO: better errors and handle this in middleware
	if (!isString(address))
		return response.status(400).json({ detail: `'${address}' is not a valid wallet address` });

	const result = await accountRepoSupabase.getByWalletAddress(address);
	// TODO: this should go to middleware
	// TODO: code should come from error
	return result.match({
		ok: (data) => response.status(200).json({ data }),
		fail: (err) => response.status(500).json({ detail: `${err}` }),
	});
}
