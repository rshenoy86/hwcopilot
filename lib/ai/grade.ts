import Anthropic from "@anthropic-ai/sdk";
import type { TestQuestion, TestFeedback, PracticeExercise } from "@/types";

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export interface GradingParams {
  childName: string;
  grade: string;
  subject: string;
  topic: string;
  questions: TestQuestion[];
  total_points: number;
  images: { data: string; mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif" }[];
}

export interface GradingResult {
  feedback: TestFeedback;
  practice_exercises: PracticeExercise[];
}

function buildSystemPrompt(): string {
  return `You are a kind, expert K-8 educator grading a student's handwritten practice test.

You will receive:
1. One or more images of the student's completed test
2. The original questions with correct answers

Your job:
1. Read each student answer carefully from the image(s)
2. Grade fairly — give partial credit on show-your-work questions when steps show correct understanding even if the final answer is wrong
3. Write specific, encouraging feedback per question
4. Identify weak and strong topic areas
5. Create 3–5 targeted practice exercises for the weakest areas

Always respond with valid JSON matching this exact structure:
{
  "feedback": {
    "overall_summary": "2-3 encouraging sentences summarizing overall performance",
    "score": <integer points earned>,
    "total_points": <integer total possible>,
    "percentage": <integer 0-100>,
    "question_results": [
      {
        "number": 1,
        "correct": true,
        "student_answer": "exactly what the student wrote",
        "points_earned": 2,
        "points_possible": 2,
        "feedback": "Brief specific feedback — what was right or what was missed"
      }
    ],
    "weak_areas": ["topic1", "topic2"],
    "strong_areas": ["topic3"],
    "encouragement": "One warm, personalized sentence using the child's name"
  },
  "practice_exercises": [
    {
      "number": 1,
      "topic": "the weak area this targets",
      "problem": "A fresh practice problem",
      "hint": "A helpful hint to get started",
      "answer": "The correct answer",
      "explanation": "2-3 sentences explaining how to solve it and the key concept"
    }
  ]
}

If you cannot read an answer clearly, mark correct as false and set student_answer to "unclear". Be generous with partial credit.

Do not include any text outside the JSON. Do not include markdown code fences.`;
}

function buildUserPrompt(params: GradingParams): string {
  const gradeLabel = params.grade === "K" ? "Kindergarten" : `Grade ${params.grade}`;
  return `Grade this ${gradeLabel} ${params.subject} test on "${params.topic}" completed by ${params.childName}.

Original questions and correct answers:
${JSON.stringify(params.questions, null, 2)}

Total possible points: ${params.total_points}

Please read the student's answers from the attached image(s), grade each question, and generate 3–5 practice exercises for the weakest areas.`;
}

export async function gradeTest(params: GradingParams): Promise<GradingResult> {
  const client = getClient();

  const imageBlocks: Anthropic.ImageBlockParam[] = params.images.map((img) => ({
    type: "image",
    source: {
      type: "base64",
      media_type: img.mediaType,
      data: img.data,
    },
  }));

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 6000,
    system: buildSystemPrompt(),
    messages: [
      {
        role: "user",
        content: [
          ...imageBlocks,
          { type: "text", text: buildUserPrompt(params) },
        ],
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type from AI");

  let parsed: GradingResult;
  try {
    parsed = JSON.parse(content.text);
  } catch {
    throw new Error("Failed to parse grading response as JSON");
  }

  if (!parsed.feedback || !Array.isArray(parsed.practice_exercises)) {
    throw new Error("AI grading response missing required fields");
  }

  return parsed;
}
