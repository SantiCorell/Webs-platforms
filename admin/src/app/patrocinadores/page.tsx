import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/AdminHeader";

export default async function PatrocinadoresPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("club_id").eq("id", user.id).single();
  const clubId = profile?.club_id ?? "";

  const { data: items } = await supabase
    .from("sponsors")
    .select("*")
    .eq("club_id", clubId)
    .order("name");

  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminHeader
        title="Gestión de Patrocinadores"
        subtitle="Empresas colaboradoras del club"
        backHref="/dashboard"
        extra={
          <Link
            href="/patrocinadores/nuevo"
            className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            Nuevo Patrocinador
          </Link>
        }
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-neutral-600 mb-6">Total: {(items ?? []).length} patrocinadores.</p>
        <ul className="space-y-2">
          {(items ?? []).map((s: { id: string; name?: string }) => (
            <li key={s.id}>
              <Link href={`/patrocinadores/editar/${s.id}`} className="text-blue-600 hover:underline">
                {s.name ?? s.id}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
