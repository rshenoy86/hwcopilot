import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateStaarWorksheet } from "@/lib/ai/staar-worksheet";
import {
  isStaarGrade,
  STAAR_WORKSHEET_TOPIC,
} from "@/lib/staar-categories";
import { z } from "zod";

const schema = z.object({
  childId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("user_id", user.id)
    .single();

  if (!profile || profile.subscription_status !== "pro") {
    return NextResponse.json(
      { error: "STAAR Full Test Worksheets require a Pro subscription." },
      { status: 403 }
    );
  }

  const { data: child } = await supabase
    .from("children")
    .select("*")
    .eq("id", parsed.data.childId)
    .eq("user_id", user.id)
    .eq("active", true)
    .single();

  if (!child)
    return NextResponse.json({ error: "Child not found" }, { status: 404 });

  if (!isStaarGrade(child.grade)) {
    return NextResponse.json(
      { error: "STAAR assessments are for grades 3–8 only." },
      { status: 400 }
    );
  }

  let generated;
  try {
    generated = await generateStaarWorksheet({
      childName: child.name,
      grade: child.grade,
      interests: child.interests,
    });
  } catch (err) {
    console.error("STAAR worksheet generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate worksheet. Please try again." },
      { status: 500 }
    );
  }

  const { data: test, error: insertError } = await supabase
    .from("tests")
    .insert({
      user_id: user.id,
      child_id: child.id,
      subject: "Math",
      topic: STAAR_WORKSHEET_TOPIC,
      grade: child.grade,
      title: generated.title,
      questions: generated.questions,
      total_points: generated.total_points,
      status: "generated",
    })
    .select()
    .single();

  if (insertError || !test) {
    console.error("Insert error:", insertError);
    return NextResponse.json(
      { error: "Failed to save worksheet. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ testId: test.id });
}
