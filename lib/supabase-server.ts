import { createClient } from "@supabase/supabase-js";

// Inicialización con fallback — las env vars reales llegan en runtime desde Vercel.
// Durante el build de Next.js las API routes no se ejecutan, solo se compilan.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_KEY ?? "placeholder-build-key",
  { auth: { persistSession: false, autoRefreshToken: false } }
);

export const ADMIN_USER_ID = "bb933d46-5dbb-488c-8090-3e7e42ddd562";
