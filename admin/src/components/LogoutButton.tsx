"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton({ className, children }: { className?: string; children: React.ReactNode }) {
  const router = useRouter();

  async function handleLogout() {
    if (!confirm("¿Cerrar sesión?")) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button type="button" onClick={handleLogout} className={className}>
      {children}
    </button>
  );
}
