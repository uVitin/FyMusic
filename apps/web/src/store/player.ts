import { create } from "zustand";
import type { Track } from "@/lib/music-api";

type PlayerState = {
  current: Track | null;
  isPlaying: boolean;
  progress: number; // segundo atual do áudio
  duration: number; // duração total (do preview, ~30s)
  volume: number; // 0 a 1
  seekRequest: number | null; // segundo solicitado pela UI (consumido pelo motor)

  playTrack: (track: Track) => void;
  togglePlay: () => void;
  setIsPlaying: (value: boolean) => void;
  setProgress: (value: number) => void;
  setDuration: (value: number) => void;
  setVolume: (value: number) => void;
  requestSeek: (value: number) => void;
  clearSeekRequest: () => void;
};

export const usePlayerStore = create<PlayerState>((set) => ({
  current: null,
  isPlaying: false,
  progress: 0,
  duration: 0,
  volume: 1,
  seekRequest: null,

  playTrack: (track) => set({ current: track, isPlaying: true, progress: 0 }),
  togglePlay: () =>
    set((state) => ({ isPlaying: state.current ? !state.isPlaying : false })),
  setIsPlaying: (value) => set({ isPlaying: value }),
  setProgress: (value) => set({ progress: value }),
  setDuration: (value) => set({ duration: value }),
  setVolume: (value) => set({ volume: value }),
  // UI pede o seek; já atualiza o progress pra resposta visual imediata
  requestSeek: (value) => set({ seekRequest: value, progress: value }),
  clearSeekRequest: () => set({ seekRequest: null }),
}));