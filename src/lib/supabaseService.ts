import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase con service role para uso en servidor (cron, scripts).
 * Retorna null si faltan URL o key, o si la key no es la JWT real (ej. sb_publishable_...).
 * La service role debe ser el JWT que empieza por "eyJ" (Supabase → Project Settings → API → service_role).
 */
export function getSupabaseService(): SupabaseClient | null {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || typeof key !== "string") return null;
  if (key.trim().startsWith("sb_")) return null;
  if (!key.trim().startsWith("eyJ")) return null;
  return createClient(url, key);
}
