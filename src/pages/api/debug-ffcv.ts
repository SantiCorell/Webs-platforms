/**
 * Diagnóstico: devuelve club + caché FFCV para un slug.
 *
 * Uso:
 *   /api/debug-ffcv?slug=cf-godella        → usa service role (necesita SUPABASE_SERVICE_ROLE_KEY = JWT eyJ...)
 *   /api/debug-ffcv?slug=cf-godella&anon=1 → usa solo anon (lectura pública). Si falla, ejecuta el SQL de políticas en Supabase.
 */
import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseService } from "../../../lib/supabaseService";

async function runDiagnostic(sb: ReturnType<typeof createClient>, slug: string) {
  const clubRes = await sb.from("clubs").select("id, name, slug").eq("slug", slug).maybeSingle();
  let club = clubRes.data ?? null;
  if (!club?.id && slug === "cf-godella") {
    const byId = await sb.from("clubs").select("id, name, slug").eq("id", "399e383b-70e4-4859-bb3d-f0fb7acb075e").maybeSingle();
    club = byId.data ?? null;
  }
  if (!club?.id) {
    return { error: "Club no encontrado", slug, clubError: clubRes.error };
  }
  const cacheRes = await sb.from("club_ffcv_cache").select("classification, next_matches").eq("club_id", club.id).maybeSingle();
  const cache = cacheRes.data;
  const hasClass = cache?.classification != null;
  const classRows = cache?.classification && typeof cache.classification === "object" && "rows" in cache.classification
    ? (cache.classification as { rows: unknown[] }).rows?.length ?? 0
    : Array.isArray(cache?.classification) ? cache.classification.length : 0;
  const matchesLen = Array.isArray(cache?.next_matches) ? cache.next_matches.length : 0;
  return {
    ok: true,
    slug,
    club: { id: club.id, name: club.name },
    cache: !!cache,
    hasClassification: hasClass,
    classificationRows: classRows,
    nextMatchesCount: matchesLen,
    rawClassificationKeys: cache?.classification && typeof cache.classification === "object" ? Object.keys(cache.classification as object) : [],
    sampleMatch: Array.isArray(cache?.next_matches) && cache.next_matches[0] ? cache.next_matches[0] : null,
  };
}

export const GET: APIRoute = async ({ url }) => {
  const slug = url.searchParams.get("slug") || "cf-godella";
  const useAnon = url.searchParams.get("anon") === "1";

  if (useAnon) {
    const urlEnv = import.meta.env.PUBLIC_SUPABASE_URL;
    const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
    if (!urlEnv || !anonKey) {
      return new Response(
        JSON.stringify({ error: "Faltan PUBLIC_SUPABASE_URL o PUBLIC_SUPABASE_ANON_KEY", slug, mode: "anon" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    const anonClient = createClient(urlEnv, anonKey);
    const result = await runDiagnostic(anonClient, slug);
    return new Response(
      JSON.stringify({ ...result, mode: "anon", hint: result.error ? "Ejecuta el SQL de supabase-policies-public-read.sql en Supabase y revisa que haya datos en club_ffcv_cache." : "Lectura pública OK." }, null, 2),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  const admin = getSupabaseService();
  if (!admin) {
    return new Response(
      JSON.stringify({
        error: "No SUPABASE_SERVICE_ROLE_KEY (o es inválida). Debe ser el JWT service_role que empieza por eyJ..., no sb_publishable_...",
        slug,
        hint: "Supabase → Project Settings → API → service_role (secret). Copia ese JWT en .env como SUPABASE_SERVICE_ROLE_KEY.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
  const result = await runDiagnostic(admin, slug);
  return new Response(
    JSON.stringify({ ...result, mode: "service_role" }, null, 2),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};
