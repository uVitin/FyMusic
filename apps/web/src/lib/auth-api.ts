import { apiFetch } from "./api";
import type { User } from "@/store/auth";

type AuthResponse = { user: User; accessToken: string };

export function login(email: string, password: string) {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function register(email: string, displayName: string, password: string) {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, displayName, password }),
  });
}

export function getMe() {
  return apiFetch<User>("/auth/me");
}

export function refresh() {
  return apiFetch<{ accessToken: string }>("/auth/refresh", { method: "POST" });
}

export function logout() {
  return apiFetch<{ message: string }>("/auth/logout", { method: "POST" });
}