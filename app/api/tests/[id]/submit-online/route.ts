import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { gradeOnlineTest } from "@/lib/ai/grade-online";
import { z } from "zod";

const schema = z.object({
  answers: z.array(
    z.object({
      number: z.number(),
      answer: z.string(),
      work: z.string().optional(),
    })
  ).min(1),
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
    .single();

  if (!test) return NextResponse.json({ error: "Test not found" }, { status: 404 });
  if (test.status === "graded") {
    return NextResponse.json({ error: "Test already graded" }, { status: 409 });
  }

  const child = test.children as { name: string; grade: string } | null;
  if (!child) return NextResponse.json({ error: "Child not found" }, { status: 404 });

  let result;
  try {
    result = await gradeOnlineTest({
      childName: child.name,
      grade: test.grade,
      subject: test.subject,
      topic: test.topic,
      questions: test.questions,
      total_points: test.total_points,
      answers: parsed.data.answers,
    });
  } catch (err) {
    console.error("Online grading error:", err);
    return NextResponse.json({ error: "Failed to grade test. Please try again." }, { status: 500 });
  }

  const { error: submissionError } = await supabase
    .from("test_submissions")
    .insert({
      test_id: testId,
      user_id: user.id,
      image_paths: [],
      feedback: result.feedback,
      practice_exercises: result.practice_exercises,
    });

  if (submissionError) {
    console.error("Submission insert error:", submissionError);
    return NextResponse.json({ error: "Failed to save results. Please try again." }, { status: 500 });
  }

  await supabase.from("tests").update({ status: "graded" }).eq("id", testId);

  return NextResponse.json({ success: true });
}
