import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/AdminHeader";
import { ClubForm } from "./ClubForm";

export default async function ClubPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role, club_id").eq("id", user.id).single();
  if (!profile || profile.role !== "admin") redirect("/dashboard");

  const { data: clubData } = await supabase.from("clubs").select("*").eq("id", profile.club_id).single();
  if (!clubData) redirect("/dashboard");

  const defaultVisibility: Record<string, boolean> = {
    saludo: true, contacto: true, galeria: true, valores: true,
    patrocinadores: true, historia: true, equipos: true, jornadas: true, noticias: true,
  };
  const pageVisibility = (clubData.page_visibility as Record<string, boolean>) ?? defaultVisibility;

  const clientData = {
    clubId: clubData.id,
    name: clubData.name ?? "",
    slug: clubData.slug ?? "",
    description: clubData.description ?? "",
    defaultColor: clubData.color ?? clubData.default_color ?? "",
    email: clubData.email ?? "",
    phone: clubData.phone ?? "",
    address: clubData.address ?? "",
    domain: clubData.domain ?? "",
    president_name: clubData.president_name ?? "",
    president_greeting: clubData.president_greeting ?? "",
    president_photo_url: clubData.president_photo_url ?? "",
    values_content: clubData.values_content ?? "",
    page_visibility: pageVisibility,
    logo_url: clubData.logo_url ?? "",
    facebook: clubData.facebook ?? "",
    instagram: clubData.instagram ?? "",
    twitter: clubData.twitter ?? "",
    youtube: clubData.youtube ?? "",
    founded_year: clubData.founded_year ?? null,
    tax_id: clubData.tax_id ?? "",
    office_hours: clubData.office_hours ?? "",
    ffcv_club_id: clubData.ffcv_club_id ?? "",
    ffcv_id_temp: clubData.ffcv_id_temp ?? "",
    ffcv_id_competicion: clubData.ffcv_id_competicion ?? "",
    ffcv_id_torneo: clubData.ffcv_id_torneo ?? "",
    ffcv_id_modalidad: clubData.ffcv_id_modalidad ?? "",
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminHeader title="Datos Institucionales" subtitle="Identidad oficial y configuración del club" backHref="/dashboard" />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-3">Configuración del Club</h2>
          <p className="text-neutral-600 max-w-3xl">
            Esta información se utiliza en la web pública, documentos oficiales y comunicaciones del club.
          </p>
        </div>
        <ClubForm initialData={clientData} />
      </main>
    </div>
  );
}
