import { createClient } from "@supabase/supabase-js";

// Cliente con service key — solo para uso server-side (API routes).
// Bypasses RLS para poder insertar desde la web sin auth de usuario.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

export const ADMIN_USER_ID = "bb933d46-5dbb-488c-8090-3e7e42ddd562";
