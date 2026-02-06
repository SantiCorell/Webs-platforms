import type { APIRoute } from "astro";
import { getSupabaseServer } from "../../../../lib/supabaseServer";

export const POST: APIRoute = async ({ request, cookies }) => {
  // 1. Sesión
  const {
    data: { user },
  } = await getSupabaseServer(cookies).auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 2. Rol
  const { data: profile } = await getSupabaseServer(cookies)
    .from("profiles")
    .select("role, club_id")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return new Response("Forbidden", { status: 403 });
  }

  // 3. Datos
  const body = await request.json();

  const updateData: Record<string, unknown> = {};
  const allowed = [
    "name", "email", "phone", "address", "domain", "description",
    "default_color", "logo_url", "facebook", "instagram", "twitter", "youtube",
    "president_name", "founded_year", "tax_id", "office_hours"
  ];
  for (const key of allowed) {
    if (body[key] !== undefined) {
      updateData[key] = body[key] === "" ? null : body[key];
    }
  }

  if (Object.keys(updateData).length === 0) {
    return new Response(JSON.stringify({ error: "No hay datos para actualizar" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 4. Update
  const { error } = await getSupabaseServer(cookies)
    .from("clubs")
    .update(updateData)
    .eq("id", profile.club_id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
