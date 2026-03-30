import Anthropic from "@anthropic-ai/sdk";
import type { Grade, TestQuestion } from "@/types";

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export interface TestGenerationParams {
  childName: string;
  grade: Grade;
  subject: string;
  topic: string;
  interests: string;
}

export interface GeneratedTest {
  title: string;
  questions: TestQuestion[];
  total_points: number;
}

const CONTENT_SAFETY = `CONTENT SAFETY — STRICTLY ENFORCED:
All content must be fully appropriate for children aged 5–14. Never include violence, drugs, alcohol, sexual content, horror, hate speech, gambling, or any content inappropriate for a K-8 classroom. If a child's interests could lead to inappropriate content, substitute safe alternatives silently.`;

function buildSystemPrompt(): string {
  return `You are an expert K-8 educator creating a practice test. You create rigorous, curriculum-aligned assessments that mirror real classroom tests.

${CONTENT_SAFETY}

Always respond with valid JSON matching this exact structure:
{
  "title": "Short descriptive test title (e.g. 'Fractions Practice Test')",
  "questions": [
    {
      "number": 1,
      "section": "A",
      "type": "multiple_choice",
      "question": "Question text here",
      "options": ["A. first option", "B. second option", "C. third option", "D. fourth option"],
      "correct_answer": "B",
      "topic_tag": "specific subtopic tested",
      "points": 2
    },
    {
      "number": 6,
      "section": "B",
      "type": "short_answer",
      "question": "Question text here",
      "correct_answer": "The expected answer",
      "topic_tag": "specific subtopic tested",
      "points": 3
    },
    {
      "number": 10,
      "section": "C",
      "type": "show_work",
      "question": "Multi-step problem requiring work shown",
      "correct_answer": "Final answer",
      "solution_steps": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
      "topic_tag": "specific subtopic tested",
      "points": 4
    }
  ],
  "total_points": 30
}

Do not include any text outside the JSON. Do not include markdown code fences.`;
}

function buildUserPrompt(params: TestGenerationParams): string {
  const gradeLabel = params.grade === "K" ? "Kindergarten" : `Grade ${params.grade}`;

  return `Create a practice test for a ${gradeLabel} student.
Subject: ${params.subject}
Topic: ${params.topic}
Child's name: ${params.childName}
Child's interests: ${params.interests}

Structure required:
- Section A: exactly 5 multiple choice questions, numbers 1–5 (2 points each = 10 points)
- Section B: exactly 4 short answer questions, numbers 6–9 (3 points each = 12 points)
- Section C: exactly 2 show-your-work questions, numbers 10–11 (4 points each = 8 points)
- Total: 30 points, 11 questions

Requirements:
- Questions should cover different aspects/subtopics within ${params.topic}
- Weave the child's interests naturally into 2–3 word problems
- Difficulty should progress: Section A easiest → Section C hardest
- Questions should feel like a real classroom test, not a worksheet
- Short answer questions must have a single clear expected answer
- Show-your-work questions require multi-step reasoning
- Use age-appropriate vocabulary for ${gradeLabel}
- Each question must have a distinct topic_tag identifying the specific concept tested`;
}

export async function generateTest(params: TestGenerationParams): Promise<GeneratedTest> {
  const client = getClient();

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: buildSystemPrompt(),
    messages: [{ role: "user", content: buildUserPrompt(params) }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type from AI");

  let parsed: GeneratedTest;
  try {
    parsed = JSON.parse(content.text);
  } catch {
    throw new Error("Failed to parse AI response as JSON");
  }

  if (!parsed.title || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
    throw new Error("AI response missing required fields");
  }

  return parsed;
}
