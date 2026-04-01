export interface ThemeConfig {
  primary: string;   // main accent color
  light: string;     // light tint for section backgrounds
  dark: string;      // darker shade for borders/text accents
  label: string;
  emoji: string;
}

const THEMES: Record<string, ThemeConfig> = {
  dinosaurs: { primary: "#4CAF50", light: "#E8F5E9", dark: "#2E7D32", label: "Dinosaurs", emoji: "🦕" },
  space:      { primary: "#5C6BC0", light: "#E8EAF6", dark: "#283593", label: "Space",     emoji: "🚀" },
  pets:       { primary: "#FF8A65", light: "#FBE9E7", dark: "#BF360C", label: "Pets",      emoji: "🐶" },
  superheroes:{ primary: "#E53935", light: "#FFEBEE", dark: "#B71C1C", label: "Superheroes",emoji: "🦸" },
  ocean:      { primary: "#00ACC1", light: "#E0F7FA", dark: "#006064", label: "Ocean",     emoji: "🐠" },
  baking:     { primary: "#EC407A", light: "#FCE4EC", dark: "#880E4F", label: "Baking",    emoji: "🧁" },
  rainbows:   { primary: "#AB47BC", light: "#F3E5F5", dark: "#6A1B9A", label: "Rainbows",  emoji: "🌈" },
  trains:     { primary: "#EF5350", light: "#FFEBEE", dark: "#B71C1C", label: "Trains",    emoji: "🚂" },
  nature:     { primary: "#66BB6A", light: "#F1F8E9", dark: "#2E7D32", label: "Nature",    emoji: "🦋" },
  frogs:      { primary: "#43A047", light: "#E8F5E9", dark: "#1B5E20", label: "Frogs",     emoji: "🐸" },
  gaming:     { primary: "#7E57C2", light: "#EDE7F6", dark: "#4527A0", label: "Gaming",    emoji: "🎮" },
  beach:      { primary: "#FFA726", light: "#FFF8E1", dark: "#E65100", label: "Beach",     emoji: "🏄" },
  camping:    { primary: "#8D6E63", light: "#EFEBE9", dark: "#4E342E", label: "Camping",   emoji: "🏕️" },
  art:        { primary: "#FF7043", light: "#FBE9E7", dark: "#BF360C", label: "Art",       emoji: "🎨" },
  music:      { primary: "#EC407A", light: "#FCE4EC", dark: "#880E4F", label: "Music",     emoji: "🎵" },
  food:       { primary: "#FF5722", light: "#FBE9E7", dark: "#BF360C", label: "Food",      emoji: "🍕" },
  travel:     { primary: "#29B6F6", light: "#E1F5FE", dark: "#01579B", label: "Travel",    emoji: "✈️" },
};

const DEFAULT_THEME: ThemeConfig = {
  primary: "#6366F1",
  light: "#EEF2FF",
  dark: "#3730A3",
  label: "Default",
  emoji: "⭐",
};

export function getThemeConfig(theme?: string | null): ThemeConfig {
  if (!theme) return DEFAULT_THEME;
  return THEMES[theme.toLowerCase()] ?? DEFAULT_THEME;
}

// Deterministic variant index from worksheet ID (0–4)
export function getVariantIndex(worksheetId: string, numVariants: number): number {
  const hash = worksheetId
    .split("")
    .reduce((h, c) => (h * 31 + c.charCodeAt(0)) & 0xffff, 0);
  return hash % numVariants;
}
