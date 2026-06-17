"use client";

import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/player";

// "Motor" de áudio: um único elemento <audio> que reage ao estado do player.
// Fica montado no layout, então a música continua tocando ao navegar entre páginas.
export function AudioEngine() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const current = usePlayerStore((s) => s.current);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const setIsPlaying = usePlayerStore((s) => s.setIsPlaying);

  // Ao trocar de faixa, atualiza a fonte do áudio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    audio.src = current.preview;
  }, [current]);

  // Toca ou pausa conforme o estado (e quando a faixa muda)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    if (isPlaying) {
      // play() pode falhar (ex.: bloqueio de autoplay) -> volta o estado pra pausado
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, current, setIsPlaying]);

  return <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />;
}