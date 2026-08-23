# Bon Ton Fitness

A mobile-first member and branch operations platform for Bon Ton Fitness, inspired by the premium dark-and-lime visual language of the public [Bon Ton Fitness website](https://bontonfitness.com/).

## Current build

This repository now contains the Phase 1 foundation from the product brief. The frontend is a Vite + React + TypeScript application with a responsive Bon Ton member experience and distinct operational workspaces for members, trainers, branch staff, branch managers, and the super admin.

| Area | Current implementation |
| --- | --- |
| Member access | Email/password login UI, account creation state, optional Supabase Auth integration, and demo-role preview |
| Member dashboard | Membership status context, attendance snapshot, streak, weight, goal, recommended workout, calendar, and activity history |
| Member views | Attendance detail calendar, workout session view, progress chart/history, and editable profile foundation |
| Operations | Branch manager/staff/admin dashboards, five realistic branch records, live check-in list, manual check-in/check-out controls, member directory, and equipment status view |
| Trainer | Assigned-member view and weekly plan workspace foundation |
| Backend foundation | Supabase migration with branches, profiles, attendance, notifications, equipment, trainer assignments, role-aware RLS, auto-close function, and seed branches |
| Biometric integration | Generic Supabase Edge Function at `supabase/functions/biometric-webhook/index.ts` accepting `member_id` or `biometric_identifier`, `branch_id`, `timestamp`, and `event_type` |

The UI intentionally falls back to demo mode when Supabase environment variables are not present. This keeps the product reviewable immediately while making the production authentication path explicit rather than pretending that a backend is already connected.

## Local development

```bash
npm install
npm run dev
```

The production build can be verified with:

```bash
npm run build
```

## Supabase setup

Copy `.env.example` to `.env.local` and set the project values:

```bash
cp .env.example .env.local
```

Apply the schema with the Supabase CLI from the repository root:

```bash
supabase db push
supabase functions deploy biometric-webhook
```

The migration seeds the five current Bon Ton clubs: HMT Layout, Anjana Nagar, Laggere, Chikka Gollarahatti, and Nelamangala. It also creates row-level security policies so members see their own records, trainers see assigned members, branch roles remain branch-scoped, and the super admin can see the complete network.

### Biometric webhook contract

Send a `POST` request to the deployed Edge Function using JSON similar to:

```json
{
  "biometric_identifier": "essl-1024",
  "branch_id": "00000000-0000-0000-0000-000000000000",
  "timestamp": "2026-08-23T18:12:00+05:30",
  "event_type": "check_in"
}
```

`event_type` supports `check_in` and `check_out`. The function records attendance, updates `profiles.currently_in_gym`, calculates checkout duration, and writes member notifications. The `auto_close_stale_attendance()` database function is ready to be called by a scheduled Supabase job every 15 minutes.

## Demo preview

When Supabase is not configured, the login screen provides a role selector. Use any valid email and a password of at least six characters, then choose a workspace to preview:

- Member: consumer-style fitness dashboard and workout history.
- Trainer: member directory, plans, and progress workspace.
- Branch staff: live check-ins and member directory.
- Branch manager: HMT Layout operational dashboard, members, and equipment.
- Super admin: all-five-branch network view and cross-branch management foundations.

## Next implementation step

The next product phase should connect the rendered views to real Supabase queries and subscriptions, then build the Phase 2 recommendation engine. Trainer-assigned plans should take priority, recent muscle-group history and member goals should drive fallback recommendations, and equipment marked for maintenance should be excluded from suggested exercises.
