"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Test, Child, TestQuestion } from "@/types";
import { TestVisualRenderer } from "@/components/tests/visuals";

interface StaarAssessmentProps {
  test: Test;
  child: Child;
}

export default function StaarAssessment({ test, child }: StaarAssessmentProps) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const questions = test.questions;
  const q: TestQuestion = questions[current];
  const totalQ = questions.length;
  const isFirst = current === 0;
  const isLast = current === totalQ - 1;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === totalQ;

  function selectAnswer(letter: string) {
    setAnswers((prev) => ({ ...prev, [q.number]: letter }));
  }

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);

    const payload = questions.map((question) => ({
      number: question.number,
      answer: answers[question.number] ?? "",
    }));

    const res = await fetch(`/api/staar/${test.id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: payload }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    router.push(`/staar/${test.id}/results`);
  }

  const selectedLetter = answers[q.number];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress header */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium text-muted-foreground">
            {child.name} · STAAR Math Readiness
          </span>
          <span className="font-semibold">
            {current + 1} of {totalQ}
          </span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((current + 1) / totalQ) * 100}%` }}
          />
        </div>
        <div className="flex gap-1 mt-2">
          {questions.map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 h-1 rounded-full transition-colors",
                answers[questions[i].number]
                  ? "bg-primary"
                  : i === current
                  ? "bg-primary/40"
                  : "bg-slate-100"
              )}
            />
          ))}
        </div>
      </div>

      {/* Category label */}
      <div className="mb-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {q.topic_tag}
        </span>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-6 mb-4">
        <p className="font-semibold text-lg leading-snug mb-4">
          {current + 1}. {q.question}
        </p>

        {q.visual && (
          <div className="mb-4">
            <TestVisualRenderer visual={q.visual} />
          </div>
        )}

        {/* Answer choices */}
        <div className="space-y-2.5">
          {(q.options ?? []).map((option) => {
            const letter = option.trim().charAt(0).toUpperCase();
            const isSelected = selectedLetter === letter;
            return (
              <button
                key={option}
                onClick={() => selectAnswer(letter)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all",
                  isSelected
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/40 hover:bg-slate-50 text-foreground"
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive mb-4">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrent((c) => c - 1)}
          disabled={isFirst || submitting}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <span className="text-xs text-muted-foreground">
          {answeredCount} of {totalQ} answered
        </span>

        {isLast ? (
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
          >
            {submitting ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Submitting...</>
            ) : (
              "See my gap report"
            )}
          </Button>
        ) : (
          <Button
            onClick={() => setCurrent((c) => c + 1)}
            disabled={!selectedLetter || submitting}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>

      {isLast && !allAnswered && (
        <p className="text-center text-xs text-muted-foreground mt-3">
          Answer all {totalQ} questions to see your gap report.
        </p>
      )}
    </div>
  );
}
