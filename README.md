# Daybreak Landing (Next.js)

This app powers the Daybreak beta waitlist and referral invite flow.

## What it includes

- General landing page: `/`
- Referral variant landing page: `/invite/[code]`
- Personalized iMessage OG image endpoint: `/api/og/invite/[code].png`
- Signup API: `POST /api/waitlist/signup`
- Confirmation API: `POST /api/waitlist/confirm`
- Waitlist status API: `GET /api/waitlist/status?code=...`
- Supabase schema with atomic confirmation + referral credit function in `supabase/schema.sql`

## Local setup

1. Copy `.env.example` to `.env.local` and populate values.
2. Apply SQL from `supabase/schema.sql` to your Supabase project.
3. Install dependencies:

```bash
npm install
```

4. Start dev server:

```bash
npm run dev
```

## Referral attribution details

- `waitlist_users.referred_by_user_id` stores direct inviter on each invitee.
- `referral_events` stores immutable inviter->invitee attribution and credit event.
- `confirm_waitlist_user(...)` runs in one transaction and grants `+5` exactly once.
