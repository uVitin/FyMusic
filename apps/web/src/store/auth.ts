import { create } from "zustand";

export type User = {
  id: string;
  email: string;
  displayName: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  // Salva usuário + token (após login/cadastro)
  setAuth: (user: User, accessToken: string) => void;
  // Atualiza só o token (após refresh)
  setAccessToken: (accessToken: string) => void;
  // Limpa tudo (logout)
  clearAuth: () => void;
};

// Estado global de autenticação. O access token vive apenas em memória
// (mais seguro que localStorage contra XSS). O refresh token fica no cookie httpOnly.
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  setAuth: (user, accessToken) => set({ user, accessToken }),
  setAccessToken: (accessToken) => set({ accessToken }),
  clearAuth: () => set({ user: null, accessToken: null }),
}));