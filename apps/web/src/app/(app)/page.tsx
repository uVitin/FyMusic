"use client";

import { useAuthStore } from "@/store/auth";
import { Section } from "@/components/section";
import { AlbumCard } from "@/components/album-card";

// Saudação que muda conforme a hora do dia (como no Spotify)
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

// Dados de exemplo (serão substituídos por dados reais da Spotify API)
const quickPicks = [
  { title: "Músicas Curtidas", gradient: "from-indigo-400 to-indigo-700" },
  { title: "Pop Brasil", gradient: "from-pink-500 to-rose-700" },
  { title: "Rock Clássico", gradient: "from-red-500 to-orange-700" },
  { title: "Foco Total", gradient: "from-emerald-500 to-teal-700" },
  { title: "Lançamentos", gradient: "from-purple-500 to-fuchsia-700" },
  { title: "Sertanejo", gradient: "from-amber-500 to-yellow-700" },
];

const feitoParaVoce = [
  { title: "Mix do Dia", subtitle: "As que você mais ouve", gradient: "from-purple-500 to-indigo-800" },
  { title: "Descobertas da Semana", subtitle: "Novidades pra você", gradient: "from-emerald-500 to-cyan-800" },
  { title: "Mix Pop", subtitle: "Dua Lipa, The Weeknd e mais", gradient: "from-pink-500 to-purple-800" },
  { title: "Mix Rock", subtitle: "Foo Fighters, Arctic Monkeys...", gradient: "from-red-500 to-rose-900" },
  { title: "Mix Relax", subtitle: "Para desacelerar", gradient: "from-sky-500 to-blue-900" },
];

const sucessosDoMomento = [
  { title: "Top Brasil", subtitle: "Os hits do momento", gradient: "from-yellow-400 to-amber-700" },
  { title: "Top Global", subtitle: "As mais tocadas do mundo", gradient: "from-lime-400 to-green-800" },
  { title: "Viral 50", subtitle: "Bombando agora", gradient: "from-fuchsia-500 to-pink-800" },
  { title: "Funk Hits", subtitle: "O grave que não para", gradient: "from-orange-500 to-red-800" },
  { title: "Indie Brasil", subtitle: "Joias independentes", gradient: "from-teal-400 to-emerald-800" },
];

export default function HomePage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="py-4">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">
        {greeting()}
        {user ? `, ${user.displayName}` : ""}
      </h1>

      {/* Acesso rápido (tiles) */}
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {quickPicks.map((q) => (
          <div
            key={q.title}
            className="flex cursor-pointer items-center gap-3 overflow-hidden rounded-md bg-white/10 transition hover:bg-white/20"
          >
            <div className={`h-12 w-12 shrink-0 bg-gradient-to-br ${q.gradient}`} />
            <span className="truncate text-sm font-semibold">{q.title}</span>
          </div>
        ))}
      </div>

      <Section title="Feito para você">
        {feitoParaVoce.map((item) => (
          <AlbumCard key={item.title} {...item} />
        ))}
      </Section>

      <Section title="Sucessos do momento">
        {sucessosDoMomento.map((item) => (
          <AlbumCard key={item.title} {...item} />
        ))}
      </Section>
    </div>
  );
}