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

export type AlbumDetail = Album & {
  tracks: Track[];
};

export function getHomeAlbums() {
  return apiFetch<Album[]>("/music/home");
}

export function getAlbum(id: string | number) {
  return apiFetch<AlbumDetail>(`/music/album/${id}`);
}

export function searchTracks(q: string) {
  return apiFetch<Track[]>(`/music/search?q=${encodeURIComponent(q)}`);
}