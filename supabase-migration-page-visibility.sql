-- =============================================================================
-- METRIO WEB – Añadir columna page_visibility a clubs
--
-- Ejecuta UNA VEZ en Supabase: Dashboard → SQL Editor → New query → Pegar → Run
--
-- Añade la columna si no existe y actualiza todas las filas existentes con el
-- valor por defecto (todas las secciones visibles). No modifica otras tablas:
-- page_visibility solo existe en clubs.
-- =============================================================================

-- Añadir columna (JSONB: { "saludo": true, "contacto": true, ... })
ALTER TABLE public.clubs
ADD COLUMN IF NOT EXISTS page_visibility jsonb;

-- Valor por defecto para nuevos clubs y para filas que tengan NULL
UPDATE public.clubs
SET page_visibility = COALESCE(
  page_visibility,
  '{"saludo":true,"contacto":true,"galeria":true,"valores":true,"patrocinadores":true,"historia":true,"equipos":true,"jornadas":true,"noticias":true}'::jsonb
)
WHERE page_visibility IS NULL;

-- Opcional: dejar un default a nivel de tabla para futuros INSERT
ALTER TABLE public.clubs
ALTER COLUMN page_visibility SET DEFAULT '{"saludo":true,"contacto":true,"galeria":true,"valores":true,"patrocinadores":true,"historia":true,"equipos":true,"jornadas":true,"noticias":true}'::jsonb;

-- Comprobar (ejecutar y revisar):
-- SELECT id, name, slug, page_visibility FROM public.clubs LIMIT 5;
