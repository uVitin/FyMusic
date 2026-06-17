"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth";

export default function Home() {
  const user = useAuthStore((s) => s.user);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-4xl font-bold">
        <span className="text-primary">Fy</span>Music
      </h1>

      {user ? (
        <p className="text-lg text-neutral-300">
          Olá,{" "}
          <span className="font-semibold text-white">{user.displayName}</span> 👋
        </p>
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