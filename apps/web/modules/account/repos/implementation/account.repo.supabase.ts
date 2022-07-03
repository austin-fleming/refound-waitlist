import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { supabaseClient } from "@db/supabase/supabase.client";
import { Account } from "@modules/account/domain/account";
import { AccountDSO } from "@modules/account/dso/account.dso";
import { accountMapper } from "@modules/account/mapper/account.mapper";
import { pgErrorToApiError } from "@modules/common/error-handling/pgErrorToApiError";
import { fail, ok, Result } from "@utils/monads/result.monad";
import { AccountRepo } from "../account.repo";

const makeAccountRepoSupabase = (supabaseClient: SupabaseClient): AccountRepo => {
	const exists = async (id: Account["id"]): Promise<Result<boolean>> => {
		const { data, error } = await supabaseClient
			.from<{ id: AccountDSO["id"] }>("account")
			.select("id")
			.eq("id", id)
			.single();

		// TODO: This should be returning option object
		if (error) return fail(Error("Failed to check if account exists."));

		return ok(Boolean(data?.id));
	};

	const get = async (id: Account["id"]): Promise<Result<Account>> => {
		const { data, error } = await supabaseClient
			.from<AccountDSO>("account")
			.select("*")
			.eq("id", id)
			.single();

		// TODO: it's unsafe to return this error
		if (error) return fail(pgErrorToApiError(error));

		// TODO: create ApiError
		if (!data) return fail(new Error("404 error"));

		// TODO: should be returning option
		const account = accountMapper.dsoToDomain(data);

		return ok(account);
	};

	const add = async (account: Account): Promise<Result<Account>> => {
		// TODO: should return option
		const dso = accountMapper.domainToDso(account);

		const { data: storedDso, error } = await supabaseClient
			.from<AccountDSO>("account")
			.insert(dso)
			.single();

		if (error) return fail(Error("Could not add account to accountRepoSupabase."));

		if (!storedDso?.id) return fail(Error("Does not appear account was added."));

		const storedAccount = accountMapper.dsoToDomain(storedDso);

		return ok(storedAccount);
	};

	const update = async (account: Account): Promise<Result<Account>> => {
		const dso = accountMapper.domainToDso(account);

		const { id, ...fieldsToUpdate } = dso;

		const { data: updatedDso, error } = await supabaseClient
			.from<AccountDSO>("account")
			.update(fieldsToUpdate)
			.eq("id", id)
			.single();

		if (error) return fail(Error(`${error}`));

		if (!updatedDso) return fail(Error("Account to update was not found."));

		const updatedAccount = accountMapper.dsoToDomain(updatedDso);

		return ok(updatedAccount);
	};

	return {
		exists,
		get,
		add,
		update,
	};
};

export const accountRepoSupabase = makeAccountRepoSupabase(supabaseClient);
