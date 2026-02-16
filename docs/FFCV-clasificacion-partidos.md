# Clasificación y próximos partidos en la web del club

Para que en la página de inicio del club se muestren **clasificación** y **próximos partidos** (en lugar de "No hay datos..."), tienen que cumplirse estas condiciones:

## 1. El club debe existir en Supabase

La URL del club usa el **slug** (ej. `cf-godella`). Ese mismo club debe tener una fila en la tabla **`clubs`** de Supabase con ese `slug`. Si el club solo existe en los datos estáticos (`src/data/clubs.ts`) y no en la base de datos, la página no puede cargar la caché FFCV.

**Si no hay fila para tu club:** ejecuta el script **`supabase-seed-club-cf-godella.sql`** en el SQL Editor de Supabase (crea CF Godella). Luego asigna ese club a tu usuario en la tabla **`profiles`** (campo `club_id`) para poder editarlo en **Admin → Datos del club**.

**Comprobar en Supabase (SQL Editor):**
```sql
SELECT id, name, slug, ffcv_club_id, ffcv_id_temp, ffcv_id_competicion, ffcv_id_torneo, ffcv_id_modalidad
FROM clubs
WHERE slug = 'cf-godella';
```

- Si no devuelve ninguna fila, el club no está en la BD: hay que crearlo (desde el panel Admin → Datos del club, o con un `INSERT`).
- Si devuelve una fila pero `ffcv_club_id` (y el resto de campos FFCV) son NULL, el cron no actualizará la caché para ese club.

## 2. Campos FFCV rellenados

El cron que rellena clasificación y partidos solo procesa clubs que tienen **`ffcv_club_id`** (y, según el cron, los ids de temporada, competición, torneo y modalidad). Esos valores se obtienen de la web de la FFCV (resultadosffcv.isquad.es). Deben configurarse en el club en Supabase (o en el panel Admin si existe la pestaña de datos FFCV).

## 3. Haber ejecutado el cron FFCV

Después de que el club exista en Supabase con los campos FFCV rellenados, hay que ejecutar al menos una vez el refresco de la caché:

- **Cron (API):** `GET /api/cron/ffcv-refresh` con el header `x-cron-secret` configurado.
- **Script Python:** `python scripts/ffcv_refresh.py` (con `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`).

Eso escribe en **`club_ffcv_cache`** una fila con `club_id` = el UUID del club, `classification` y `next_matches`.

## 4. Variable de entorno `SUPABASE_SERVICE_ROLE_KEY`

Para que el **cron** pueda escribir en `club_ffcv_cache` y la web pueda leer (con prioridad service role), en tu **`.env`** debe estar la clave **service role** real:

- **Supabase** → **Project Settings** → **API** → copia el valor **"service_role"** (secret).
- Es un **JWT** que empieza por `eyJ...`. **No** uses `sb_publishable_...`; esa no es la service role.

Si esta variable falta o es incorrecta, el cron no rellenará la caché y la página no tendrá datos de respaldo.

## 5. Permisos (RLS) – lectura pública

Las tablas **`clubs`** y **`club_ffcv_cache`** deben permitir **SELECT** para cualquier visitante (usuarios anónimos). Para dejarlo configurado, ejecuta en el **SQL Editor** de Supabase el archivo:

**`supabase-policies-public-read.sql`**

Ese script crea políticas RLS que permiten `SELECT` público en ambas tablas, de modo que la portada del club pueda mostrar clasificación y próximos partidos sin que el usuario esté logueado.

---

**Resumen para CF Godella:** (1) En `.env`, poner `SUPABASE_SERVICE_ROLE_KEY` = JWT que empieza por `eyJ...`. (2) Crear/editar el club en Supabase con `slug = 'cf-godella'`, rellenar los campos FFCV. (3) Ejecutar el cron (o el script) para que se genere la fila en `club_ffcv_cache`. (4) Opcional: ejecutar `supabase-policies-public-read.sql` para lectura anónima. Después de eso, la portada mostrará clasificación y próximos partidos.
