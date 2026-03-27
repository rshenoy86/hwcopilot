import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getHomeworkHelp } from "@/lib/ai/homework-help";
import { z } from "zod";

const schema = z.object({
  question: z.string().min(1, "Please enter a question").max(2000),
  childId: z.string().uuid().optional(),
  simplifyExplanation: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check subscription
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("user_id", user.id)
    .single();

  if (!profile || profile.subscription_status !== "pro") {
    return NextResponse.json(
      { error: "Homework help is a Pro feature. Upgrade to access it." },
      { status: 403 }
    );
  }

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

  let grade: string = "5";
  let childName: string | undefined;

  if (parsed.data.childId) {
    const { data: child } = await supabase
      .from("children")
      .select("grade, name")
      .eq("id", parsed.data.childId)
      .eq("user_id", user.id)
      .single();

    if (child) {
      grade = child.grade;
      childName = child.name;
    }
  }

  try {
    const response = await getHomeworkHelp(
      {
        question: parsed.data.question,
        grade: grade as "K" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8",
        childName,
        simplifyExplanation: parsed.data.simplifyExplanation,
      },
      user.id
    );

    // Save session
    await supabase.from("homework_help_sessions").insert({
      user_id: user.id,
      child_id: parsed.data.childId || null,
      question: parsed.data.question,
      response,
    });

    return NextResponse.json({ response });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to get help";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
