import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/AdminHeader";

export default async function UsuariosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role, club_id").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, role, full_name")
    .eq("club_id", profile.club_id);

  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminHeader title="Gestión de Usuarios" subtitle="Permisos y roles" backHref="/dashboard" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-neutral-600 mb-6">Usuarios del club: {(profiles ?? []).length}</p>
        <ul className="space-y-2">
          {(profiles ?? []).map((p: { id: string; full_name?: string; role?: string }) => (
            <li key={p.id} className="p-3 bg-white rounded-lg border border-neutral-200">
              {p.full_name ?? p.id} — <span className="text-neutral-500">{p.role ?? "—"}</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
