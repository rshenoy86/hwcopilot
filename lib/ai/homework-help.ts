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

// In-memory rate limiters
const minuteRateLimitMap = new Map<string, { count: number; resetAt: number }>();
const dailyRateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();

  // Per-minute limit (10/min)
  const minute = minuteRateLimitMap.get(userId);
  if (!minute || now > minute.resetAt) {
    minuteRateLimitMap.set(userId, { count: 1, resetAt: now + 60000 });
  } else if (minute.count >= 10) {
    return false;
  } else {
    minute.count++;
  }

  // Daily limit (50/day)
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const daily = dailyRateLimitMap.get(userId);
  if (!daily || now > daily.resetAt) {
    dailyRateLimitMap.set(userId, { count: 1, resetAt: startOfDay.getTime() + 86400000 });
  } else if (daily.count >= 50) {
    return false;
  } else {
    daily.count++;
  }

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
