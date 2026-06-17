"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { logout } from "@/lib/auth-api";

export default function Home() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  async function handleLogout() {
    try {
      await logout(); // limpa o cookie no backend
    } finally {
      clearAuth(); // limpa o estado no frontend
    }
  }

  // Enquanto tenta restaurar a sessão, evita o "flash" do botão Entrar
  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-neutral-400">Carregando...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-4xl font-bold">
        <span className="text-primary">Fy</span>Music
      </h1>

      {user ? (
        <>
          <p className="text-lg text-neutral-300">
            Olá,{" "}
            <span className="font-semibold text-white">{user.displayName}</span> 👋
          </p>
          <button
            onClick={handleLogout}
            className="rounded-full border border-neutral-600 px-6 py-2 text-sm font-semibold transition hover:border-white"
          >
            Sair
          </button>
        </>
      ) : (
        <Link
          href="/login"
          className="rounded-full bg-primary px-8 py-3 font-bold text-black transition hover:scale-[1.03]"
        >
          Entrar
        </Link>
      )}
    </main>
  );
}