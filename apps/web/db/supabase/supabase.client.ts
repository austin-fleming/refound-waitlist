import { createClient } from "@supabase/supabase-js";

const makeSupabaseClient = () => {
    // TODO: error check to crash build if missing .env variables
    const url = process.env.SUPABASE_DB_URL
    if (!url) throw new Error("environmental variable 'SUPABASE_DB_URL' is missing.")
    
    const anonKey = process.env.SUPABASE_PUBLIC_ANON_KEY
    if (!anonKey) throw new Error("environmental variable 'SUPABASE_PUBLIC_ANON_KEY' is missing.")

    return createClient(url, anonKey)
}

export const supabaseClient = makeSupabaseClient()