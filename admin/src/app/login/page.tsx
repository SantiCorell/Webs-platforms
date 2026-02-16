"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (err) {
      const isInvalid =
        err.message?.toLowerCase().includes("invalid login credentials") ||
        err.message?.toLowerCase().includes("invalid_credentials");
      setError(
        isInvalid
          ? "Email o contraseña incorrectos."
          : "Error de conexión: " + (err.message || "Revisa la consola.")
      );
      return;
    }
    if (data.session) {
      router.push(redirectTo);
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-8">
        <h1 className="text-2xl font-semibold text-white mb-2">
          Acceso administración
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          Inicia sesión para gestionar tu club
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
          <input
            name="email"
            type="email"
            placeholder="tu@email.com"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-black font-semibold py-2 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
          {error && (
            <div
              role="alert"
              className="mt-4 p-4 rounded-lg bg-red-950/90 border border-red-500 text-red-100 text-sm"
            >
              {error}
            </div>
          )}
        </form>
        <p className="mt-4 text-center text-gray-500 text-xs">
          Tras iniciar sesión irás al panel de administración.
        </p>
      </div>
    </div>
  );
}
