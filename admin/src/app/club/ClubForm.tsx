"use client";

import { useState } from "react";

const VISIBILITY_KEYS = ["saludo", "contacto", "galeria", "valores", "patrocinadores", "historia", "equipos", "jornadas", "noticias"] as const;

type InitialData = {
  clubId: string;
  name: string;
  slug: string;
  description: string;
  defaultColor: string;
  email: string;
  phone: string;
  address: string;
  domain: string;
  president_name: string;
  president_greeting: string;
  president_photo_url: string;
  values_content: string;
  page_visibility: Record<string, boolean>;
  logo_url: string;
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  founded_year: number | null;
  tax_id: string;
  office_hours: string;
  ffcv_club_id: string;
  ffcv_id_temp: string;
  ffcv_id_competicion: string;
  ffcv_id_torneo: string;
  ffcv_id_modalidad: string;
};

export function ClubForm({ initialData }: { initialData: InitialData }) {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialData);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("");
    setLoading(true);
    const visibility: Record<string, boolean> = {};
    VISIBILITY_KEYS.forEach((k) => {
      visibility[k] = (e.target as HTMLFormElement).querySelector<HTMLInputElement>(`[name="pv_${k}"]`)?.checked ?? true;
    });
    const payload = {
      name: form.name,
      slug: form.slug,
      color: form.defaultColor,
      email: form.email,
      phone: form.phone,
      address: form.address,
      domain: form.domain,
      description: form.description,
      president_name: form.president_name,
      president_greeting: form.president_greeting,
      president_photo_url: form.president_photo_url,
      values_content: form.values_content,
      page_visibility: visibility,
      logo_url: form.logo_url,
      facebook: form.facebook,
      instagram: form.instagram,
      twitter: form.twitter,
      youtube: form.youtube,
      founded_year: form.founded_year || null,
      tax_id: form.tax_id,
      office_hours: form.office_hours,
      ffcv_club_id: form.ffcv_club_id,
      ffcv_id_temp: form.ffcv_id_temp,
      ffcv_id_competicion: form.ffcv_id_competicion,
      ffcv_id_torneo: form.ffcv_id_torneo,
      ffcv_id_modalidad: form.ffcv_id_modalidad,
    };
    try {
      const res = await fetch("/api/admin/club", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("Error: " + (data.error || res.statusText));
        return;
      }
      setStatus("Guardado correctamente.");
    } catch (err) {
      setStatus("Error de conexión.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full rounded-lg border border-neutral-300 px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500";
  const labelClass = "block text-sm font-medium text-neutral-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="bg-white rounded-xl border border-neutral-200 p-6 space-y-6">
        <h3 className="text-lg font-semibold text-neutral-900">Datos básicos</h3>
        <div>
          <label className={labelClass}>Nombre del club</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Slug (URL)</label>
          <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            className={inputClass}
            placeholder="cf-godella"
          />
        </div>
        <div>
          <label className={labelClass}>Color principal</label>
          <input
            type="text"
            name="color"
            value={form.defaultColor}
            onChange={(e) => setForm((f) => ({ ...f, defaultColor: e.target.value }))}
            className={inputClass}
            placeholder="#dc2626"
          />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Teléfono</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Dirección</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            className={inputClass}
          />
        </div>
      </section>

      <section className="bg-white rounded-xl border border-neutral-200 p-6 space-y-6">
        <h3 className="text-lg font-semibold text-neutral-900">Contenido web</h3>
        <div>
          <label className={labelClass}>Saludo del presidente</label>
          <textarea
            name="president_greeting"
            rows={4}
            value={form.president_greeting}
            onChange={(e) => setForm((f) => ({ ...f, president_greeting: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Foto del presidente (URL)</label>
          <input
            type="url"
            name="president_photo_url"
            value={form.president_photo_url}
            onChange={(e) => setForm((f) => ({ ...f, president_photo_url: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Valores del club</label>
          <textarea
            name="values_content"
            rows={4}
            value={form.values_content}
            onChange={(e) => setForm((f) => ({ ...f, values_content: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <p className={labelClass}>Visibilidad de páginas</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {VISIBILITY_KEYS.map((key) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name={`pv_${key}`}
                  defaultChecked={form.page_visibility[key] !== false}
                  className="rounded border-neutral-300"
                />
                <span className="text-sm capitalize">{key === "galeria" ? "Galería" : key}</span>
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-neutral-200 p-6 space-y-6">
        <h3 className="text-lg font-semibold text-neutral-900">FFCV — Clasificación y partidos</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {(
            [
              ["ffcv_club_id", "club_id (código club FFCV)", "2666"],
              ["ffcv_id_temp", "id_temp (temporada)", "21"],
              ["ffcv_id_competicion", "id_competicion", ""],
              ["ffcv_id_torneo", "id_torneo", ""],
              ["ffcv_id_modalidad", "id_modalidad", ""],
            ] as const
          ).map(([name, label, placeholder]) => (
            <div key={name}>
              <label className={labelClass}>{label}</label>
              <input
                type="text"
                name={name}
                value={form[name]}
                onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
                className={inputClass}
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end items-center gap-4">
        <span className="text-sm text-neutral-500 min-h-[1.2rem]">{status}</span>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition disabled:opacity-60"
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
