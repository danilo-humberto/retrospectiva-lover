import { supabase } from "../lib/supabase";
import type { RetrospectiveData, RetrospectiveMemory } from "../data/retrospective";

type RetrospectiveInsertPayload = {
  slug: string;
  couple_name: string;
  title: string;
  subtitle: string;
  start_date: string;
  song_title: string;
  artist_name: string;
  audio_url: string;
  lyrics: string[];
  cover_url?: string;
  story_photo_url?: string;
  memories: Array<{
    id: number;
    imageUrl?: string;
  }>;
};

export type CreatedRetrospective = RetrospectiveInsertPayload & {
  id: string;
  created_at: string;
};

const createSlugBase = (value: string) => {
  const slug = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " e ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "retrospectiva";
};

const createShortSuffix = () =>
  Math.random().toString(36).slice(2, 6);

const createUniqueSlug = (data: RetrospectiveData) => {
  const slugBase = createSlugBase(
    data.coupleName.trim() || data.retrospectiveTitle.trim(),
  );

  return `${slugBase}-${createShortSuffix()}`;
};

const normalizeLyrics = (lyrics: string[]) =>
  lyrics.map((line) => line.trim()).filter(Boolean);

const normalizeMemories = (memories: RetrospectiveMemory[]) =>
  memories.map((memory) => ({
    id: memory.id,
    imageUrl: memory.imageUrl,
  }));

const buildInsertPayload = (data: RetrospectiveData): RetrospectiveInsertPayload => ({
  slug: createUniqueSlug(data),
  couple_name: data.coupleName,
  title: data.retrospectiveTitle,
  subtitle: data.subtitle,
  start_date: data.startDate,
  song_title: data.songTitle,
  artist_name: data.artistName,
  audio_url: data.audioUrl,
  lyrics: normalizeLyrics(data.lyrics),
  cover_url: data.coverUrl,
  story_photo_url: data.storyPhotoUrl,
  memories: normalizeMemories(data.memories),
});

export async function createRetrospective(
  data: RetrospectiveData,
): Promise<CreatedRetrospective> {
  const payload = buildInsertPayload(data);

  const { data: createdRetrospective, error } = await supabase
    .from("retrospectives")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(
      `Nao foi possivel salvar a retrospectiva: ${error.message}`,
    );
  }

  if (!createdRetrospective) {
    throw new Error("Nao foi possivel obter a retrospectiva criada.");
  }

  return createdRetrospective as CreatedRetrospective;
}
