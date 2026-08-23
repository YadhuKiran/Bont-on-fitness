import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in your environment");
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export const authSignIn = (email: string, password: string) => supabase.auth.signInWithPassword({ email, password });
export const authSignUp = (email: string, password: string) => supabase.auth.signUp({ email, password });
export const authSignOut = () => supabase.auth.signOut();
export const getUser = () => supabase.auth.getSession();

export default supabase;
