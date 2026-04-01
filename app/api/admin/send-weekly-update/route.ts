import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { weeklyUpdateHtml, WeeklyUpdateData } from "@/lib/emails/weekly-update-template";

// This week's update content — edit before each send
const THIS_WEEK: WeeklyUpdateData = {
  previewText: "Themed characters, AI images, photo upload & more 🎨",
  updates: [
    {
      emoji: "🎨",
      title: "Themed worksheets with Duolingo-style characters",
      description:
        "Pick a theme and your child's worksheet gets fun characters in all four corners — dinosaurs, space, gaming, basketball, and 14 more. Each worksheet gets a unique color variant so it never looks the same twice.",
    },
    {
      emoji: "🤖",
      title: "AI-generated images for any custom theme",
      description:
        "Type anything in the custom theme box — \"LeBron James\", \"Minecraft\", \"Taylor Swift\" — and we generate a Duolingo-style character just for that worksheet. Cached so it loads instantly next time.",
    },
    {
      emoji: "📸",
      title: "Photo upload auto-fills subject & topic",
      description:
        "Snap a photo of any homework problem or textbook page and GuruBuddy automatically detects the subject and topic for you. No more typing.",
    },
    {
      emoji: "🎯",
      title: "Next Grade difficulty tier",
      description:
        "Want to challenge your child with a sneak peek at next year's concepts? The new \"Next Grade\" difficulty level does exactly that — great for kids who are ready to push ahead.",
    },
  ],
};

export async function POST(request: NextRequest) {
  // Protect with a secret key — set ADMIN_SECRET in Vercel env vars
  const secret = request.headers.get("x-admin-secret");
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch all user emails via Supabase admin API
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: usersData, error: usersError } = await admin.auth.admin.listUsers({
    perPage: 1000,
  });

  if (usersError) {
    console.error("Failed to fetch users:", usersError);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }

  const emails = usersData.users
    .map((u) => u.email)
    .filter((e): e is string => !!e);

  if (emails.length === 0) {
    return NextResponse.json({ message: "No users found", sent: 0 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const html = weeklyUpdateHtml(THIS_WEEK);

  // Send in batches of 50 (Resend batch limit)
  const BATCH_SIZE = 50;
  let sent = 0;
  const failed: string[] = [];

  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const batch = emails.slice(i, i + BATCH_SIZE);

    const results = await Promise.allSettled(
      batch.map((to) =>
        resend.emails.send({
          from: "Rajiv @ GuruBuddy <rajiv@gurubuddy.ai>",
          to,
          subject: "🎨 What's new in GuruBuddy this week",
          html,
        })
      )
    );

    for (let j = 0; j < results.length; j++) {
      if (results[j].status === "fulfilled") {
        sent++;
      } else {
        failed.push(batch[j]);
      }
    }
  }

  return NextResponse.json({
    message: `Sent ${sent} emails${failed.length ? `, ${failed.length} failed` : ""}`,
    sent,
    failed: failed.length > 0 ? failed : undefined,
  });
}
