import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/AdminHeader";

export default async function GaleriaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("club_id").eq("id", user.id).single();
  const clubId = profile?.club_id ?? "";

  const { data: albums } = await supabase
    .from("albums")
    .select("*")
    .eq("club_id", clubId)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminHeader title="Galería" subtitle="Álbumes fotográficos" backHref="/dashboard" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-neutral-600 mb-6">Total: {(albums ?? []).length} álbumes.</p>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {(albums ?? []).map((a: { id: string; name?: string }) => (
            <li key={a.id}>
              <Link
                href={`/galeria/${a.id}`}
                className="block p-4 bg-white rounded-xl border border-neutral-200 hover:border-purple-300"
              >
                {a.name ?? a.id}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
