Reviewer Checklist — Bon Ton Fitness

- **Environment:** Pull the branch and run `npm install` and `npm run dev`.
- **Auth:** Verify `/auth` sign-in and sign-up flows work (email/password). Ensure no secrets in frontend.
- **UI:** Check responsive layout: sidebar collapses on mobile, topbar shows/hides search correctly.
- **Webhook:** If running server, POST to `/webhook/attendance` and confirm attendance row is created in Supabase (requires schema applied).
- **RLS & Security:** Confirm service keys are only in server `.env` and not committed.
- **DB schema:** Confirm `sql/initial_schema.sql` runs without errors in Supabase SQL editor.
- **Tests:** Run any unit/type checks: `npx tsc -p tsconfig.json --noEmit`.
- **Performance:** Check console for runtime errors or long-running network calls.
- **Notes:** Add review comments inline for any behavior or styling improvements.
