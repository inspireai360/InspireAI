import { createClient } from "@supabase/supabase-js";

// Durante el build de Next.js las route handlers no se ejecutan — solo se compilan.
// En runtime, Vercel inyecta las env vars reales.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fdqsmraawrmutartgisn.supabase.co";
const key = process.env.SUPABASE_SERVICE_KEY || "build-placeholder";

export const supabaseAdmin = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export const ADMIN_USER_ID = "bb933d46-5dbb-488c-8090-3e7e42ddd562";
