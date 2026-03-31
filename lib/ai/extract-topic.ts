import Anthropic from "@anthropic-ai/sdk";
import { getSubjectsForGrade } from "@/lib/curriculum";
import type { Grade } from "@/types";

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export interface ExtractedTopic {
  subject: string;
  topic: string;
  description: string;
}

export async function extractTopicFromImage(
  imageBase64: string,
  mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif",
  grade: Grade
): Promise<ExtractedTopic> {
  const client = getClient();
  const subjects = getSubjectsForGrade(grade);
  const gradeLabel = grade === "K" ? "Kindergarten" : `Grade ${grade}`;

  const subjectList = subjects
    .map((s) => `- "${s.subject}": topics include ${s.topics.join(", ")}`)
    .join("\n");

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 300,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: imageBase64 },
          },
          {
            type: "text",
            text: `This is a homework problem for a ${gradeLabel} student. Identify the subject and specific topic being tested.

Valid subjects and topics for ${gradeLabel}:
${subjectList}

Respond with valid JSON only — no markdown, no extra text:
{
  "subject": "exact subject string from the list above",
  "topic": "closest matching topic from that subject's list",
  "description": "one short phrase describing what this problem practices, e.g. 'telling time to the nearest 5 minutes'"
}`,
          },
        ],
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  return JSON.parse(content.text) as ExtractedTopic;
}
