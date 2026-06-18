import { apiFetch } from "./api";
import type { Track } from "./music-api";

export type PlaylistSummary = { id: string; name: string; trackCount: number };
export type PlaylistDetail = { id: string; name: string; tracks: Track[] };

export function getPlaylists() {
  return apiFetch<PlaylistSummary[]>("/playlists");
}

export function createPlaylist(name: string) {
  return apiFetch<{ id: string; name: string }>("/playlists", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export function getPlaylist(id: string) {
  return apiFetch<PlaylistDetail>(`/playlists/${id}`);
}

export function deletePlaylist(id: string) {
  return apiFetch(`/playlists/${id}`, { method: "DELETE" });
}

export function addTrackToPlaylist(id: string, track: Track) {
  // backend espera "trackId" (não "id")
  return apiFetch(`/playlists/${id}/tracks`, {
    method: "POST",
    body: JSON.stringify({ ...track, trackId: track.id }),
  });
}

export function removeTrackFromPlaylist(id: string, trackId: number) {
  return apiFetch(`/playlists/${id}/tracks/${trackId}`, { method: "DELETE" });
}