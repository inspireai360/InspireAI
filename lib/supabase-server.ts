import { createClient } from "@supabase/supabase-js";

function getRequiredEnv(name: string, fallback?: string): string {
  const value = process.env[name] || fallback;
  if (!value) {
    throw new Error(`Environment variable ${name} is required but was not provided.`);
  }
  return value;
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Cliente con service key — solo para uso server-side (API routes).
// Bypasses RLS para poder insertar desde la web sin auth de usuario.
export const supabaseAdmin = createClient(
  getRequiredEnv("SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
  getRequiredEnv("SUPABASE_SERVICE_KEY"),
  { auth: { persistSession: false, autoRefreshToken: false } }
);

export const ADMIN_USER_ID = "bb933d46-5dbb-488c-8090-3e7e42ddd562";
