import Anthropic from "@anthropic-ai/sdk";
import type { Grade } from "@/types";

function getClient() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
}

export interface HomeworkHelpParams {
  question: string;
  grade: Grade;
  childName?: string;
  simplifyExplanation?: boolean;
}

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(userId);

  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + 60000 });
    return true;
  }

  if (limit.count >= 10) {
    return false;
  }

  limit.count++;
  return true;
}

export async function getHomeworkHelp(
  params: HomeworkHelpParams,
  userId: string
): Promise<string> {
  if (!checkRateLimit(userId)) {
    throw new Error("Rate limit exceeded. Please wait a minute before asking another question.");
  }

  const gradeLabel = params.grade === "K" ? "Kindergarten" : `Grade ${params.grade}`;
  const childLabel = params.childName ? params.childName : "my child";

  const systemPrompt = `You are a patient, encouraging tutor helping a ${gradeLabel} student understand their homework. Explain concepts clearly using age-appropriate language. Always show your work step by step.

Format your response with these clearly labeled sections:
**What This Is About**
[Brief context on the concept]

**Step-by-Step Solution**
[Numbered steps showing exactly how to solve it]

**The Answer**
[Clear final answer]

**Tips to Remember**
[1-2 helpful tips for similar problems]

Keep your tone warm, encouraging, and age-appropriate for ${gradeLabel}.`;

  const userPrompt = params.simplifyExplanation
    ? `${childLabel} is in ${gradeLabel} and needs help with this question. Please explain it in the simplest possible terms, like you're talking directly to the child:\n\n${params.question}`
    : `${childLabel} is in ${gradeLabel} and needs help with this question:\n\n${params.question}`;

  const message = await getClient().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from AI");
  }

  return content.text;
}
