import { apiFetch } from "./api";
import type { Track } from "./music-api";

export function getLikes() {
  return apiFetch<Track[]>("/likes");
}

export function likeTrack(track: Track) {
  // O backend espera "trackId" (e não "id"); mapeamos aqui.
  return apiFetch("/likes", {
    method: "POST",
    body: JSON.stringify({ ...track, trackId: track.id }),
  });
}

export function unlikeTrack(trackId: number) {
  return apiFetch(`/likes/${trackId}`, { method: "DELETE" });
}