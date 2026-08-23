import { createClient } from "@supabase/supabase-js"

/**
 * Service-role client. Bypasses RLS.
 * SERVER-ONLY. Never import this into a client component or expose the key.
 * Used by the biometric webhook, the auto-logout cron, and admin-only writes.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )
}
