import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, club_id")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const allowed = [
    "name", "email", "phone", "address", "domain", "description",
    "color", "default_color", "logo_url", "facebook", "instagram", "twitter", "youtube",
    "president_name", "president_greeting", "president_photo_url", "values_content",
    "founded_year", "tax_id", "office_hours",
    "ffcv_club_id", "ffcv_id_temp", "ffcv_id_competicion", "ffcv_id_torneo", "ffcv_id_modalidad",
    "page_visibility",
  ];
  const updateData: Record<string, unknown> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) {
      if (key === "page_visibility" && typeof body[key] === "object") {
        updateData[key] = body[key];
      } else {
        updateData[key] = body[key] === "" ? null : body[key];
      }
    }
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "No hay datos para actualizar" }, { status: 400 });
  }

  const { error } = await supabase
    .from("clubs")
    .update(updateData)
    .eq("id", profile.club_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
