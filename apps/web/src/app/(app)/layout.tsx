"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { Topbar } from "@/components/topbar";
import { PlayerBar } from "@/components/player-bar";
import { AudioEngine } from "@/components/audio-engine";

// Layout da área autenticada (route group "(app)").
// Protege as rotas: se não houver usuário logado, manda pro /login.
export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  // Enquanto carrega a sessão (ou redireciona), mostra um loading
  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-neutral-400">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto px-4 pb-8 lg:px-6">
            {children}
          </main>
        </div>
      </div>
      <AudioEngine />
      <PlayerBar />
      <MobileNav />
    </div>
  );
}