import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// If env vars are present, create a real Supabase client; otherwise provide a safe stub so the UI can render during development.
let _supabase: SupabaseClient | any = null;
if (supabaseUrl && supabaseAnonKey) {
  _supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Lightweight safe stub used when keys are missing. Methods return resolved promises or empty data structures.
  const noop = async () => ({ data: null, error: null });
  const storageStub = () => ({
    upload: async () => ({ error: null }),
    getPublicUrl: (path: string) => ({ data: { publicUrl: "" } }),
  });
  const fromStub = (table: string) => ({
    select: async () => ({ data: [], error: null }),
    insert: async () => ({ data: [], error: null }),
    update: async () => ({ data: [], error: null }),
    upsert: async () => ({ data: [], error: null }),
    order: function () { return this; },
    eq: function () { return this; },
    is: function () { return this; },
    lt: function () { return this; },
    maybeSingle: async () => ({ data: null, error: null }),
  });
  _supabase = {
    auth: {
      signInWithPassword: async (creds: any) => ({ data: null, error: null }),
      signUp: async (creds: any) => ({ data: null, error: null }),
      signOut: async () => ({ error: null }),
      getSession: async () => ({ data: { session: null } }),
    },
    from: fromStub,
    storage: {
      from: () => storageStub(),
    },
  };
}

export const supabase: SupabaseClient | any = _supabase;

export const authSignIn = (email: string, password: string) => supabase.auth.signInWithPassword({ email, password });
export const authSignUp = (email: string, password: string) => supabase.auth.signUp({ email, password });
export const authSignOut = () => supabase.auth.signOut();
export const getUser = () => supabase.auth.getSession();

export default supabase;
