Bon Ton Fitness — Phase 1

Quick start

1) Frontend

```bash
# from repo root
npm install
# set env vars in a .env file at project root (Vite uses VITE_ prefix)
# VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
npm run dev
```

2) Server (webhook)

```bash
cd server
npm install
copy ..\\.env.example ..\\.env
# edit server/.env to add SUPABASE_URL and SUPABASE_SERVICE_ROLE
npm run dev
```

3) Database

- Open your Supabase project → SQL editor → run `sql/initial_schema.sql` to create tables and seed branches.
- Create at least one user in Supabase Auth and then create a `profiles` row referencing that user id.

4) Test webhook (example)

```bash
curl -X POST http://localhost:4000/webhook/attendance \\
	-H 'Content-Type: application/json' \\
	-d '{"member_id":"<profile-uuid>","branch_id":"<branch-uuid>","timestamp":"2026-08-23T18:12:00Z","event":"check_in"}'
```

Security & secrets

- Add the following GitHub secrets if you enable CI: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE`.
- Do NOT store service role keys in frontend code.

Push to GitHub

```bash
git add .
git commit -m "Initial Phase 1 scaffold: frontend, server webhook, schema"
git push origin main
```

If you want, I can create the first commit and push for you — confirm whether I should create a `main` branch and push, or if you prefer to push from your machine.