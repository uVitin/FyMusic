"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/auth-api";
import { useAuthStore } from "@/store/auth";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { user, accessToken } = await login(email, password);
      setAuth(user, accessToken); // guarda usuário + token na store
      router.push("/"); // redireciona pra home
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao entrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#1f1f1f] to-black px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold">
        <span className="text-primary">Fy</span>Music
      </h1>

      <div className="w-full max-w-md rounded-lg bg-[#121212] p-6 sm:p-8">
        <h2 className="mb-6 text-center text-2xl font-bold sm:text-3xl">
          Entre no FyMusic
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-semibold">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              className="rounded border border-neutral-700 bg-neutral-900 px-3 py-3 text-sm outline-none transition focus:border-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-semibold">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              className="rounded border border-neutral-700 bg-neutral-900 px-3 py-3 text-sm outline-none transition focus:border-white"
            />
          </div>

          {error && (
            <p className="rounded bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-primary py-3 font-bold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-8 border-t border-neutral-800 pt-6 text-center text-sm text-neutral-400">
          Não tem uma conta?{" "}
          <Link href="/register" className="font-semibold text-white underline">
            Inscreva-se no FyMusic
          </Link>
        </p>
      </div>
    </main>
  );
}