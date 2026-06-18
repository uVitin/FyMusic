import { create } from "zustand";
import type { Track } from "@/lib/music-api";

type PlayerState = {
  queue: Track[]; // a fila de reprodução
  index: number; // posição atual na fila (-1 = nada)
  current: Track | null;
  isPlaying: boolean;
  progress: number; // segundo atual do áudio
  duration: number; // duração total (do preview, ~30s)
  volume: number; // 0 a 1
  seekRequest: number | null; // segundo solicitado pela UI (consumido pelo motor)

  // Toca uma lista de faixas a partir de uma posição (define a fila)
  playQueue: (tracks: Track[], startIndex?: number) => void;
  // Toca uma única faixa (atalho: fila de 1)
  playTrack: (track: Track) => void;
  next: () => void;
  previous: () => void;
  togglePlay: () => void;
  setIsPlaying: (value: boolean) => void;
  setProgress: (value: number) => void;
  setDuration: (value: number) => void;
  setVolume: (value: number) => void;
  requestSeek: (value: number) => void;
  clearSeekRequest: () => void;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  queue: [],
  index: -1,
  current: null,
  isPlaying: false,
  progress: 0,
  duration: 0,
  volume: 1,
  seekRequest: null,

  playQueue: (tracks, startIndex = 0) => {
    const current = tracks[startIndex] ?? null;
    set({
      queue: tracks,
      index: current ? startIndex : -1,
      current,
      isPlaying: !!current,
      progress: 0,
    });
  },

  playTrack: (track) => get().playQueue([track], 0),

  next: () => {
    const { queue, index } = get();
    if (index < queue.length - 1) {
      const nextIndex = index + 1;
      set({
        index: nextIndex,
        current: queue[nextIndex],
        isPlaying: true,
        progress: 0,
      });
    } else {
      set({ isPlaying: false }); // chegou ao fim da fila
    }
  },

  previous: () => {
    const { queue, index, progress, current } = get();
    // Passou de 3s? "anterior" reinicia a faixa atual (como no Spotify)
    if (progress > 3 && current) {
      set({ seekRequest: 0, progress: 0, isPlaying: true });
      return;
    }
    if (index > 0) {
      const prevIndex = index - 1;
      set({
        index: prevIndex,
        current: queue[prevIndex],
        isPlaying: true,
        progress: 0,
      });
    } else {
      set({ seekRequest: 0, progress: 0 }); // já é a primeira -> reinicia
    }
  },

  togglePlay: () =>
    set((state) => ({ isPlaying: state.current ? !state.isPlaying : false })),
  setIsPlaying: (value) => set({ isPlaying: value }),
  setProgress: (value) => set({ progress: value }),
  setDuration: (value) => set({ duration: value }),
  setVolume: (value) => set({ volume: value }),
  requestSeek: (value) => set({ seekRequest: value, progress: value }),
  clearSeekRequest: () => set({ seekRequest: null }),
}));