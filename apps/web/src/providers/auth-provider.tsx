"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useAuthStore } from "@/store/auth";
import { refresh, getMe } from "@/lib/auth-api";

// Ao montar o app, tenta restaurar a sessão:
// 1. pede um novo access token via /auth/refresh (usa o cookie httpOnly)
// 2. com o token, busca o usuário via /auth/me
// Se algo falhar, segue deslogado. No fim, marca isLoading = false.
export function AuthProvider({ children }: { children: ReactNode }) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const finishLoading = useAuthStore((s) => s.finishLoading);
  const started = useRef(false);

  useEffect(() => {
    // useRef evita rodar duas vezes no Strict Mode do desenvolvimento
    if (started.current) return;
    started.current = true;

    (async () => {
      try {
        const { accessToken } = await refresh();
        setAccessToken(accessToken); // já deixa o token disponível pro getMe
        const user = await getMe();
        setAuth(user, accessToken);
      } catch {
        // sem sessão válida -> permanece deslogado
      } finally {
        finishLoading();
      }
    })();
  }, [setAuth, setAccessToken, finishLoading]);

  return <>{children}</>;
}