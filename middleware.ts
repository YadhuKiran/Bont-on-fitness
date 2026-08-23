import { updateSession } from "@/lib/supabase/proxy"
import { type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all paths except static assets and the biometric/cron API routes,
     * which authenticate via their own shared secret rather than a user session.
     */
    "/((?!_next/static|_next/image|favicon.ico|api/biometric|api/cron|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
