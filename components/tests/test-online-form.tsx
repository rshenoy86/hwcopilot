"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { TestVisualRenderer } from "@/components/tests/visuals";
import type { Test, Child, TestQuestion } from "@/types";

interface TestOnlineFormProps {
  test: Test;
  child: Child;
}

interface Answers {
  [questionNumber: number]: { answer: string; work?: string };
}

export default function TestOnlineForm({ test, child }: TestOnlineFormProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalQuestions = test.questions.length;
  const answeredCount = Object.values(answers).filter((a) => a.answer.trim() !== "").length;
  const allAnswered = answeredCount === totalQuestions;

  function setAnswer(number: number, answer: string) {
    setAnswers((prev) => ({ ...prev, [number]: { ...prev[number], answer } }));
  }

  function setWork(number: number, work: string) {
    setAnswers((prev) => ({ ...prev, [number]: { ...prev[number], work, answer: prev[number]?.answer ?? "" } }));
  }

  async function handleSubmit() {
    if (!allAnswered) {
      setError("Please answer all questions before submitting.");
      return;
    }
    setError(null);
    setSubmitting(true);

    const payload = test.questions.map((q) => ({
      number: q.number,
      answer: answers[q.number]?.answer ?? "",
      work: answers[q.number]?.work,
    }));

    const res = await fetch(`/api/tests/${test.id}/submit-online`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: payload }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong. Please try again.");
      return;
    }

    router.push(`/test-prep/${test.id}/results`);
  }

  const sectionA = test.questions.filter((q) => q.section === "A");
  const sectionB = test.questions.filter((q) => q.section === "B");
  const sectionC = test.questions.filter((q) => q.section === "C");

  return (
    <div className="bg-white border border-border rounded-xl shadow-sm">
      {/* Progress header */}
      <div className="sticky top-16 z-10 bg-white border-b border-border px-6 py-3 flex items-center justify-between rounded-t-xl">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">
            {answeredCount} / {totalQuestions} answered
          </span>
          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
        <span className="text-sm text-muted-foreground">{test.total_points} points total</span>
      </div>

      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="border-b-2 border-foreground pb-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold">{test.title}</h2>
              <p className="text-sm mt-0.5">{test.subject} · {test.grade === "K" ? "Kindergarten" : `Grade ${test.grade}`}</p>
            </div>
            <div className="text-sm text-right">
              <p className="text-muted-foreground">Student</p>
              <p className="font-medium">{child.name}</p>
            </div>
          </div>
        </div>

        {/* Section A */}
        <OnlineSection
          title="Section A — Multiple Choice"
          subtitle={`${sectionA.length} questions · ${sectionA[0]?.points ?? 2} points each`}
          questions={sectionA}
          answers={answers}
          onAnswer={setAnswer}
          onWork={setWork}
        />

        {/* Section B */}
        <OnlineSection
          title="Section B — Short Answer"
          subtitle={`${sectionB.length} questions · ${sectionB[0]?.points ?? 3} points each`}
          questions={sectionB}
          answers={answers}
          onAnswer={setAnswer}
          onWork={setWork}
        />

        {/* Section C */}
        <OnlineSection
          title="Section C — Show Your Work"
          subtitle={`${sectionC.length} questions · ${sectionC[0]?.points ?? 4} points each`}
          questions={sectionC}
          answers={answers}
          onAnswer={setAnswer}
          onWork={setWork}
        />

        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="border-t border-border pt-6 flex flex-col items-center gap-3">
          {!allAnswered && (
            <p className="text-sm text-muted-foreground">
              {totalQuestions - answeredCount} question{totalQuestions - answeredCount !== 1 ? "s" : ""} remaining
            </p>
          )}
          <Button
            size="lg"
            className="w-full max-w-sm"
            disabled={!allAnswered || submitting}
            onClick={handleSubmit}
          >
            {submitting ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Grading your test...</>
            ) : (
              "Submit for Grading"
            )}
          </Button>
          {submitting && (
            <p className="text-xs text-muted-foreground text-center">
              This takes about 10–20 seconds. Please don&apos;t close this page.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function OnlineSection({
  title, subtitle, questions, answers, onAnswer, onWork,
}: {
  title: string;
  subtitle: string;
  questions: TestQuestion[];
  answers: Answers;
  onAnswer: (n: number, v: string) => void;
  onWork: (n: number, v: string) => void;
}) {
  if (questions.length === 0) return null;
  return (
    <div>
      <div className="mb-4">
        <h3 className="font-bold text-base">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="space-y-6">
        {questions.map((q) => (
          <OnlineQuestion
            key={q.number}
            question={q}
            value={answers[q.number]?.answer ?? ""}
            work={answers[q.number]?.work ?? ""}
            onAnswer={(v) => onAnswer(q.number, v)}
            onWork={(v) => onWork(q.number, v)}
          />
        ))}
      </div>
    </div>
  );
}

function OnlineQuestion({
  question, value, work, onAnswer, onWork,
}: {
  question: TestQuestion;
  value: string;
  work: string;
  onAnswer: (v: string) => void;
  onWork: (v: string) => void;
}) {
  const answered = value.trim() !== "";

  return (
    <div className={`rounded-lg border p-4 transition-colors ${answered ? "border-primary/30 bg-primary/5" : "border-border"}`}>
      <p className="font-medium text-sm mb-2">
        {question.number}. {question.question}
        <span className="text-muted-foreground font-normal ml-1">({question.points} pts)</span>
      </p>

      {question.visual && (
        <div className="mb-3">
          <TestVisualRenderer visual={question.visual} />
        </div>
      )}

      {question.type === "multiple_choice" && question.options && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
          {question.options.map((opt) => {
            const letter = opt.charAt(0);
            const selected = value === letter;
            return (
              <button
                key={opt}
                onClick={() => onAnswer(selected ? "" : letter)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-sm text-left transition-all ${
                  selected
                    ? "border-primary bg-primary text-primary-foreground font-medium"
                    : "border-border hover:border-primary/50 hover:bg-accent"
                }`}
              >
                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold ${
                  selected ? "border-primary-foreground bg-primary-foreground text-primary" : "border-muted-foreground"
                }`}>
                  {selected ? "✓" : letter}
                </span>
                {opt.slice(3)}
              </button>
            );
          })}
        </div>
      )}

      {question.type === "short_answer" && (
        <Input
          className="mt-3"
          placeholder="Type your answer here..."
          value={value}
          onChange={(e) => onAnswer(e.target.value)}
        />
      )}

      {question.type === "show_work" && (
        <div className="mt-3 space-y-2">
          <Textarea
            placeholder="Show your work here..."
            className="min-h-[80px] resize-none text-sm"
            value={work}
            onChange={(e) => onWork(e.target.value)}
          />
          <Input
            placeholder="Final answer..."
            value={value}
            onChange={(e) => onAnswer(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
