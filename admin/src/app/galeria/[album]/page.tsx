import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/AdminHeader";

export default async function AlbumPage({ params }: { params: Promise<{ album: string }> }) {
  const { album: albumId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: album } = await supabase.from("albums").select("*").eq("id", albumId).single();
  const { data: photos } = await supabase.from("photos").select("*").eq("album_id", albumId).limit(50);

  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminHeader title={album?.name ?? "Álbum"} subtitle="Fotos" backHref="/galeria" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {album ? (
          <p className="text-neutral-600 mb-6">Fotos: {(photos ?? []).length}. Gestión completa (migrar desde Astro).</p>
        ) : (
          <p className="text-neutral-600">Álbum no encontrado. <Link href="/galeria" className="text-blue-600 hover:underline">Volver</Link></p>
        )}
      </main>
    </div>
  );
}
