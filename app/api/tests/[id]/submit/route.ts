import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";
import { gradeTest } from "@/lib/ai/grade";
import { z } from "zod";

const schema = z.object({
  imagePaths: z.array(z.string()).min(1).max(6),
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

  // Fetch the test and verify ownership
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

  // Fetch images from Supabase Storage and convert to base64
  const serviceClient = await createServiceClient();
  const images: { data: string; mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif" }[] = [];

  for (const path of parsed.data.imagePaths) {
    const { data: signedUrlData } = await serviceClient.storage
      .from("test-submissions")
      .createSignedUrl(path, 60);

    if (!signedUrlData?.signedUrl) {
      return NextResponse.json({ error: `Could not access image: ${path}` }, { status: 400 });
    }

    const imgResponse = await fetch(signedUrlData.signedUrl);
    if (!imgResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch image" }, { status: 400 });
    }

    const contentType = imgResponse.headers.get("content-type") || "image/jpeg";
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const mediaType = validTypes.includes(contentType)
      ? (contentType as "image/jpeg" | "image/png" | "image/webp" | "image/gif")
      : "image/jpeg";

    const buffer = await imgResponse.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    images.push({ data: base64, mediaType });
  }

  // Grade the test
  let result;
  try {
    result = await gradeTest({
      childName: child.name,
      grade: test.grade,
      subject: test.subject,
      topic: test.topic,
      questions: test.questions,
      total_points: test.total_points,
      images,
    });
  } catch (err) {
    console.error("Grading error:", err);
    return NextResponse.json({ error: "Failed to grade test. Please try again." }, { status: 500 });
  }

  // Save submission
  const { error: submissionError } = await supabase
    .from("test_submissions")
    .insert({
      test_id: testId,
      user_id: user.id,
      image_paths: parsed.data.imagePaths,
      feedback: result.feedback,
      practice_exercises: result.practice_exercises,
    });

  if (submissionError) {
    console.error("Submission insert error:", submissionError);
    return NextResponse.json({ error: "Failed to save results. Please try again." }, { status: 500 });
  }

  // Mark test as graded
  await supabase
    .from("tests")
    .update({ status: "graded" })
    .eq("id", testId);

  return NextResponse.json({ success: true });
}
