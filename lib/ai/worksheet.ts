import Anthropic from "@anthropic-ai/sdk";
import type { Grade, WorksheetContent, WorksheetVisual, AnswerKeyItem } from "@/types";

function getClient() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
}

export interface WorksheetGenerationParams {
  childName: string;
  grade: Grade;
  subject: string;
  topic: string;
  difficulty: 1 | 2 | 3 | 4;
  numQuestions: 6 | 8 | 10;
  interests: string;
  theme?: string;
  specialInstructions?: string;
}

export interface GeneratedWorksheet {
  content: WorksheetContent;
  answer_key: AnswerKeyItem[];
}

const DIFFICULTY_LABELS: Record<number, string> = {
  1: "Easy Review (scaffolded, review of prior concepts)",
  2: "Standard (on-grade level)",
  3: "Challenge (stretch, above grade level)",
  4: "Next Grade Preview",
};

function buildSystemPrompt(): string {
  return `You are an expert K-8 educator creating a homework practice worksheet. You create engaging, curriculum-aligned content that kids actually enjoy completing.

CONTENT SAFETY — STRICTLY ENFORCED:
All content must be fully appropriate for children aged 5–14. You must never include:
- Violence, weapons, injury, or death (even in fictional contexts)
- Drugs, alcohol, tobacco, or substance references
- Sexual content, romantic scenarios, or mature themes
- Horror, fear, or psychologically disturbing content
- Hate speech, discrimination, or stereotypes
- Gambling, betting, or games of chance
- Any content inappropriate for a K-8 classroom setting
If a child's interests or topic could lead to inappropriate content, substitute safe, school-appropriate alternatives silently. Do not comment on the substitution.

Always respond with valid JSON matching this exact structure:
{
  "learn_it": "2-4 sentence kid-friendly explanation of the concept",
  "worked_example": "One fully solved example with clear step-by-step reasoning",
  "problems": ["problem 1 text", "problem 2 text"],
  "problem_visuals": [null, {"type": "clock", "data": {"hours": 3, "minutes": 15}}],
  "challenge": "One harder extension problem",
  "answer_key": [
    {"number": 1, "answer": "...", "explanation": "brief explanation if non-obvious"}
  ]
}

INLINE VISUALS — "problem_visuals" must be an array with exactly one entry per problem (same length as "problems"). Each entry is either null or one of these visual objects:
- Clock (for time-telling/elapsed time): {"type": "clock", "data": {"hours": H, "minutes": M}}
- Ruler (for length/distance measurement): {"type": "ruler", "data": {"length_cm": N, "unit": "cm"}} — use unit "in" for inches
- Beaker (for liquid volume/capacity, ml↔L, cups): {"type": "beaker", "data": {"capacity": N, "filled": F, "unit": "mL"}} — unit can be "mL", "L", or "cups"
- Number line (for rounding, counting on, comparing): {"type": "number_line", "data": {"min": N, "max": M, "marked": [X]}}

Rules for visuals:
- Include a visual ONLY when it meaningfully helps the student understand or set up the problem
- Time problems (what time does the clock show, elapsed time): always include a clock
- Measurement problems involving a specific length or object to measure: include a ruler
- Liquid volume problems (how much is in the beaker, convert mL to L): include a beaker
- Rounding or number-line problems: include a number_line
- Word problems, computation, fractions, geometry: use null
- Never include a visual for the same problem that already has full visual context in the text alone

Do not include any text outside the JSON. Do not include markdown code fences.`;
}

const NEXT_GRADE: Record<string, string> = {
  K: "Grade 1", "1": "Grade 2", "2": "Grade 3", "3": "Grade 4",
  "4": "Grade 5", "5": "Grade 6", "6": "Grade 7", "7": "Grade 8",
  "8": "Grade 8", // no grade 9 in scope — treat as advanced Grade 8
};

function buildUserPrompt(params: WorksheetGenerationParams): string {
  const gradeLabel = params.grade === "K" ? "Kindergarten" : `Grade ${params.grade}`;
  const nextGradeLabel = NEXT_GRADE[params.grade];
  const isNextGrade = params.difficulty === 4;

  const difficultyLabel = isNextGrade
    ? `Next Grade Preview — introduce early ${nextGradeLabel} concepts on this topic`
    : DIFFICULTY_LABELS[params.difficulty];

  return `Generate a worksheet for a ${gradeLabel} student.
Subject: ${params.subject}
Topic: ${params.topic}
Difficulty: ${difficultyLabel}
Number of problems: ${params.numQuestions}
Child's name: ${params.childName}
Child's interests: ${params.interests}
${params.theme ? `Theme: Use "${params.theme}" as the consistent theme throughout the entire worksheet. Every word problem, example, and scenario should feature characters, objects, or situations related to ${params.theme}. Keep the theme present in all sections (Learn It, Worked Example, problems, and Challenge).` : ""}
${params.specialInstructions ? `Special instructions: ${params.specialInstructions}` : ""}

Requirements:
- Weave the child's interests into at least 2 word problems or examples
- Use age-appropriate vocabulary for ${gradeLabel}
- For math: use clear notation, lay out multi-step problems clearly
- For reading/ELA: include a short passage if the topic calls for it
- Difficulty guide: Easy = review/scaffolded, Standard = on-grade, Challenge = stretch${isNextGrade ? `, Next Grade Preview = gently introduce how ${nextGradeLabel} approaches this topic — slightly harder numbers, new vocabulary, or an extra step; keep it approachable but clearly a step up` : ""}
- Make it engaging — this should feel like a fun challenge, not a chore
- For K-2: use simpler numbers, shorter sentences, more scaffolding
- For 6-8: use more complex vocabulary and multi-step reasoning
- The answer_key should have exactly ${params.numQuestions} entries (one per problem), plus the challenge problem as entry number ${params.numQuestions + 1}`;
}

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(userId);

  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + 60000 });
    return true;
  }

  if (limit.count >= 10) {
    return false;
  }

  limit.count++;
  return true;
}

export async function generateWorksheet(
  params: WorksheetGenerationParams,
  userId: string
): Promise<GeneratedWorksheet> {
  if (!checkRateLimit(userId)) {
    throw new Error("Rate limit exceeded. Please wait a minute before generating another worksheet.");
  }

  const message = await getClient().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: buildSystemPrompt(),
    messages: [
      {
        role: "user",
        content: buildUserPrompt(params),
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from AI");
  }

  let parsed: { learn_it: string; worked_example: string; problems: string[]; problem_visuals?: (WorksheetVisual | null)[]; challenge: string; answer_key: AnswerKeyItem[] };
  try {
    parsed = JSON.parse(content.text);
  } catch {
    throw new Error("Failed to parse AI response as JSON");
  }

  // Validate required fields
  if (!parsed.learn_it || !parsed.worked_example || !Array.isArray(parsed.problems) || !parsed.challenge || !Array.isArray(parsed.answer_key)) {
    throw new Error("AI response missing required fields");
  }

  return {
    content: {
      learn_it: parsed.learn_it,
      worked_example: parsed.worked_example,
      problems: parsed.problems,
      problem_visuals: Array.isArray(parsed.problem_visuals) ? parsed.problem_visuals : undefined,
      challenge: parsed.challenge,
    },
    answer_key: parsed.answer_key,
  };
}
