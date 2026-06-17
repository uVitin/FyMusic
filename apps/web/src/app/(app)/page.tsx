"use client";

import { useAuthStore } from "@/store/auth";

// Saudação que muda conforme a hora do dia (como no Spotify)
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export default function HomePage() {
  const user = useAuthStore((s) => s.user);

  return (
    <section className="py-4">
      <h1 className="text-2xl font-bold sm:text-3xl">
        {greeting()}
        {user ? `, ${user.displayName}` : ""}
      </h1>
      <p className="mt-2 text-neutral-400">
        Em breve: suas playlists e recomendações. 🎵
      </p>
    </section>
  );
}