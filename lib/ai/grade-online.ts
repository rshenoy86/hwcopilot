import Anthropic from "@anthropic-ai/sdk";
import type { TestQuestion, TestFeedback, PracticeExercise } from "@/types";

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export interface OnlineAnswer {
  number: number;
  answer: string;
  work?: string;
}

export interface OnlineGradingParams {
  childName: string;
  grade: string;
  subject: string;
  topic: string;
  questions: TestQuestion[];
  total_points: number;
  answers: OnlineAnswer[];
}

export interface GradingResult {
  feedback: TestFeedback;
  practice_exercises: PracticeExercise[];
}

// Grade multiple choice questions locally — no AI needed
function gradeMC(
  questions: TestQuestion[],
  answers: OnlineAnswer[]
): Map<number, { correct: boolean; student_answer: string; points_earned: number }> {
  const results = new Map<number, { correct: boolean; student_answer: string; points_earned: number }>();
  for (const q of questions) {
    if (q.type !== "multiple_choice") continue;
    const ans = answers.find((a) => a.number === q.number);
    const student_answer = ans?.answer ?? "";
    // Compare just the letter (e.g. "A" matches "A. first option")
    const studentLetter = student_answer.trim().charAt(0).toUpperCase();
    const correctLetter = q.correct_answer.trim().charAt(0).toUpperCase();
    const correct = studentLetter === correctLetter && studentLetter !== "";
    results.set(q.number, {
      correct,
      student_answer,
      points_earned: correct ? q.points : 0,
    });
  }
  return results;
}

function buildSystemPrompt(): string {
  return `You are a kind, expert K-8 educator grading a student's online practice test. The student typed their answers directly.

You will receive:
1. The questions with correct answers
2. The student's typed responses for short answer and show-your-work questions
(Multiple choice has already been graded automatically)

Your job:
1. Grade each short answer and show-your-work question fairly
2. Give partial credit on show-your-work when steps show correct understanding
3. Accept equivalent answers for short answer (e.g. "60 minutes" and "sixty minutes" are both correct)
4. Write brief, encouraging feedback per question
5. Identify weak and strong topic areas
6. Create 3–5 targeted practice exercises for the weakest areas

Always respond with valid JSON matching this exact structure:
{
  "question_results": [
    {
      "number": 6,
      "correct": true,
      "student_answer": "exactly what the student typed",
      "points_earned": 3,
      "points_possible": 3,
      "feedback": "Brief specific feedback"
    }
  ],
  "weak_areas": ["topic1", "topic2"],
  "strong_areas": ["topic3"],
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

Only include results for short_answer and show_work questions. Do not include multiple choice.
Do not include any text outside the JSON. Do not include markdown code fences.`;
}

function buildUserPrompt(params: OnlineGradingParams): string {
  const gradeLabel = params.grade === "K" ? "Kindergarten" : `Grade ${params.grade}`;
  const openQuestions = params.questions.filter((q) => q.type !== "multiple_choice");

  const answersText = openQuestions.map((q) => {
    const ans = params.answers.find((a) => a.number === q.number);
    return `Q${q.number} (${q.type}, ${q.points} pts) — Correct answer: "${q.correct_answer}"
Student answered: "${ans?.answer ?? "(blank)"}"${ans?.work ? `\nStudent's work: "${ans.work}"` : ""}`;
  }).join("\n\n");

  return `Grade these ${gradeLabel} ${params.subject} questions on "${params.topic}" for ${params.childName}.

${answersText}

Generate 3–5 practice exercises targeting the weakest areas.`;
}

export async function gradeOnlineTest(params: OnlineGradingParams): Promise<GradingResult> {
  const client = getClient();

  // Grade MC locally
  const mcResults = gradeMC(params.questions, params.answers);

  // Grade open questions with Claude
  const openQuestions = params.questions.filter((q) => q.type !== "multiple_choice");
  let aiResults: {
    question_results: Array<{
      number: number;
      correct: boolean;
      student_answer: string;
      points_earned: number;
      points_possible: number;
      feedback: string;
    }>;
    weak_areas: string[];
    strong_areas: string[];
    practice_exercises: PracticeExercise[];
  };

  if (openQuestions.length > 0) {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: buildSystemPrompt(),
      messages: [{ role: "user", content: buildUserPrompt(params) }],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type from AI");

    try {
      aiResults = JSON.parse(content.text);
    } catch {
      throw new Error("Failed to parse grading response as JSON");
    }
  } else {
    aiResults = { question_results: [], weak_areas: [], strong_areas: [], practice_exercises: [] };
  }

  // Combine MC + open question results in question number order
  const allResults = params.questions.map((q) => {
    if (q.type === "multiple_choice") {
      const mc = mcResults.get(q.number)!;
      return {
        number: q.number,
        correct: mc.correct,
        student_answer: mc.student_answer,
        points_earned: mc.points_earned,
        points_possible: q.points,
        feedback: mc.correct ? "Correct!" : `Incorrect. The correct answer is ${q.correct_answer}.`,
      };
    }
    const ai = aiResults.question_results.find((r) => r.number === q.number);
    return ai ?? {
      number: q.number,
      correct: false,
      student_answer: "",
      points_earned: 0,
      points_possible: q.points,
      feedback: "Not answered.",
    };
  });

  const score = allResults.reduce((sum, r) => sum + r.points_earned, 0);
  const percentage = Math.round((score / params.total_points) * 100);

  // Build overall summary
  const pct = percentage;
  const summary =
    pct >= 90
      ? `${params.childName} did an excellent job — showing strong mastery of ${params.topic}!`
      : pct >= 70
      ? `${params.childName} showed solid understanding of ${params.topic} with a few areas to strengthen.`
      : `${params.childName} is building their understanding of ${params.topic}. With some targeted practice, they'll get there!`;

  const feedback: TestFeedback = {
    overall_summary: summary,
    score,
    total_points: params.total_points,
    percentage,
    question_results: allResults,
    weak_areas: aiResults.weak_areas,
    strong_areas: aiResults.strong_areas,
    encouragement: `Keep it up, ${params.childName} — every practice makes you stronger!`,
  };

  return { feedback, practice_exercises: aiResults.practice_exercises };
}
