import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extractTopicFromImage } from "@/lib/ai/extract-topic";
import type { Grade } from "@/types";

const ALLOWED_MEDIA_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
type AllowedMediaType = (typeof ALLOWED_MEDIA_TYPES)[number];

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { imageBase64, mediaType, grade } = body as {
    imageBase64?: string;
    mediaType?: string;
    grade?: string;
  };

  if (!imageBase64 || !mediaType || !grade) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!ALLOWED_MEDIA_TYPES.includes(mediaType as AllowedMediaType)) {
    return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
  }

  try {
    const result = await extractTopicFromImage(
      imageBase64,
      mediaType as AllowedMediaType,
      grade as Grade
    );
    return NextResponse.json(result);
  } catch (err) {
    console.error("Topic extraction error:", err);
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 });
  }
}
