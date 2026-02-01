# Setup

## Runtime

Node.js 20.9.0+ is required. If you use nvm:

```
nvm install 20.9.0
nvm use 20.9.0
```

## Environment variables

Create a `.env.local` using `.env.example` as a template:

- `NEON_DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL`
- `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET`

## Database (Neon)

Run the SQL in `db/schema.sql` against your Neon database to create the `projects` table.

## Supabase

- Enable Email Magic Link auth.
- Create a public storage bucket (default name in the app is `portfolio`).
- Add your Netlify domain to the allowed redirect URLs.
- Run the SQL in `db/supabase.sql` to create analytics tables.
  - Re-run it after updates to add the `inquiries` table used by the contact form.

## Inquiry email notifications

This project uses a Supabase Edge Function and Resend to email new inquiries.

1) Create a Resend account and verify your sender domain or use the default `onboarding@resend.dev`.
2) Set Supabase secrets (Project Settings -> Edge Functions -> Secrets):
   - `RESEND_API_KEY`
   - `INQUIRY_NOTIFY_EMAIL` (e.g. dvtchii@gmail.com)
   - `INQUIRY_FROM_EMAIL` (optional; defaults to `Portfolio <onboarding@resend.dev>`)
3) Deploy the function:
   - `supabase functions deploy send-inquiry-email`

## Case study PDFs

Add PDFs to `public/case-studies/{slug}.pdf` to enable automatic downloads
from the case study page.

## Local dev

```
npm install
npm run dev
```
