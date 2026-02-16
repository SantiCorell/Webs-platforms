import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/AdminHeader";

export default async function EquiposPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role, club_id").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");
  const clubId = profile?.club_id ?? "";

  const { data: teams } = await supabase
    .from("club_teams")
    .select("*")
    .eq("club_id", clubId)
    .order("sort_order", { ascending: true });

  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminHeader title="Equipos y categorías" subtitle="Configuración de equipos" backHref="/dashboard" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-neutral-600 mb-6">Total: {(teams ?? []).length} equipos.</p>
        <ul className="space-y-2">
          {(teams ?? []).map((t: { id: string; name?: string }) => (
            <li key={t.id} className="p-3 bg-white rounded-lg border border-neutral-200">
              {t.name ?? t.id}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
