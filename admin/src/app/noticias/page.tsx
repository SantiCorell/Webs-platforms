import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/AdminHeader";

export default async function NoticiasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("club_id").eq("id", user.id).single();
  const clubId = profile?.club_id ?? "";

  const { data: items, count } = await supabase
    .from("news")
    .select("*", { count: "exact" })
    .eq("club_id", clubId)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminHeader
        title="Gestión de Noticias"
        subtitle="Comunicados oficiales del club"
        backHref="/dashboard"
        extra={
          <Link
            href="/noticias/nueva"
            className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Nueva Noticia
          </Link>
        }
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-neutral-600 mb-6">Total: {count ?? 0} noticias.</p>
        <ul className="space-y-2">
          {(items ?? []).map((n: { id: string; title?: string; created_at?: string }) => (
            <li key={n.id}>
              <Link href={`/noticias/editar/${n.id}`} className="text-blue-600 hover:underline">
                {n.title ?? n.id}
              </Link>
              <span className="text-neutral-400 text-sm ml-2">{n.created_at}</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
