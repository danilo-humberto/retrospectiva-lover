import { supabase } from "../lib/supabase";

const MEMORY_BUCKET = "memories";
const MEMORY_FOLDER = "retrospectives/memories";
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const FILE_EXTENSION_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const validateMemoryImage = (file: File) => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("A imagem da memória deve estar em JPEG, PNG ou WEBP.");
  }

  if (file.size <= 0) {
    throw new Error("A imagem da memória selecionada está vazia.");
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("A imagem da memória deve ter no máximo 5 MB.");
  }
};

const getFileExtension = (file: File) => {
  const originalExtension = file.name.split(".").pop()?.toLowerCase();

  if (
    originalExtension === "jpg" ||
    originalExtension === "jpeg" ||
    originalExtension === "png" ||
    originalExtension === "webp"
  ) {
    return originalExtension;
  }

  return FILE_EXTENSION_BY_TYPE[file.type];
};

const createUniqueFileName = (file: File) => {
  const id =
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  return `${id}.${getFileExtension(file)}`;
};

export async function uploadMemoryImage(file: File): Promise<string> {
  validateMemoryImage(file);

  const filePath = `${MEMORY_FOLDER}/${createUniqueFileName(file)}`;
  const { error } = await supabase.storage
    .from(MEMORY_BUCKET)
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(
      `Não foi possível enviar a imagem da memória: ${error.message}`,
    );
  }

  const { data } = supabase.storage.from(MEMORY_BUCKET).getPublicUrl(filePath);

  if (!data.publicUrl) {
    throw new Error(
      "Não foi possível obter a URL pública da imagem da memória.",
    );
  }

  return data.publicUrl;
}
