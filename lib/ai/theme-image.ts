import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "theme-images";

// Preset themes have hand-crafted SVGs — skip DALL-E for these
const PRESET_THEME_KEYS = new Set([
  "dinosaurs", "space", "pets", "superheroes", "ocean", "baking",
  "rainbows", "trains", "nature", "frogs", "gaming", "beach",
  "camping", "art", "music", "food", "travel", "sports",
]);

export function isPresetTheme(theme: string): boolean {
  return PRESET_THEME_KEYS.has(theme.toLowerCase());
}

function normalizeKey(theme: string): string {
  return theme.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getPublicUrl(filename: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filename}`;
}

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function getOrGenerateThemeImage(theme: string): Promise<string | null> {
  // Preset themes use SVGs — no DALL-E needed
  if (isPresetTheme(theme)) return null;

  const key = normalizeKey(theme);
  const filename = `${key}.png`;
  const admin = getAdminClient();

  // Check cache in Supabase Storage
  const { data: files } = await admin.storage.from(BUCKET).list("", { search: key });
  if (files?.some((f) => f.name === filename)) {
    return getPublicUrl(filename);
  }

  // Generate with DALL-E 3
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `A cute Duolingo-style cartoon character representing "${theme}". White background. Flat illustration. Chunky rounded body, thick bold outlines, big expressive eyes, vibrant saturated colors. Playful and child-friendly. Single character centered. No text, no words, no letters.`,
      size: "1024x1024",
      quality: "standard",
      style: "vivid",
      n: 1,
      response_format: "b64_json",
    });

    const b64 = response.data?.[0]?.b64_json;
    if (!b64) return null;
    const buffer = Buffer.from(b64, "base64");

    const { error } = await admin.storage.from(BUCKET).upload(filename, buffer, {
      contentType: "image/png",
      upsert: false,
    });

    if (error) {
      console.error("Storage upload failed:", error.message);
      return null;
    }

    return getPublicUrl(filename);
  } catch (err) {
    console.error("DALL-E generation failed:", err);
    return null;
  }
}
