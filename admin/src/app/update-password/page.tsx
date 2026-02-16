import { AdminHeader } from "@/components/AdminHeader";

export default function UpdatePasswordPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminHeader title="Cambiar contraseña" backHref="/dashboard" />
      <main className="max-w-xl mx-auto px-4 py-8">
        <p className="text-neutral-600">Formulario cambiar contraseña (migrar desde Astro).</p>
      </main>
    </div>
  );
}
