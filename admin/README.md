# Metrio Admin (Next.js)

Panel de administración de Metrio, migrado de Astro a Next.js. Misma UX/UI y funcionalidad (login, dashboard, datos del club, noticias, patrocinadores, galería, equipos, usuarios).

## Requisitos

- Node 18+
- Mismo proyecto Supabase que la web pública (Astro). Mismas variables de entorno.

## Instalación

```bash
cd admin
cp .env.local.example .env.local
# Edita .env.local con NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY (los mismos que en la raíz del proyecto)
npm install
npm run dev
```

El panel estará en **http://localhost:3000**. La web pública (Astro) sigue en **http://localhost:4321**.

## Rutas

- `/` → redirige a `/dashboard` o `/login`
- `/login` — Inicio de sesión
- `/dashboard` — Panel principal (módulos, contadores)
- `/club` — Datos institucionales (solo admin)
- `/club/usuarios` — Gestión de usuarios (solo admin)
- `/noticias` — Listado y enlaces a nueva/editar
- `/patrocinadores` — Listado y enlaces
- `/galeria` — Álbumes; `/galeria/[id]` — Fotos del álbum
- `/equipos` — Equipos (solo admin)
- `/update-password`, `/reset-password` — Contraseñas (stub)

## Notas

- Algunas pantallas (nueva/editar noticia, nuevo/editar patrocinador, subida de fotos) están como stub; se puede migrar el formulario completo desde Astro cuando lo necesites.
- La API de actualización del club está en `/api/admin/club` (POST). Las APIs de equipos y demás se pueden añadir en `src/app/api/admin/`.
