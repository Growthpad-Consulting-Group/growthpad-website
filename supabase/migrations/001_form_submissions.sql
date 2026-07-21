-- Run this once in the Supabase SQL editor (or via `supabase db push` if you
-- link the CLI later). Service-role key bypasses RLS for the API route, so
-- RLS stays enabled with no public policies — no direct client access.

create table if not exists form_submissions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('career', 'contact')),
  payload jsonb not null,
  resume_url text,
  email_status text not null default 'pending' check (email_status in ('pending', 'sent', 'failed')),
  email_error text,
  created_at timestamptz not null default now()
);

create index if not exists form_submissions_type_idx on form_submissions (type);
create index if not exists form_submissions_email_status_idx on form_submissions (email_status);

alter table form_submissions enable row level security;
-- No policies added — only the service-role key (used server-side in
-- /api/send) can read/write. Anon/public clients get nothing by default.

-- Storage bucket for resume/CV uploads (career applications).
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;
