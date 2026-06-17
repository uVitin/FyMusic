import { create } from "zustand";
import type { Track } from "@/lib/music-api";

type PlayerState = {
  current: Track | null;
  isPlaying: boolean;
  // Toca uma faixa nova (define como atual e começa a tocar)
  playTrack: (track: Track) => void;
  // Alterna play/pause da faixa atual
  togglePlay: () => void;
  // Sincroniza o estado com o elemento <audio> (ex.: quando a faixa termina)
  setIsPlaying: (value: boolean) => void;
};

export const usePlayerStore = create<PlayerState>((set) => ({
  current: null,
  isPlaying: false,
  playTrack: (track) => set({ current: track, isPlaying: true }),
  togglePlay: () =>
    set((state) => ({ isPlaying: state.current ? !state.isPlaying : false })),
  setIsPlaying: (value) => set({ isPlaying: value }),
}));