import { supabase } from "../lib/supabase";
import {
  retrospectiveData,
  type RetrospectiveData,
  type RetrospectiveMemory,
} from "../data/retrospective";

type RetrospectiveRow = {
  id?: number | string;
  slug?: string | null;
  couple_name?: string | null;
  title?: string | null;
  subtitle?: string | null;
  start_date?: string | null;
  song_title?: string | null;
  artist_name?: string | null;
  audio_url?: string | null;
  lyrics?: unknown;
  cover_url?: string | null;
  story_photo_url?: string | null;
  memories?: unknown;
  created_at?: string | null;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const getString = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim() ? value : fallback;

const getOptionalString = (value: unknown) =>
  typeof value === "string" && value.trim() ? value : undefined;

const normalizeLyrics = (value: unknown) => {
  if (!Array.isArray(value)) {
    return retrospectiveData.lyrics;
  }

  const lyrics = value
    .filter((line): line is string => typeof line === "string")
    .map((line) => line.trim())
    .filter(Boolean);

  return lyrics.length > 0 ? lyrics : retrospectiveData.lyrics;
};

const normalizeMemories = (value: unknown): RetrospectiveMemory[] => {
  if (!Array.isArray(value) || value.length === 0) {
    return retrospectiveData.memories;
  }

  return value.slice(0, 6).map((memory, index) => {
    if (!isRecord(memory)) {
      return { id: index + 1 };
    }

    const imageUrl = memory.imageUrl ?? memory.image_url;

    return {
      id: typeof memory.id === "number" ? memory.id : index + 1,
      imageUrl: getOptionalString(imageUrl),
    };
  });
};

const adaptRetrospectiveRow = (row: RetrospectiveRow): RetrospectiveData => ({
  id: row.id === undefined ? undefined : String(row.id),
  slug: getOptionalString(row.slug),
  createdAt: getOptionalString(row.created_at),
  coupleName: getString(row.couple_name, retrospectiveData.coupleName),
  retrospectiveTitle: getString(row.title, retrospectiveData.retrospectiveTitle),
  subtitle: getString(row.subtitle, retrospectiveData.subtitle),
  coverUrl: getOptionalString(row.cover_url),
  storyPhotoUrl: getOptionalString(row.story_photo_url),
  songTitle: getString(row.song_title, retrospectiveData.songTitle),
  artistName: getString(row.artist_name, retrospectiveData.artistName),
  audioUrl: getString(row.audio_url, retrospectiveData.audioUrl),
  startDate: getString(row.start_date, retrospectiveData.startDate),
  lyrics: normalizeLyrics(row.lyrics),
  memories: normalizeMemories(row.memories),
});

export async function getRetrospectiveBySlug(
  slug: string,
): Promise<RetrospectiveData | null> {
  const normalizedSlug = slug.trim();

  if (!normalizedSlug) {
    return null;
  }

  const { data, error } = await supabase
    .from("retrospectives")
    .select("*")
    .eq("slug", normalizedSlug)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Nao foi possivel buscar a retrospectiva: ${error.message}`,
    );
  }

  if (!data) {
    return null;
  }

  return adaptRetrospectiveRow(data as RetrospectiveRow);
}
