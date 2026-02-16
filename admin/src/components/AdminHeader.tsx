"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type AdminHeaderProps = {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  extra?: React.ReactNode;
};

export function AdminHeader({
  title,
  subtitle,
  backHref = "/dashboard",
  backLabel = "Panel",
  extra,
}: AdminHeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    if (!confirm("¿Cerrar sesión?")) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {backHref && (
            <Link
              href={backHref}
              className="text-neutral-600 hover:text-neutral-900 transition-colors p-2 hover:bg-neutral-100 rounded-lg flex items-center gap-2"
              title={backLabel}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline text-sm font-medium">{backLabel}</span>
            </Link>
          )}
          <div className="h-6 w-px bg-neutral-200" />
          <div>
            <h1 className="font-semibold text-neutral-900">{title}</h1>
            {subtitle && <p className="text-xs text-neutral-500">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {extra}
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}
