import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateTest } from "@/lib/ai/test";
import { getTodayString, isPeriodExpired } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({
  childId: z.string().uuid(),
  subject: z.string().min(1),
  topic: z.string().min(1),
});

const FREE_LIMIT = 1;
const PRO_LIMIT = 10;

export async function POST(request: NextRequest) {
  const supabase = await createClient();

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

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  // Reset monthly counters if period expired
  if (isPeriodExpired(profile.month_reset_date)) {
    const today = getTodayString();
    await supabase
      .from("profiles")
      .update({
        worksheets_generated_this_month: 0,
        test_prep_used_this_month: 0,
        month_reset_date: today,
      })
      .eq("user_id", user.id);
    profile.test_prep_used_this_month = 0;
  }

  const limit = profile.subscription_status === "pro" ? PRO_LIMIT : FREE_LIMIT;
  if ((profile.test_prep_used_this_month ?? 0) >= limit) {
    const msg =
      profile.subscription_status === "free"
        ? "You've used your 1 free test prep this month. Upgrade to Pro for 10 per month."
        : "You've used all 10 test preps this month. They reset at the start of next month.";
    return NextResponse.json({ error: msg, code: "LIMIT_REACHED" }, { status: 429 });
  }

  // Get child
  const { data: child } = await supabase
    .from("children")
    .select("*")
    .eq("id", parsed.data.childId)
    .eq("user_id", user.id)
    .eq("active", true)
    .single();

  if (!child) return NextResponse.json({ error: "Child not found" }, { status: 404 });

  // Generate test
  let generated;
  try {
    generated = await generateTest({
      childName: child.name,
      grade: child.grade,
      subject: parsed.data.subject,
      topic: parsed.data.topic,
      interests: child.interests,
    });
  } catch (err) {
    console.error("Test generation error:", err);
    return NextResponse.json({ error: "Failed to generate test. Please try again." }, { status: 500 });
  }

  // Save to database
  const { data: test, error: insertError } = await supabase
    .from("tests")
    .insert({
      user_id: user.id,
      child_id: child.id,
      subject: parsed.data.subject,
      topic: parsed.data.topic,
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
    return NextResponse.json({ error: "Failed to save test. Please try again." }, { status: 500 });
  }

  // Increment usage
  await supabase
    .from("profiles")
    .update({ test_prep_used_this_month: (profile.test_prep_used_this_month ?? 0) + 1 })
    .eq("user_id", user.id);

  return NextResponse.json({ testId: test.id });
}
