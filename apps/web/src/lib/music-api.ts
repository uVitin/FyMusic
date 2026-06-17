import { apiFetch } from "./api";

export type Album = {
  id: number;
  name: string;
  artist: string;
  image: string | null;
};

export type Track = {
  id: number;
  title: string;
  artist: string;
  album: string;
  image: string | null;
  preview: string;
  duration: number;
};

export function getHomeAlbums() {
  return apiFetch<Album[]>("/music/home");
}

export function searchTracks(q: string) {
  return apiFetch<Track[]>(`/music/search?q=${encodeURIComponent(q)}`);
}