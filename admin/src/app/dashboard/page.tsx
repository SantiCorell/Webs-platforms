import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/LogoutButton";

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  editor: "Editor",
  cronica: "Cronista",
  fotografo: "Fotógrafo",
  fotos: "Fotos",
};
const ALLOWED_BY_MODULE: Record<string, string[]> = {
  noticias: ["admin", "editor", "cronica"],
  galeria: ["admin", "editor", "fotografo", "fotos"],
  patrocinadores: ["admin", "editor"],
  equipos: ["admin"],
  club: ["admin"],
  usuarios: ["admin"],
};

function ModuleCard({
  dataModule,
  href,
  title,
  description,
  badge,
  iconBg,
  borderClass,
  hidden,
}: {
  dataModule: string;
  href: string;
  title: string;
  description: string;
  badge?: string;
  iconBg: string;
  borderClass: string;
  hidden?: boolean;
}) {
  if (hidden) return null;
  return (
    <Link
      data-module={dataModule}
      href={href}
      className={`group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-neutral-200 ${borderClass}`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg w-fit ${iconBg}`}>
            <svg className="w-6 h-6 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          {badge && (
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {badge}
            </span>
          )}
        </div>
        <h4 className="text-lg font-semibold text-neutral-900 group-hover:text-blue-700 mb-2">
          {title}
        </h4>
        <p className="text-sm text-neutral-600 mb-4">{description}</p>
        <div className="flex items-center text-sm text-blue-600 font-medium">
          <span>Acceder al módulo</span>
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, club_id")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "editor";
  const clubId = profile?.club_id ?? "";

  const [newsRes, sponsorsRes, albumsRes] = await Promise.all([
    supabase.from("news").select("*", { count: "exact", head: true }).eq("club_id", clubId),
    supabase.from("sponsors").select("*", { count: "exact", head: true }).eq("club_id", clubId),
    supabase.from("albums").select("*", { count: "exact", head: true }).eq("club_id", clubId),
  ]);

  const countNews = newsRes.count ?? 0;
  const countSponsors = sponsorsRes.count ?? 0;
  const countAlbums = albumsRes.count ?? 0;

  const can = (module: string) => ALLOWED_BY_MODULE[module]?.includes(role) ?? false;

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-neutral-900">Panel de Administración</h1>
              <p className="text-xs text-neutral-500">Club Deportivo · Área Privada</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-neutral-600 hidden md:inline">Sesión activa</span>
            <LogoutButton className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Cerrar Sesión</span>
            </LogoutButton>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between md:space-x-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
                  Bienvenido al panel de control
                </h2>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                  {ROLE_LABELS[role] ?? role}
                </span>
              </div>
              <p className="text-neutral-600 max-w-2xl">
                Desde aquí podrás gestionar todos los contenidos del club.
              </p>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 inline-block">
                <p className="text-sm text-blue-800 flex items-center">
                  <span className="mr-2">Conectado como:</span>
                  <span className="font-semibold">{user.email}</span>
                </p>
              </div>
            </div>
            <div className="mt-6 md:mt-0">
              <a
                href={process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4321"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-3 bg-white border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-all duration-200 shadow-sm"
              >
                Ver sitio público
              </a>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <div className="h-3 w-3 bg-green-500 rounded-full mr-2 animate-pulse" />
                  <span className="text-sm font-medium text-green-700">SISTEMA OPERATIVO</span>
                </div>
                <h3 className="text-xl font-bold text-neutral-900">Portal activo y funcionando</h3>
                <p className="text-neutral-600 mt-1">Todos los servicios están operativos.</p>
              </div>
              <div className="flex space-x-3 mt-4 md:mt-0">
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-blue-600">24/7</div>
                  <div className="text-xs text-neutral-500 mt-1">Disponibilidad</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-green-600">100%</div>
                  <div className="text-xs text-neutral-500 mt-1">Rendimiento</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-neutral-900 mb-6">Módulos de Gestión</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ModuleCard
            dataModule="noticias"
            href="/noticias"
            title="Gestión de Noticias"
            description="Publica comunicados oficiales, novedades y actualizaciones del club."
            badge="PRINCIPAL"
            iconBg="bg-blue-50 text-blue-600 group-hover:bg-blue-100"
            borderClass="border-l-4 border-l-blue-600 hover:border-blue-200"
            hidden={!can("noticias")}
          />
          <ModuleCard
            dataModule="galeria"
            href="/galeria"
            title="Galería Multimedia"
            description="Administra álbumes fotográficos y el archivo multimedia del club."
            iconBg="bg-purple-50 text-purple-600 group-hover:bg-purple-100"
            borderClass="hover:border-purple-200"
            hidden={!can("galeria")}
          />
          <ModuleCard
            dataModule="patrocinadores"
            href="/patrocinadores"
            title="Patrocinadores"
            description="Controla la visibilidad de colaboradores y actualiza logos."
            iconBg="bg-green-50 text-green-600 group-hover:bg-green-100"
            borderClass="hover:border-green-200"
            hidden={!can("patrocinadores")}
          />
          <ModuleCard
            dataModule="equipos"
            href="/equipos"
            title="Equipos y categorías"
            description="Configura las categorías y el número de jugadores por equipo."
            iconBg="bg-teal-50 text-teal-600 group-hover:bg-teal-100"
            borderClass="hover:border-teal-200"
            hidden={!can("equipos")}
          />
          <ModuleCard
            dataModule="club"
            href="/club"
            title="Datos Institucionales"
            description="Información oficial del club, contacto y configuración."
            iconBg="bg-orange-50 text-orange-600 group-hover:bg-orange-100"
            borderClass="hover:border-orange-200"
            hidden={!can("club")}
          />
          <ModuleCard
            dataModule="usuarios"
            href="/club/usuarios"
            title="Gestión de Usuarios"
            description="Control de permisos, roles de acceso y cuentas autorizadas."
            iconBg="bg-neutral-100 text-neutral-600"
            borderClass="hover:border-neutral-400"
            hidden={!can("usuarios")}
          />
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <p className="text-sm text-neutral-500">Noticias publicadas</p>
            <p className="text-3xl font-bold text-neutral-900 mt-1">{countNews}</p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <p className="text-sm text-neutral-500">Patrocinadores</p>
            <p className="text-3xl font-bold text-neutral-900 mt-1">{countSponsors}</p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <p className="text-sm text-neutral-500">Álbumes</p>
            <p className="text-3xl font-bold text-neutral-900 mt-1">{countAlbums}</p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-neutral-200 text-sm text-neutral-500">
          <p>Club Deportivo · Panel de Administración (Next.js)</p>
          <p className="mt-1">© 2024 · Todos los derechos reservados</p>
        </div>
      </main>
    </div>
  );
}
