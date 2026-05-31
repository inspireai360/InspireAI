import { createClient } from "@supabase/supabase-js";

// La función se llama en runtime, no durante la compilación del build
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_KEY!;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Alias directo: devuelve un nuevo cliente en cada llamada
// (aceptable para server-side donde cada request es independiente)
export const supabaseAdmin = {
  from: (...args: Parameters<ReturnType<typeof getSupabaseAdmin>["from"]>) =>
    getSupabaseAdmin().from(...args),
  auth: new Proxy({} as ReturnType<typeof getSupabaseAdmin>["auth"], {
    get(_, prop) {
      return (...a: any[]) => (getSupabaseAdmin().auth as any)[prop](...a);
    },
  }),
} as ReturnType<typeof getSupabaseAdmin>;

export const ADMIN_USER_ID = "bb933d46-5dbb-488c-8090-3e7e42ddd562";
