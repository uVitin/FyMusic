"use client";

import { useAuthStore } from "@/store/auth";
import { logout } from "@/lib/auth-api";

export function Topbar() {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  async function handleLogout() {
    try {
      await logout();
    } finally {
      clearAuth();
    }
  }

  return (
    <header className="flex items-center gap-3 px-4 py-3 lg:px-6">
      {/* Logo aparece só no mobile (no desktop ela está na sidebar) */}
      <span className="text-lg font-bold lg:hidden">
        <span className="text-primary">Fy</span>Music
      </span>

      <div className="ml-auto flex items-center gap-3">
        <span className="hidden text-sm text-neutral-300 sm:inline">
          {user?.displayName}
        </span>
        <button
          onClick={handleLogout}
          className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold transition hover:bg-white/20"
        >
          Sair
        </button>
      </div>
    </header>
  );
}