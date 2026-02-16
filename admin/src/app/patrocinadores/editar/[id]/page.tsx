import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/AdminHeader";

export default async function PatrocinadorEditarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: item } = await supabase.from("sponsors").select("*").eq("id", id).single();

  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminHeader title={item?.name ?? "Editar patrocinador"} subtitle="Colaborador" backHref="/patrocinadores" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {item ? (
          <p className="text-neutral-600">Editar: {item.name}. Formulario (migrar desde Astro).</p>
        ) : (
          <p className="text-neutral-600">No encontrado. <Link href="/patrocinadores" className="text-blue-600 hover:underline">Volver</Link></p>
        )}
      </main>
    </div>
  );
}
