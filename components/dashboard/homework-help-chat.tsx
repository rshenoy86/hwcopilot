"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/utils";
import type { Child, HomeworkHelpSession } from "@/types";

interface HomeworkHelpChatProps {
  children: Child[];
  recentSessions: HomeworkHelpSession[];
}

export default function HomeworkHelpChat({ children, recentSessions }: HomeworkHelpChatProps) {
  const [question, setQuestion] = useState("");
  const [selectedChildId, setSelectedChildId] = useState(children[0]?.id || "");
  const [simplify, setSimplify] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAsk() {
    if (!question.trim()) {
      setError("Please enter a question");
      return;
    }
    setError(null);
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("/api/homework-help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          childId: selectedChildId || undefined,
          simplifyExplanation: simplify,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      setResponse(data.response);
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      {/* Input area */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {children.length > 0 && (
              <div className="space-y-1.5">
                <Label>For which child?</Label>
                <Select value={selectedChildId} onValueChange={setSelectedChildId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select child" />
                  </SelectTrigger>
                  <SelectContent>
                    {children.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} ({c.grade === "K" ? "K" : `Gr. ${c.grade}`})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-end pb-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={simplify}
                  onCheckedChange={(v) => setSimplify(v === true)}
                />
                <span className="text-sm">
                  Explain it simply (for the child to read)
                </span>
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="question">Homework question</Label>
            <Textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Paste the homework question here... e.g. 'What is 3/4 + 1/2?' or 'What caused the American Revolution?'"
              rows={4}
            />
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button className="w-full" onClick={handleAsk} disabled={loading || !question.trim()}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Getting your answer...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Get Help
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Response */}
      {response && (
        <Card className="border-green-200">
          <CardContent className="p-5">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {response.split('\n').map((line, i) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <p key={i} className="font-bold text-base mt-4 mb-1 first:mt-0">{line.replace(/\*\*/g, '')}</p>;
                  }
                  if (line.trim() === '') return <div key={i} className="h-2" />;
                  return <p key={i} className="mb-1">{line}</p>;
                })}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setResponse(null);
                  setQuestion("");
                }}
              >
                Ask another question
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent sessions */}
      {recentSessions.length > 0 && !response && (
        <div>
          <h2 className="text-base font-semibold mb-3">Recent questions</h2>
          <div className="space-y-2">
            {recentSessions.map((session) => (
              <button
                key={session.id}
                className="w-full text-left p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-accent/50 transition-all"
                onClick={() => {
                  setQuestion(session.question);
                  setResponse(session.response);
                }}
              >
                <p className="text-sm font-medium line-clamp-2">{session.question}</p>
                <p className="text-xs text-muted-foreground mt-1">{formatDate(session.created_at)}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
