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

## Local dev

```
npm install
npm run dev
```
