import { isString } from "@utils/validation/is-string";
import type { NextApiRequest, NextApiResponse } from "next";
import { accountRepoSupabase } from "../repos/implementation/account.repo.supabase";

export type GetAccountExistsByWalletAddressResponse = {
	detail?: string;
	exists?: boolean;
};

export default async function getAccountExistsByWalletAddress(
	request: NextApiRequest,
	response: NextApiResponse<GetAccountExistsByWalletAddressResponse>,
) {
	const { address } = request.query;

	if (!isString(address))
		return response.status(400).json({ detail: `'${address}' is not a valid wallet address` });

	const result = await accountRepoSupabase.walletAddressExists(address);

	// TODO: this should go to middleware
	// TODO: code should come from error
	// TODO: just returning err directly is a security risk
	return result.match({
		ok: (exists) => response.status(200).json({ exists }),
		fail: (err) => response.status(500).json({ detail: err.message }),
	});
}
