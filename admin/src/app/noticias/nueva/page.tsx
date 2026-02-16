import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/AdminHeader";

export default async function NoticiaNuevaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminHeader title="Nueva Noticia" subtitle="Crear comunicado" backHref="/noticias" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-neutral-600">Formulario de nueva noticia (migrar desde Astro).</p>
      </main>
    </div>
  );
}
