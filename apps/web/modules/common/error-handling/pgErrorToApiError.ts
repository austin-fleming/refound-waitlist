import { PostgrestError } from "@supabase/supabase-js";

// TODO: need to implement ApiError so this returns the correct thing.
export const pgErrorToApiError = (pgErr: PostgrestError): Error => new Error(`${pgErr}`)