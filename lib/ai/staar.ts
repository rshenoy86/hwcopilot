import Anthropic from "@anthropic-ai/sdk";
import { STAAR_MATH_CATEGORIES } from "@/lib/staar-categories";
import type { TestQuestion } from "@/types";

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export interface StaarGenerationParams {
  childName: string;
  grade: string;
  interests: string;
}

export interface GeneratedStaarAssessment {
  title: string;
  questions: TestQuestion[];
  total_points: number;
}

const CONTENT_SAFETY = `CONTENT SAFETY — STRICTLY ENFORCED:
All content must be fully appropriate for children aged 8–14. Never include violence, drugs, alcohol, sexual content, horror, hate speech, or any content inappropriate for a K-8 classroom.`;

function buildSystemPrompt(): string {
  const categoryList = STAAR_MATH_CATEGORIES.map(
    (c, i) => `${i + 1}. ${c.name}`
  ).join("\n");

  return `You are an expert Texas educator creating a STAAR Math Readiness Assessment aligned to the Texas Essential Knowledge and Skills (TEKS).

${CONTENT_SAFETY}

Generate exactly 12 multiple choice questions — 3 questions per reporting category. The 4 STAAR Math reporting categories are:
${categoryList}

Questions must be numbered 1–12 in order: questions 1–3 for category 1, questions 4–6 for category 2, questions 7–9 for category 3, questions 10–12 for category 4.

Always respond with valid JSON matching this exact structure:
{
  "title": "Grade X STAAR Math Readiness Assessment",
  "questions": [
    {
      "number": 1,
      "section": "A",
      "type": "multiple_choice",
      "question": "Question text here",
      "options": ["A. first option", "B. second option", "C. third option", "D. fourth option"],
      "correct_answer": "B",
      "topic_tag": "Numerical Representations & Relationships",
      "points": 1
    }
  ],
  "total_points": 12
}

VISUAL AIDS — include a "visual" field on a question when the topic genuinely requires a diagram. Supported types:
- Clock: { "type": "clock", "data": { "hours": 3, "minutes": 30 } }
- Number line: { "type": "number_line", "data": { "min": 0, "max": 20, "marked": [13] } }
- Fraction model: { "type": "fraction_model", "data": { "total_parts": 4, "shaded_parts": 3, "shape": "circle" } }
- Shape: { "type": "shape", "data": { "shape": "rectangle", "width_label": "8 cm", "height_label": "5 cm" } }
- Dot array: { "type": "dot_array", "data": { "rows": 3, "cols": 4 } }

Only include a visual when it meaningfully helps answer the question. Most questions should have no visual.

IMPORTANT: The topic_tag must exactly match one of the 4 category names listed above.
Do not include any text outside the JSON. Do not include markdown code fences.`;
}

function buildUserPrompt(params: StaarGenerationParams): string {
  const gradeLabel = `Grade ${params.grade}`;

  return `Create a STAAR Math Readiness Assessment for a ${gradeLabel} student named ${params.childName}.

Child's interests: ${params.interests}

Requirements:
- Align all questions to ${gradeLabel} TEKS Math standards
- Weave the child's interests naturally into 2–3 word problems across the assessment
- Match difficulty to what a ${gradeLabel} student would see on the real STAAR exam
- Each question must have exactly 4 answer choices (A, B, C, D)
- Make distractors plausible — common mistakes a student might make
- Use age-appropriate vocabulary
- Cover a range of difficulty within each category (one easier, one medium, one harder)`;
}

export async function generateStaarAssessment(
  params: StaarGenerationParams
): Promise<GeneratedStaarAssessment> {
  const client = getClient();

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: buildSystemPrompt(),
    messages: [{ role: "user", content: buildUserPrompt(params) }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type from AI");

  let parsed: GeneratedStaarAssessment;
  try {
    parsed = JSON.parse(content.text);
  } catch {
    throw new Error("Failed to parse AI response as JSON");
  }

  if (
    !parsed.title ||
    !Array.isArray(parsed.questions) ||
    parsed.questions.length !== 12
  ) {
    throw new Error("AI response missing required fields or wrong question count");
  }

  return parsed;
}
