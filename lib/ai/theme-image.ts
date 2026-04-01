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

// ── Guardrail 1: blocklist ────────────────────────────────────────────────────
// Block obvious inappropriate themes before hitting DALL-E at all.
// Worksheet still generates fine — image just falls back to SVG star.
const BLOCKED_PATTERNS = [
  // Violence / gore
  /\b(gore|gory|blood|bloody|kill|murder|stab|shoot|gun|rifle|pistol|weapon|bomb|explode|explosion|war|battle|death|dead|corpse|zombie|skull|decapitat)\b/i,
  // Horror
  /\b(horror|scary|nightmare|demon|devil|satan|evil|curse|haunted|ghost|creep|freddy|jason|pennywise|chucky|slender)\b/i,
  // Drugs / alcohol
  /\b(drug|cocaine|heroin|meth|weed|marijuana|alcohol|beer|wine|liquor|drunk|high|stoned|vape|smoke|cigarette|tobacco)\b/i,
  // Adult / sexual
  /\b(sex|sexy|naked|nude|porn|adult|strip|erotic|lingerie)\b/i,
  // Hate / profanity (common slurs omitted here but pattern covers the space)
  /\b(hate|racist|nazi|slur|profan)\b/i,
];

function isBlocked(theme: string): boolean {
  return BLOCKED_PATTERNS.some((pattern) => pattern.test(theme));
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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

// ── Guardrail 2: hardened G-rated prompt ─────────────────────────────────────
function buildPrompt(theme: string): string {
  return [
    `A cute, fun cartoon character representing the theme "${theme}".`,
    "Style: Duolingo-style flat illustration. Chunky rounded shapes. Thick bold outlines.",
    "Big friendly expressive eyes. Vibrant saturated colors. Big warm smile.",
    "Strictly G-rated and appropriate for children ages 5–13.",
    "No weapons, no blood, no violence, no scary elements, no alcohol, no drugs.",
    "No text, no words, no letters, no numbers.",
    "White background. Single character centered in frame.",
  ].join(" ");
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function getOrGenerateThemeImage(theme: string): Promise<string | null> {
  // Preset themes use SVGs — no DALL-E needed
  if (isPresetTheme(theme)) return null;

  // Guardrail 1: blocklist — return null silently, worksheet still works
  if (isBlocked(theme)) {
    console.warn(`Theme blocked by content filter: "${theme}"`);
    return null;
  }

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
      prompt: buildPrompt(theme),       // Guardrail 2: hardened prompt
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
  } catch (err: unknown) {
    // Guardrail 3: DALL-E content policy rejection — fall back to SVG star silently
    if (
      err instanceof Error &&
      (err.message.includes("content_policy") ||
        err.message.includes("safety system") ||
        err.message.includes("violates"))
    ) {
      console.warn(`DALL-E content policy blocked theme: "${theme}"`);
    } else {
      console.error("DALL-E generation failed:", err);
    }
    return null;
  }
}
