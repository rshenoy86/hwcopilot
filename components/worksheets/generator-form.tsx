"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSubjectsForGrade, getTopicsForSubjectAndGrade } from "@/lib/curriculum";
import type { Child, SubscriptionStatus } from "@/types";

interface GeneratorFormProps {
  children: Child[];
  preselectedChildId?: string;
  preselectedSubject?: string;
  preselectedTopic?: string;
  isAtLimit: boolean;
  subscriptionStatus: SubscriptionStatus;
}

const DIFFICULTY_OPTIONS = [
  { value: "1", label: "Easy Review", description: "Scaffolded, review of earlier concepts" },
  { value: "2", label: "Standard", description: "On-grade level practice" },
  { value: "3", label: "Challenge", description: "Stretch problems above grade level" },
];

const QUESTION_COUNTS = [6, 8, 10];

const THEMES_BY_GRADE_BAND: Record<string, { emoji: string; label: string }[]> = {
  "K-2": [
    { emoji: "🦕", label: "Dinosaurs" },
    { emoji: "🚀", label: "Space" },
    { emoji: "🐶", label: "Pets" },
    { emoji: "🦸", label: "Superheroes" },
    { emoji: "🐠", label: "Ocean" },
    { emoji: "🧁", label: "Baking" },
    { emoji: "🌈", label: "Rainbows" },
    { emoji: "🚂", label: "Trains" },
    { emoji: "🦋", label: "Nature" },
    { emoji: "🐸", label: "Frogs" },
  ],
  "3-5": [
    { emoji: "🚀", label: "Space" },
    { emoji: "🎮", label: "Gaming" },
    { emoji: "🦸", label: "Superheroes" },
    { emoji: "🐠", label: "Ocean" },
    { emoji: "🧁", label: "Baking" },
    { emoji: "🏄", label: "Beach" },
    { emoji: "🦋", label: "Nature" },
    { emoji: "🏕️", label: "Camping" },
    { emoji: "🐶", label: "Pets" },
    { emoji: "🎨", label: "Art" },
  ],
  "6-8": [
    { emoji: "🎮", label: "Gaming" },
    { emoji: "🚀", label: "Space" },
    { emoji: "🏄", label: "Beach" },
    { emoji: "🎵", label: "Music" },
    { emoji: "🐠", label: "Ocean" },
    { emoji: "🦋", label: "Nature" },
    { emoji: "🍕", label: "Food" },
    { emoji: "🏕️", label: "Camping" },
    { emoji: "🎨", label: "Art" },
    { emoji: "✈️", label: "Travel" },
  ],
};

function getThemesForGrade(grade: string): { emoji: string; label: string }[] {
  const n = grade === "K" ? 0 : parseInt(grade);
  if (n <= 2) return THEMES_BY_GRADE_BAND["K-2"];
  if (n <= 5) return THEMES_BY_GRADE_BAND["3-5"];
  return THEMES_BY_GRADE_BAND["6-8"];
}

// Skip words that are personal/relational, not themeable topics
const SKIP_WORDS = new Set([
  "and", "or", "the", "his", "her", "their", "he", "she", "they",
  "mom", "dad", "grandparents", "grandma", "grandpa", "likes", "love",
  "loves", "all", "also", "including", "such", "as", "a", "an", "with",
  "we", "refer", "to", "is", "are", "has", "have",
]);

function parseInterestThemes(interests: string): string[] {
  if (!interests) return [];
  // Split on commas, periods, exclamation marks, "and"
  const tokens = interests
    .split(/[,\.!]+|\band\b/i)
    .map((t) => t.replace(/\b(He|She|They|His|Her|Their)\b.*$/i, "").trim())
    .map((t) => t.replace(/^(a|an|the)\s+/i, "").trim())
    .filter((t) => {
      if (!t || t.length < 3 || t.length > 25) return false;
      const words = t.toLowerCase().split(/\s+/);
      if (words.length > 3) return false;
      if (words.some((w) => SKIP_WORDS.has(w))) return false;
      return true;
    })
    .map((t) => t.charAt(0).toUpperCase() + t.slice(1));

  // Deduplicate (case-insensitive) and cap at 5
  const seen = new Set<string>();
  const result: string[] = [];
  for (const t of tokens) {
    const key = t.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(t);
    }
    if (result.length === 5) break;
  }
  return result;
}

const DYSLEXIA_INSTRUCTION = `DYSLEXIA-FRIENDLY FORMAT — follow every rule below without exception.

SENTENCES: Maximum 7 words per sentence. One idea per sentence. Put each sentence on its own line with a blank line after it.

WORDS: Use only simple, common words. For early grades: CVC words (cat, dog, red) and high-frequency sight words. Never use a complex word when a simple one works.

BOLD KEY WORDS: Wrap the topic word and key vocabulary in ** so they render bold. Example: **addition** or **sentence**.

QUESTION STEMS: Start every question with the key question word in ALL CAPS. Examples: "WHAT color is the ball?" / "WHERE does the dog go?" / "HOW MANY apples are left?" / "WHO helps Sam?"

LEARN IT: Write exactly 2 short sentences. Each on its own line. Blank line between them.

WORKED EXAMPLE: Number each step. One action per step. Format: "Step 1: [short action]". Each step on its own line.

PROBLEMS: One short question per problem (max 10 words). End every problem with a blank line then exactly this text on its own line: "My answer: ___________"

CHALLENGE: One sentence only. End with: "My answer: ___________"

SPACING: Always put a blank line between every sentence and every section. Never write 2 sentences in a row without a blank line.

TONE: Warm and encouraging. Use the child's name once. Say "You can do this!" somewhere. Keep it calm and simple.`;

// Scaffolding options per subject category
const SCAFFOLDING_OPTIONS: Record<string, { id: string; label: string; description: string; instruction: string }[]> = {
  ELA: [
    {
      id: "dyslexia",
      label: "Dyslexia-friendly",
      description: "Shorter sentences, extra spacing, simpler layout",
      instruction: DYSLEXIA_INSTRUCTION,
    },
    {
      id: "word_bank",
      label: "Include word bank",
      description: "Provide a list of key words to choose from",
      instruction: "Include a word bank at the top of the YOUR TURN section with 8-10 relevant vocabulary words for students to reference.",
    },
    {
      id: "sentence_starters",
      label: "Sentence starters",
      description: "Give the first few words of each answer",
      instruction: "For writing problems, provide sentence starters (e.g. 'The main idea is...', 'First, the author...') to help students begin their answers.",
    },
    {
      id: "visual_cues",
      label: "Visual cues",
      description: "Add emojis or symbols to guide reading",
      instruction: "Use visual cues like emojis, arrows, and symbols alongside instructions to help visual learners navigate the worksheet.",
    },
  ],
  "ELA / Phonics": [
    {
      id: "dyslexia",
      label: "Dyslexia-friendly",
      description: "Shorter sentences, extra spacing, simpler layout",
      instruction: DYSLEXIA_INSTRUCTION,
    },
    {
      id: "word_bank",
      label: "Include word bank",
      description: "Provide a list of key words to choose from",
      instruction: "Include a word bank at the top of the YOUR TURN section with 8-10 relevant vocabulary words for students to reference.",
    },
    {
      id: "tracing_lines",
      label: "Extra writing lines",
      description: "More space to trace or write letters",
      instruction: "Provide extra-wide writing lines and additional space for each answer to support handwriting practice.",
    },
    {
      id: "picture_support",
      label: "Picture word support",
      description: "Describe a picture clue for each problem",
      instruction: "For each problem, include a brief description of a simple picture clue in brackets like [Picture: a cat] to support word recognition.",
    },
  ],
  Reading: [
    {
      id: "dyslexia",
      label: "Dyslexia-friendly",
      description: "Shorter sentences, extra spacing, simpler layout",
      instruction: DYSLEXIA_INSTRUCTION,
    },
    {
      id: "word_bank",
      label: "Include word bank",
      description: "Provide key vocabulary words",
      instruction: "Include a word bank with definitions of 6-8 key vocabulary words from the reading passage.",
    },
    {
      id: "shorter_passage",
      label: "Shorter passage",
      description: "Use a briefer reading passage",
      instruction: "Use a very short reading passage (3-4 sentences maximum) to reduce cognitive load while still practicing comprehension.",
    },
    {
      id: "sentence_starters",
      label: "Sentence starters",
      description: "Give the first few words of each answer",
      instruction: "For writing problems, provide sentence starters (e.g. 'The main idea is...', 'First, the author...') to help students begin their answers.",
    },
  ],
  Math: [
    {
      id: "show_work",
      label: "Show work boxes",
      description: "Add a box under each problem for work",
      instruction: "After each problem, include a labeled 'Show your work:' box with extra space for students to write out their steps.",
    },
    {
      id: "step_by_step",
      label: "Step-by-step scaffolding",
      description: "Break problems into guided steps",
      instruction: "Break multi-step problems into labeled sub-steps (Step 1: ___, Step 2: ___, Answer: ___) so students can follow along.",
    },
    {
      id: "smaller_numbers",
      label: "Simplified numbers",
      description: "Use smaller, friendlier numbers",
      instruction: "Use smaller, rounder numbers throughout (single digits for K-2, two digits max for 3-5) to reduce arithmetic difficulty and focus on the concept.",
    },
    {
      id: "visual_models",
      label: "Visual model prompts",
      description: "Prompt students to draw a picture or diagram",
      instruction: "For each problem, add 'Draw a picture or diagram to help you solve:' with a blank box, encouraging visual-spatial problem solving.",
    },
  ],
  Science: [
    {
      id: "word_bank",
      label: "Include word bank",
      description: "Provide key science vocabulary",
      instruction: "Include a word bank at the top with 8-10 key science vocabulary words and brief definitions.",
    },
    {
      id: "fill_in_blank",
      label: "Fill-in-the-blank format",
      description: "Partial answers with blanks to complete",
      instruction: "Format answers as fill-in-the-blank sentences where possible (e.g. 'Photosynthesis uses _____ and _____ to make food.') instead of open-ended questions.",
    },
    {
      id: "simplified_vocab",
      label: "Simplified vocabulary",
      description: "Use everyday words alongside science terms",
      instruction: "Whenever a science term is used, immediately follow it with a simple everyday definition in parentheses (e.g. 'photosynthesis (how plants make food)').",
    },
    {
      id: "sentence_starters",
      label: "Sentence starters",
      description: "Give the beginning of each answer",
      instruction: "Provide sentence starters for all written responses to help students structure their answers.",
    },
  ],
  "Social Studies": [
    {
      id: "word_bank",
      label: "Include word bank",
      description: "Provide key terms and names",
      instruction: "Include a word bank with 8-10 key terms, names, and dates relevant to the topic.",
    },
    {
      id: "fill_in_blank",
      label: "Fill-in-the-blank format",
      description: "Partial answers with blanks to complete",
      instruction: "Format answers as fill-in-the-blank sentences where possible instead of open-ended questions.",
    },
    {
      id: "simplified_vocab",
      label: "Simplified vocabulary",
      description: "Plain language alongside terms",
      instruction: "Whenever a social studies term is used, follow it with a plain-language explanation in parentheses.",
    },
    {
      id: "sentence_starters",
      label: "Sentence starters",
      description: "Give the beginning of each answer",
      instruction: "Provide sentence starters for all written responses.",
    },
  ],
  Writing: [
    {
      id: "dyslexia",
      label: "Dyslexia-friendly",
      description: "Shorter sentences, extra spacing",
      instruction: DYSLEXIA_INSTRUCTION,
    },
    {
      id: "sentence_starters",
      label: "Sentence starters",
      description: "Give the first few words of each answer",
      instruction: "Provide sentence starters for all writing prompts.",
    },
    {
      id: "word_bank",
      label: "Include word bank",
      description: "Provide helpful vocabulary words",
      instruction: "Include a word bank of 8-10 useful words related to the writing topic.",
    },
    {
      id: "extra_lines",
      label: "Extra writing lines",
      description: "More space to write",
      instruction: "Provide extra writing lines (at least 5-6 blank lines) for each writing response.",
    },
  ],
};

function getScaffoldingForSubject(subject: string) {
  // Match by subject name or return Math defaults for unknown subjects
  for (const key of Object.keys(SCAFFOLDING_OPTIONS)) {
    if (subject.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(subject.toLowerCase())) {
      return SCAFFOLDING_OPTIONS[key];
    }
  }
  return SCAFFOLDING_OPTIONS["Math"];
}

export default function WorksheetGeneratorForm({
  children,
  preselectedChildId,
  preselectedSubject,
  preselectedTopic,
  isAtLimit,
  subscriptionStatus,
}: GeneratorFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedChildId, setSelectedChildId] = useState(preselectedChildId || children[0]?.id || "");
  const [subject, setSubject] = useState(preselectedSubject || "");
  const [topic, setTopic] = useState(preselectedTopic || "");
  const [difficulty, setDifficulty] = useState<"1" | "2" | "3">("2");
  const [numQuestions, setNumQuestions] = useState<6 | 8 | 10>(8);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [activeScaffolding, setActiveScaffolding] = useState<string[]>([]);
  const [theme, setTheme] = useState<string | null>(null);
  const [customTheme, setCustomTheme] = useState("");

  const selectedChild = children.find((c) => c.id === selectedChildId);
  const availableSubjects = selectedChild ? getSubjectsForGrade(selectedChild.grade) : [];
  const availableTopics = selectedChild && subject ? getTopicsForSubjectAndGrade(selectedChild.grade, subject) : [];
  const scaffoldingOptions = subject ? getScaffoldingForSubject(subject) : [];
  const personalThemes = selectedChild ? parseInterestThemes(selectedChild.interests) : [];
  const gradeThemes = selectedChild ? getThemesForGrade(selectedChild.grade) : THEMES_BY_GRADE_BAND["3-5"];
  // Grade-appropriate tiles that aren't already covered by personal themes
  const genericThemesFiltered = gradeThemes.filter(
    (t) => !personalThemes.some((p) => p.toLowerCase() === t.label.toLowerCase())
  );

  function handleChildChange(childId: string) {
    setSelectedChildId(childId);
    setSubject("");
    setTopic("");
    setActiveScaffolding([]);
  }

  function handleSubjectChange(s: string) {
    setSubject(s);
    setTopic("");
    setActiveScaffolding([]);
  }

  function toggleScaffolding(id: string) {
    setActiveScaffolding((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  const INAPPROPRIATE_TERMS = [
    // Weapons & violence
    "gun", "guns", "weapon", "weapons", "knife", "knives", "shoot", "shooting", "bomb", "violence",
    "kill", "killing", "murder", "death", "dead", "suicide", "stab", "stabbing", "fight", "attack",
    // Alcohol & substances
    "alcohol", "beer", "wine", "liquor", "drunk", "drug", "drugs", "marijuana", "weed", "cocaine",
    "meth", "heroin", "overdose", "cigarette", "smoking", "tobacco", "vaping",
    // Sexual content
    "sex", "sexual", "porn", "nude", "naked", "explicit",
    // Profanity (common variations)
    "fuck", "shit", "ass", "bitch", "damn", "crap", "bastard", "dick", "cock", "pussy",
    "asshole", "bullshit", "motherfucker", "cunt",
    // Other
    "gambling", "casino", "betting", "hate", "racist", "racism",
  ];

  function containsInappropriateContent(text: string): boolean {
    const lower = text.toLowerCase();
    return INAPPROPRIATE_TERMS.some((term) => {
      const regex = new RegExp(`\\b${term}\\b`);
      return regex.test(lower);
    });
  }

  async function handleGenerate() {
    if (!selectedChildId || !subject || !topic) {
      setError("Please fill in all required fields");
      return;
    }

    const textToCheck = [topic, specialInstructions].join(" ");
    if (containsInappropriateContent(textToCheck)) {
      setError("Please keep topics school-appropriate — no violence, alcohol, drugs, or other adult content. Try again with a different topic!");
      return;
    }

    setError(null);
    setLoading(true);

    // Build special instructions from scaffolding + any manual input
    const scaffoldInstructions = activeScaffolding
      .map((id) => scaffoldingOptions.find((o) => o.id === id)?.instruction)
      .filter(Boolean)
      .join(" ");
    const combinedInstructions = [scaffoldInstructions, specialInstructions].filter(Boolean).join(" ");

    try {
      const response = await fetch("/api/worksheets/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId: selectedChildId,
          subject,
          topic,
          difficulty: parseInt(difficulty) as 1 | 2 | 3,
          numQuestions,
          specialInstructions: combinedInstructions || undefined,
          theme: theme ?? (customTheme.trim() || undefined),
          dyslexia_mode: activeScaffolding.includes("dyslexia"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to generate worksheet. Please try again.");
        setLoading(false);
        return;
      }

      router.push(`/worksheets/${data.worksheetId}`);
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  if (isAtLimit) {
    return (
      <Card className="border-primary/20">
        <CardContent className="py-12 text-center space-y-4">
          <div className="text-4xl">📋</div>
          <div>
            <h3 className="font-semibold text-lg">Monthly limit reached</h3>
            <p className="text-muted-foreground mt-1">
              {subscriptionStatus === "free"
                ? "You've used all 10 free worksheets this month."
                : "You've used all 250 worksheets this month."}
            </p>
          </div>
          {subscriptionStatus === "free" ? (
            <Link href="/billing">
              <Button>
                <Zap className="h-4 w-4 mr-1" />
                Upgrade to Pro — 250 worksheets/month
              </Button>
            </Link>
          ) : (
            <p className="text-sm text-muted-foreground">
              Your worksheets will reset at the start of next month.
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-5">
        {/* Child selection */}
        <div className="space-y-1.5">
          <Label>Child</Label>
          <Select value={selectedChildId} onValueChange={handleChildChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a child" />
            </SelectTrigger>
            <SelectContent>
              {children.map((child) => (
                <SelectItem key={child.id} value={child.id}>
                  {child.name} — {child.grade === "K" ? "Kindergarten" : `Grade ${child.grade}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedChild && (
            <p className="text-xs text-muted-foreground">
              Interests: {selectedChild.interests}
            </p>
          )}
        </div>

        {/* Subject */}
        <div className="space-y-1.5">
          <Label>Subject</Label>
          <Select value={subject} onValueChange={handleSubjectChange} disabled={!selectedChild}>
            <SelectTrigger>
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {availableSubjects.map((s) => (
                <SelectItem key={s.subject} value={s.subject}>
                  {s.subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Topic */}
        <div className="space-y-1.5">
          <Label>Topic</Label>
          <Select value={topic} onValueChange={setTopic} disabled={!subject}>
            <SelectTrigger>
              <SelectValue placeholder="Select a topic" />
            </SelectTrigger>
            <SelectContent>
              {availableTopics.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Difficulty */}
        <div className="space-y-2">
          <Label>Difficulty</Label>
          <div className="grid grid-cols-3 gap-2">
            {DIFFICULTY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setDifficulty(opt.value as "1" | "2" | "3")}
                className={`p-3 rounded-lg border text-left transition-all active:scale-95 ${
                  difficulty === opt.value
                    ? "border-primary bg-accent ring-1 ring-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-sm font-medium">{opt.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5 leading-tight">
                  {opt.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Number of questions */}
        <div className="space-y-2">
          <Label>Number of questions</Label>
          <div className="flex gap-2">
            {QUESTION_COUNTS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setNumQuestions(n as 6 | 8 | 10)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all active:scale-95 ${
                  numQuestions === n
                    ? "border-primary bg-accent ring-1 ring-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Theme picker */}
        <div className="space-y-3">
          <Label>
            Worksheet theme{" "}
            <span className="text-muted-foreground font-normal">(optional — makes every problem about one topic)</span>
          </Label>

          {/* Personal themes from child's interests */}
          {personalThemes.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                {selectedChild?.name}&apos;s interests
              </p>
              <div className="flex flex-wrap gap-2">
                {personalThemes.map((label) => {
                  const selected = theme === label;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => { setTheme(selected ? null : label); setCustomTheme(""); }}
                      className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-all active:scale-95 ${
                        selected
                          ? "border-primary bg-accent ring-1 ring-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Generic theme tiles */}
          <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            Other fun topics
          </p>
          <div className="grid grid-cols-5 gap-2">
            {genericThemesFiltered.map((t) => {
              const selected = theme === t.label;
              return (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => { setTheme(selected ? null : t.label); setCustomTheme(""); }}
                  className={`flex flex-col items-center gap-1 py-2 rounded-lg border text-xs font-medium transition-all active:scale-95 ${
                    selected
                      ? "border-primary bg-accent ring-1 ring-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-xl">{t.emoji}</span>
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
          </div>

          {/* Custom theme input */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">or type your own:</span>
            <input
              type="text"
              value={customTheme}
              onChange={(e) => { setCustomTheme(e.target.value); setTheme(null); }}
              placeholder="e.g. Minecraft, ballet, cooking..."
              maxLength={50}
              className="flex-1 h-8 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>

        {/* Scaffolding options */}
        {subject && scaffoldingOptions.length > 0 && (
          <div className="space-y-2">
            <Label>
              Question options{" "}
              <span className="text-muted-foreground font-normal">(optional — select any that apply)</span>
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {scaffoldingOptions.map((opt) => {
                const active = activeScaffolding.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleScaffolding(opt.id)}
                    className={`p-3 rounded-lg border text-left transition-all active:scale-95 ${
                      active
                        ? "border-primary bg-accent ring-1 ring-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        active ? "border-primary bg-primary" : "border-muted-foreground"
                      }`}>
                        {active && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="text-sm font-medium">{opt.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-6 leading-tight">
                      {opt.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Special instructions */}
        <div className="space-y-1.5">
          <Label>
            Additional instructions{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="e.g. Focus on borrowing in subtraction, include more word problems..."
            rows={2}
          />
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
            {error}
            {error.includes("limit") && subscriptionStatus === "free" && (
              <Link href="/billing" className="ml-1 underline font-medium">
                Upgrade to Pro
              </Link>
            )}
          </div>
        )}

        <Button
          className="w-full"
          size="lg"
          onClick={handleGenerate}
          disabled={loading || !subject || !topic}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating your worksheet...
            </>
          ) : (
            "Generate Worksheet"
          )}
        </Button>

        {loading && (
          <p className="text-xs text-center text-muted-foreground">
            This takes about 10-20 seconds. We&apos;re crafting something great!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
