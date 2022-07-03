import { supabaseClient } from "@db/supabase/supabase.client";
import type { Account } from "@modules/account/domain/account";
import type { Profile } from "@modules/account/domain/profile";
import type { ProfileDSO } from "@modules/account/dso/profile.dso";
import { profileMapper } from "@modules/account/mapper/profile.mapper";
import { pgErrorToApiError } from "@modules/common/error-handling/pgErrorToApiError";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Result } from "@utils/monads/result.monad";
import { fail, ok } from "@utils/monads/result.monad";
import type { Nullable } from "@utils/types/nullable";
import type { ProfileRepo } from "../profile.repo";

const makeProfileRepoSupabase = (supabaseClient: SupabaseClient): ProfileRepo => {
	const exists = async (id: Profile["id"]): Promise<Result<boolean>> => {
		const { data, error } = await supabaseClient
			.from<{ id: ProfileDSO["id"] }>("account_profile")
			.select("id")
			.eq("id", id)
			.single();

		if (error) return fail(Error("Failed to check if profile exists."));

		return ok(Boolean(data?.id));
	};

	const handleExists = async (handle: Profile["handle"]): Promise<Result<boolean>> => {
		const { data, error } = await supabaseClient
			.from("account_profile")
			.select("handle")
			.eq("handle", handle);

		console.log(data);
		console.error(error);
		if (error) return fail(Error("Failed to check if profile exists."));

		const exists = data.length > 0 && data?.[0].handle.toLowerCase() === handle.toLowerCase();
		return ok(exists);
	};

	const getByHandle = async (handle: Profile["handle"]): Promise<Result<Profile>> => {
		const { data, error } = await supabaseClient
			.from<ProfileDSO>("account_profile")
			.select("*")
			.eq("handle", handle)
			.single();

		// TODO: it's unsafe to return this error
		if (error) return fail(pgErrorToApiError(error));
		// TODO: create ApiError
		if (!data) return fail(new Error("404 error"));

		// TODO: should be returning option
		return profileMapper.dsoToDomain(data);
	};

	const getById = async (id: Profile["id"]): Promise<Result<Profile>> => {
		const { data, error } = await supabaseClient
			.from<ProfileDSO>("account_profile")
			.select("*")
			.eq("id", id)
			.single();

		// TODO: it's unsafe to return this error
		if (error) return fail(pgErrorToApiError(error));
		// TODO: create ApiError
		if (!data) return fail(new Error("404 error"));

		// TODO: should be returning option
		return profileMapper.dsoToDomain(data);
	};

	const getByAccountReference = async (
		accountId: Account["id"],
	): Promise<Result<Nullable<Profile>>> => {
		const { data, error } = await supabaseClient
			.from<ProfileDSO>("account_profile")
			.select("*")
			.eq("account_id", accountId);

		if (error) return fail(pgErrorToApiError(error));
		if (!data?.[0]?.id) {
			return ok(null);
		}

		return profileMapper.dsoToDomain(data[0]);
	};

	const add = async (profile: Profile): Promise<Result<Profile>> => {
		const result = profileMapper.domainToDso(profile);
		if (result.isFail()) {
			return result.mapFail((err) => err);
		}

		try {
			const dso = result.unsafeUnwrap();

			const { data: storedDso, error: dbError } = await supabaseClient
				.from<ProfileDSO>("account_profile")
				.insert(dso)
				.single();

			// TODO: error will expose details
			if (dbError) return fail(pgErrorToApiError(dbError));
			if (!storedDso?.id) return fail(Error("Does not appear account was added."));

			return profileMapper.dsoToDomain(storedDso);
		} catch (err) {
			// TODO: error exposes details
			return fail(new Error(`Unexpected error occurred while saving profile: ${err}`));
		}
	};

	const update = async (profile: Profile): Promise<Result<Profile>> => {
		const result = profileMapper.domainToDso(profile);
		if (result.isFail()) {
			return result.mapFail((err) => err);
		}

		try {
			const { id, created_at, updated_at, ...fieldsToUpdate } = result.unsafeUnwrap();

			const { data: updatedDso, error: dbError } = await supabaseClient
				.from<ProfileDSO>("account_profile")
				.update(fieldsToUpdate)
				.eq("id", id)
				.single();

			// TODO: error exposes details
			if (dbError) return fail(pgErrorToApiError(dbError));
			if (!updatedDso) return fail(Error("Profile to update was not found."));

			return profileMapper.dsoToDomain(updatedDso);
		} catch (err) {
			// TODO: error exposes details
			return fail(new Error(`Unexpected error occurred while updating profile: ${err}`));
		}
	};

	return {
		exists,
		handleExists,
		getByHandle,
		getById,
		add,
		update,
		getByAccountReference,
	};
};

export const profileRepoSupabase = makeProfileRepoSupabase(supabaseClient);
