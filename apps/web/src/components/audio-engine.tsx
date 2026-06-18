"use client";

import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/player";

// "Motor" de áudio: um único elemento <audio> que reage ao estado do player.
// Fica montado no layout, então a música continua tocando ao navegar entre páginas.
export function AudioEngine() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const current = usePlayerStore((s) => s.current);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const volume = usePlayerStore((s) => s.volume);
  const seekRequest = usePlayerStore((s) => s.seekRequest);
  const next = usePlayerStore((s) => s.next);
  const setIsPlaying = usePlayerStore((s) => s.setIsPlaying);
  const setProgress = usePlayerStore((s) => s.setProgress);
  const setDuration = usePlayerStore((s) => s.setDuration);
  const clearSeekRequest = usePlayerStore((s) => s.clearSeekRequest);

  // Ao trocar de faixa, atualiza a fonte do áudio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    audio.src = current.preview;
  }, [current]);

  // Toca ou pausa conforme o estado
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, current, setIsPlaying]);

  // Aplica o volume escolhido na UI
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
  }, [volume]);

  // Aplica um pedido de seek vindo da barra de progresso
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && seekRequest !== null) {
      audio.currentTime = seekRequest;
      clearSeekRequest();
    }
  }, [seekRequest, clearSeekRequest]);

  return (
    <audio
      ref={audioRef}
      onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
      onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      onEnded={() => next()}
    />
  );
}