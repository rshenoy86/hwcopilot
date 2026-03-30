"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import type { Test, Child, TestQuestion } from "@/types";
import { TestVisualRenderer } from "@/components/tests/visuals";

interface TestPaperProps {
  test: Test;
  child: Child;
}

export default function TestPaper({ test, child }: TestPaperProps) {
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  const sectionA = test.questions.filter((q) => q.section === "A");
  const sectionB = test.questions.filter((q) => q.section === "B");
  const sectionC = test.questions.filter((q) => q.section === "C");

  return (
    <div>
      {/* Controls — hidden when printing */}
      <div className="flex items-center justify-between mb-4 no-print">
        <div>
          <h1 className="text-2xl font-bold">{test.title}</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            Print the test, have {child.name} complete it, then come back to upload it for grading.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAnswerKey(!showAnswerKey)}
          >
            {showAnswerKey ? "Hide" : "Show"} Answer Key
          </Button>
          <Button size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-1" />
            Print
          </Button>
        </div>
      </div>

      {/* Test Paper */}
      <div className="bg-white border border-border rounded-xl p-8 shadow-sm print:shadow-none print:border-none print:rounded-none print:p-0">
        {/* Header */}
        <div className="border-b-2 border-foreground pb-4 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold">{test.title}</h2>
              <p className="text-sm mt-1">
                {test.subject} · {test.grade === "K" ? "Kindergarten" : `Grade ${test.grade}`}
              </p>
            </div>
            <div className="text-right text-sm space-y-1">
              <p>Score: _______ / {test.total_points}</p>
            </div>
          </div>
          <div className="flex gap-8 mt-3 text-sm">
            <span>Name: ___________________________</span>
            <span>Date: _______________</span>
          </div>
        </div>

        {/* Section A — Multiple Choice */}
        <SectionBlock
          title="Section A — Multiple Choice"
          subtitle={`${sectionA.length} questions · ${sectionA[0]?.points ?? 2} points each`}
          questions={sectionA}
          showAnswers={showAnswerKey}
        />

        {/* Section B — Short Answer */}
        <SectionBlock
          title="Section B — Short Answer"
          subtitle={`${sectionB.length} questions · ${sectionB[0]?.points ?? 3} points each`}
          questions={sectionB}
          showAnswers={showAnswerKey}
        />

        {/* Section C — Show Your Work */}
        <SectionBlock
          title="Section C — Show Your Work"
          subtitle={`${sectionC.length} questions · ${sectionC[0]?.points ?? 4} points each`}
          questions={sectionC}
          showAnswers={showAnswerKey}
        />
      </div>
    </div>
  );
}

function SectionBlock({
  title,
  subtitle,
  questions,
  showAnswers,
}: {
  title: string;
  subtitle: string;
  questions: TestQuestion[];
  showAnswers: boolean;
}) {
  if (questions.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h3 className="font-bold text-base">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="space-y-6">
        {questions.map((q) => (
          <QuestionBlock key={q.number} question={q} showAnswer={showAnswers} />
        ))}
      </div>
    </div>
  );
}

function QuestionBlock({ question, showAnswer }: { question: TestQuestion; showAnswer: boolean }) {
  return (
    <div>
      <p className="font-medium text-sm mb-2">
        {question.number}. {question.question}
        <span className="text-muted-foreground font-normal ml-1">({question.points} pts)</span>
      </p>

      {question.visual && (
        <div className="ml-4 mb-2">
          <TestVisualRenderer visual={question.visual} />
        </div>
      )}

      {question.type === "multiple_choice" && question.options && (
        <div className="grid grid-cols-2 gap-1 ml-4 text-sm">
          {question.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-sm border border-foreground/30 inline-block shrink-0" />
              <span>{opt}</span>
            </div>
          ))}
        </div>
      )}

      {question.type === "short_answer" && (
        <div className="ml-4 mt-2">
          <div className="border-b border-foreground/30 w-full mt-4 mb-1" />
          <div className="border-b border-foreground/30 w-3/4 mb-1" />
        </div>
      )}

      {question.type === "show_work" && (
        <div className="ml-4 mt-2">
          <div className="border border-border rounded p-2 h-24 text-xs text-muted-foreground flex items-start">
            Show your work here:
          </div>
          <p className="text-sm mt-2">Answer: ___________________________</p>
        </div>
      )}

      {showAnswer && (
        <div className="ml-4 mt-2 bg-green-50 border border-green-200 rounded px-3 py-1.5 text-sm text-green-800 no-print">
          <span className="font-medium">Answer: </span>{question.correct_answer}
          {question.solution_steps && question.solution_steps.length > 0 && (
            <ul className="mt-1 space-y-0.5 text-xs">
              {question.solution_steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
