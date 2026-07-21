import { createClient } from "@supabase/supabase-js";

// Server-only client using the service-role key, which bypasses RLS. Never
// import this from client components — it must stay inside API routes /
// server code (route.ts, server actions, etc.).
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);
