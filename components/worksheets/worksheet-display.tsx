"use client";

import { useState } from "react";
import Link from "next/link";
import { Printer, Plus, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Child, Worksheet } from "@/types";

interface WorksheetDisplayProps {
  worksheet: Worksheet;
  child: Child;
}

const DIFFICULTY_STARS = ["", "⭐", "⭐⭐", "⭐⭐⭐"];
const DIFFICULTY_LABELS = ["", "Easy Review", "Standard", "Challenge"];

export default function WorksheetDisplay({ worksheet, child }: WorksheetDisplayProps) {
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const gradeLabel = child.grade === "K" ? "Kindergarten" : `Grade ${child.grade}`;

  // Font size based on grade
  const isEarlyGrade = child.grade === "K" || child.grade === "1" || child.grade === "2";
  const isMiddleGrade = child.grade === "3" || child.grade === "4" || child.grade === "5";
  const bodyFontSize = isEarlyGrade ? "text-base" : isMiddleGrade ? "text-sm" : "text-[13px]";
  const problemSpacing = isEarlyGrade ? "space-y-6" : isMiddleGrade ? "space-y-4" : "space-y-3";

  function handlePrint() {
    window.print();
  }

  return (
    <div>
      {/* Toolbar — hidden when printing */}
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Dashboard
            </Button>
          </Link>
          <Link href="/worksheets/new">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              New Worksheet
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAnswerKey(!showAnswerKey)}
          >
            {showAnswerKey ? "Hide Answer Key" : "Show Answer Key"}
          </Button>
          <Button onClick={handlePrint} size="sm">
            <Printer className="h-4 w-4 mr-1" />
            Print
          </Button>
        </div>
      </div>

      {/* Worksheet */}
      <div className={`print-page max-w-2xl mx-auto bg-white border border-border rounded-xl shadow-sm p-8 ${bodyFontSize}`}>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-center">
            {child.name}&apos;s {worksheet.subject} Practice
          </h1>
          <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
            <span>Topic: <strong className="text-foreground">{worksheet.topic}</strong></span>
            <span>Date: <span className="border-b border-dashed border-muted-foreground">________________</span></span>
            <span>Difficulty: {DIFFICULTY_STARS[worksheet.difficulty]}</span>
          </div>
          <div className="text-center text-xs text-muted-foreground mt-1">
            {gradeLabel} · {DIFFICULTY_LABELS[worksheet.difficulty]}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Learn It */}
        <section className="mb-6">
          <h2 className="font-bold text-base mb-2">📚 LET&apos;S LEARN IT</h2>
          <div className={`${isEarlyGrade ? "bg-blue-50 rounded-lg p-3" : ""} leading-relaxed`}>
            <p>{worksheet.content.learn_it}</p>
          </div>
        </section>

        {/* Worked Example */}
        <section className="mb-6">
          <h2 className="font-bold text-base mb-2">✏️ WORKED EXAMPLE</h2>
          <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
            <p className="whitespace-pre-wrap leading-relaxed">{worksheet.content.worked_example}</p>
          </div>
        </section>

        <Separator className="my-4" />

        {/* Problems */}
        <section className="mb-6">
          <h2 className="font-bold text-base mb-4">📝 YOUR TURN</h2>
          <div className={problemSpacing}>
            {worksheet.content.problems.map((problem, i) => (
              <div key={i} className="space-y-1">
                <p className="font-medium">
                  {i + 1}. {problem}
                </p>
                {/* Answer lines */}
                <div className={isEarlyGrade ? "space-y-2 mt-2" : "mt-2"}>
                  {isEarlyGrade ? (
                    <>
                      <div className="border-b border-gray-300 h-8" />
                      <div className="border-b border-gray-300 h-8" />
                    </>
                  ) : (
                    <div className="border-b border-gray-300 h-7 mt-1" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <Separator className="my-4" />

        {/* Challenge */}
        <section className="mb-6">
          <h2 className="font-bold text-base mb-2">⭐ CHALLENGE</h2>
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
            <p>{worksheet.content.challenge}</p>
          </div>
          <div className="mt-3 space-y-2">
            <div className="border-b border-gray-300 h-7" />
            <div className="border-b border-gray-300 h-7" />
          </div>
        </section>

        <Separator className="my-4" />

        {/* Self-assessment */}
        <section>
          <p className="font-medium">
            HOW DID I DO?{" "}
            <span className="font-normal">
              ☐ I got it!{"  "}
              ☐ I need more help{"  "}
              ☐ Too easy!
            </span>
          </p>
        </section>
      </div>

      {/* Answer Key */}
      {showAnswerKey && (
        <div className={`print-page-break print-page max-w-2xl mx-auto bg-white border border-border rounded-xl shadow-sm p-8 mt-6 ${bodyFontSize}`}>
          <h2 className="text-xl font-bold text-center mb-2">
            {child.name} — Answer Key — {today}
          </h2>
          <p className="text-center text-sm text-muted-foreground mb-6">
            {worksheet.subject}: {worksheet.topic} · {gradeLabel}
          </p>

          <Separator className="mb-4" />

          <div className={problemSpacing}>
            {worksheet.answer_key.map((item) => (
              <div key={item.number} className="flex gap-3">
                <span className="font-bold w-6 shrink-0">{item.number}.</span>
                <div>
                  <p className="font-semibold">{item.answer}</p>
                  {item.explanation && (
                    <p className="text-sm text-muted-foreground mt-0.5">{item.explanation}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom actions — hidden when printing */}
      <div className="no-print mt-6 flex justify-center gap-3">
        <Link href="/worksheets/new">
          <Button variant="outline">
            <BookOpen className="h-4 w-4 mr-1" />
            Generate Another
          </Button>
        </Link>
        <Button onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-1" />
          Print Worksheet
        </Button>
      </div>
    </div>
  );
}
