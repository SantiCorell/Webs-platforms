import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role, club_id").eq("id", user.id).single();
  if (!profile || profile.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await supabase
    .from("club_teams")
    .select("id, name, num_players, coach, sort_order")
    .eq("club_id", profile.club_id)
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ teams: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role, club_id").eq("id", user.id).single();
  if (!profile || profile.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const num_players = typeof body.num_players === "number" ? body.num_players : Number(body.num_players) || 0;
  const coach = typeof body.coach === "string" ? body.coach.trim() || null : null;
  const sort_order = typeof body.sort_order === "number" ? body.sort_order : Number(body.sort_order) || 0;

  if (!name) {
    return NextResponse.json({ error: "El nombre de la categoría/equipo es obligatorio" }, { status: 400 });
  }

  const { data: team, error } = await supabase
    .from("club_teams")
    .insert({ club_id: profile.club_id, name, num_players, coach, sort_order })
    .select("id, name, num_players, coach, sort_order")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ team });
}
