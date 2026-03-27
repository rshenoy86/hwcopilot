import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateWorksheet } from "@/lib/ai/worksheet";
import { getFirstOfCurrentMonth } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({
  childId: z.string().uuid(),
  subject: z.string().min(1),
  topic: z.string().min(1),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  numQuestions: z.union([z.literal(6), z.literal(8), z.literal(10)]),
  specialInstructions: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  // Get profile and check usage
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  // Check if we need to reset the monthly counter
  const currentMonth = getFirstOfCurrentMonth();
  if (profile.month_reset_date < currentMonth) {
    await supabase
      .from("profiles")
      .update({
        worksheets_generated_this_month: 0,
        month_reset_date: currentMonth,
      })
      .eq("user_id", user.id);
    profile.worksheets_generated_this_month = 0;
    profile.month_reset_date = currentMonth;
  }

  // Check limit
  if (profile.worksheets_generated_this_month >= profile.worksheet_monthly_limit) {
    const limitMsg =
      profile.subscription_status === "free"
        ? "You've used all 5 free worksheets this month. Upgrade to Pro for 250 worksheets/month."
        : `You've used all ${profile.worksheet_monthly_limit} worksheets this month. They'll reset at the start of next month.`;
    return NextResponse.json({ error: limitMsg, code: "LIMIT_REACHED" }, { status: 429 });
  }

  // Get child
  const { data: child } = await supabase
    .from("children")
    .select("*")
    .eq("id", parsed.data.childId)
    .eq("user_id", user.id)
    .eq("active", true)
    .single();

  if (!child) {
    return NextResponse.json({ error: "Child not found" }, { status: 404 });
  }

  try {
    const generated = await generateWorksheet(
      {
        childName: child.name,
        grade: child.grade,
        subject: parsed.data.subject,
        topic: parsed.data.topic,
        difficulty: parsed.data.difficulty,
        numQuestions: parsed.data.numQuestions,
        interests: child.interests,
        specialInstructions: parsed.data.specialInstructions,
      },
      user.id
    );

    // Save worksheet to DB
    const { data: worksheet, error: saveError } = await supabase
      .from("worksheets")
      .insert({
        user_id: user.id,
        child_id: parsed.data.childId,
        subject: parsed.data.subject,
        topic: parsed.data.topic,
        difficulty: parsed.data.difficulty,
        grade: child.grade,
        worksheet_type: "practice",
        content: generated.content,
        answer_key: generated.answer_key,
      })
      .select()
      .single();

    if (saveError) {
      console.error("Failed to save worksheet:", saveError);
      return NextResponse.json({ error: "Failed to save worksheet" }, { status: 500 });
    }

    // Increment usage counter
    await supabase
      .from("profiles")
      .update({
        worksheets_generated_this_month: profile.worksheets_generated_this_month + 1,
      })
      .eq("user_id", user.id);

    return NextResponse.json({ worksheetId: worksheet.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate worksheet";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
