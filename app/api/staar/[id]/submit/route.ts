import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  STAAR_MATH_CATEGORIES,
  STAAR_TOPIC,
  type StaarGapReport,
} from "@/lib/staar-categories";
import { z } from "zod";

const schema = z.object({
  answers: z.array(
    z.object({
      number: z.number(),
      answer: z.string(),
    })
  ),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id: testId } = await params;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { data: test } = await supabase
    .from("tests")
    .select("*, children(*)")
    .eq("id", testId)
    .eq("user_id", user.id)
    .eq("topic", STAAR_TOPIC)
    .single();

  if (!test) return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
  if (test.status === "graded") {
    return NextResponse.json({ error: "Assessment already submitted" }, { status: 409 });
  }

  const { answers } = parsed.data;

  // Grade all MC locally — no AI needed
  const categoryMap = new Map<string, { correct: number; total: number }>();

  // Initialize all categories
  for (const cat of STAAR_MATH_CATEGORIES) {
    categoryMap.set(cat.name, { correct: 0, total: 0 });
  }

  let totalCorrect = 0;

  for (const q of test.questions) {
    const category = q.topic_tag as string;
    const entry = categoryMap.get(category) ?? { correct: 0, total: 0 };
    entry.total += 1;

    const studentAns = answers.find((a) => a.number === q.number);
    const studentLetter = (studentAns?.answer ?? "").trim().charAt(0).toUpperCase();
    const correctLetter = (q.correct_answer as string).trim().charAt(0).toUpperCase();

    if (studentLetter && studentLetter === correctLetter) {
      entry.correct += 1;
      totalCorrect += 1;
    }

    categoryMap.set(category, entry);
  }

  const categoryScores = STAAR_MATH_CATEGORIES.map((cat) => {
    const entry = categoryMap.get(cat.name) ?? { correct: 0, total: 0 };
    const pct = entry.total > 0 ? Math.round((entry.correct / entry.total) * 100) : 0;
    return {
      category: cat.name,
      shortName: cat.shortName,
      worksheetTopic: cat.worksheetTopic,
      correct: entry.correct,
      total: entry.total,
      pct,
    };
  });

  const totalQuestions = test.questions.length;
  const overallPct = Math.round((totalCorrect / totalQuestions) * 100);

  const gapReport: StaarGapReport = {
    staar: true,
    grade: test.grade,
    subject: "Math",
    category_scores: categoryScores,
    total_correct: totalCorrect,
    total_questions: totalQuestions,
    overall_pct: overallPct,
  };

  const { error: submissionError } = await supabase
    .from("test_submissions")
    .insert({
      test_id: testId,
      user_id: user.id,
      image_paths: [],
      feedback: gapReport,
      practice_exercises: [],
    });

  if (submissionError) {
    console.error("Submission insert error:", submissionError);
    return NextResponse.json(
      { error: "Failed to save results. Please try again." },
      { status: 500 }
    );
  }

  await supabase
    .from("tests")
    .update({ status: "graded" })
    .eq("id", testId);

  return NextResponse.json({ success: true });
}
