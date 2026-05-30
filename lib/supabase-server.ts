import { createClient } from "@supabase/supabase-js";

let _client: ReturnType<typeof createClient> | null = null;

// Cliente lazy — se crea en el primer uso, no al importar el módulo
export function getSupabaseAdmin() {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_KEY son requeridas.");
  }
  _client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return _client;
}

// Alias para compatibilidad con el código existente
export const supabaseAdmin = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    return (getSupabaseAdmin() as any)[prop];
  },
});

export const ADMIN_USER_ID = "bb933d46-5dbb-488c-8090-3e7e42ddd562";
