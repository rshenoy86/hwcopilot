"use client";

import { useState } from "react";
import Link from "next/link";
import { Printer, Plus, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Child, Worksheet } from "@/types";

interface WorksheetDisplayProps {
  worksheet: Worksheet;
  child: Child;
}

const DIFFICULTY_STARS = ["", "⭐", "⭐⭐", "⭐⭐⭐"];
const DIFFICULTY_LABELS = ["", "Easy Review", "Standard", "Challenge"];

// Render **bold** markdown as actual <strong> elements
function renderBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

// Render a block of text with line breaks and bold support
function RenderBlock({ text, className }: { text: string; className?: string }) {
  const lines = text.split("\n");
  return (
    <div className={className}>
      {lines.map((line, i) => (
        <p key={i} className={line.trim() === "" ? "h-2" : "mb-1"}>
          {renderBold(line)}
        </p>
      ))}
    </div>
  );
}

export default function WorksheetDisplay({ worksheet, child }: WorksheetDisplayProps) {
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const gradeLabel = child.grade === "K" ? "Kindergarten" : `Grade ${child.grade}`;
  const isDyslexia = worksheet.worksheet_type === "dyslexia";
  const isEarlyGrade = child.grade === "K" || child.grade === "1" || child.grade === "2";

  // Style tokens
  const bodyFont = isDyslexia
    ? "font-[family-name:var(--font-lexend,Arial,sans-serif)]"
    : "";
  const bodySize = isDyslexia ? "text-lg" : isEarlyGrade ? "text-base" : "text-sm";
  const lineHeight = isDyslexia ? "leading-loose" : "leading-relaxed";
  const letterSpacing = isDyslexia ? "tracking-wide" : "";
  const problemSpacing = isDyslexia ? "space-y-10" : isEarlyGrade ? "space-y-6" : "space-y-4";
  const sectionHeaderSize = isDyslexia ? "text-lg" : "text-base";
  const maxLineWidth = isDyslexia ? "max-w-xl" : "";
  const pageBg = isDyslexia ? "bg-amber-50/40" : "bg-white";

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
          {isDyslexia && (
            <span className="text-xs bg-blue-100 text-blue-700 font-medium px-2.5 py-1 rounded-full border border-blue-200">
              Dyslexia-friendly
            </span>
          )}
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
      <div
        className={`print-page max-w-2xl mx-auto border border-border rounded-xl shadow-sm p-8 ${pageBg} ${bodyFont} ${bodySize} ${lineHeight} ${letterSpacing}`}
      >
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className={`font-bold ${isDyslexia ? "text-2xl" : "text-xl"}`}>
            {child.name}&apos;s {worksheet.subject} Practice
          </h1>
          <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
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
        <section className={isDyslexia ? "mb-10" : "mb-6"}>
          <h2 className={`font-bold ${sectionHeaderSize} mb-3`}>📚 LET&apos;S LEARN IT</h2>
          <div className={`${isEarlyGrade || isDyslexia ? "bg-blue-50 rounded-lg" : ""} ${isDyslexia ? "p-5" : "p-3"} ${maxLineWidth}`}>
            <RenderBlock text={worksheet.content.learn_it} />
          </div>
        </section>

        {/* Worked Example */}
        <section className={isDyslexia ? "mb-10" : "mb-6"}>
          <h2 className={`font-bold ${sectionHeaderSize} mb-3`}>✏️ WORKED EXAMPLE</h2>
          <div className={`bg-amber-50 rounded-lg border border-amber-100 ${isDyslexia ? "p-5" : "p-3"} ${maxLineWidth}`}>
            <RenderBlock text={worksheet.content.worked_example} />
          </div>
        </section>

        <Separator className="my-4" />

        {/* Problems */}
        <section className={isDyslexia ? "mb-10" : "mb-6"}>
          <h2 className={`font-bold ${sectionHeaderSize} mb-4`}>📝 YOUR TURN</h2>
          <div className={problemSpacing}>
            {worksheet.content.problems.map((problem, i) => (
              <div key={i} className={isDyslexia ? "space-y-3" : "space-y-1"}>
                <p className={`font-medium ${maxLineWidth}`}>
                  {i + 1}. <RenderBlock text={problem} className="inline" />
                </p>
                {/* Answer lines */}
                <div className={isDyslexia ? "space-y-3 mt-3" : isEarlyGrade ? "space-y-2 mt-2" : "mt-2"}>
                  {isDyslexia ? (
                    <>
                      <div className="border-b-2 border-gray-400 h-10" />
                      <div className="border-b-2 border-gray-400 h-10" />
                      <div className="border-b-2 border-gray-400 h-10" />
                    </>
                  ) : isEarlyGrade ? (
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
        <section className={isDyslexia ? "mb-10" : "mb-6"}>
          <h2 className={`font-bold ${sectionHeaderSize} mb-3`}>⭐ CHALLENGE</h2>
          <div className={`bg-purple-50 rounded-lg border border-purple-100 ${isDyslexia ? "p-5" : "p-3"} ${maxLineWidth}`}>
            <RenderBlock text={worksheet.content.challenge} />
          </div>
          <div className={`mt-3 ${isDyslexia ? "space-y-3" : "space-y-2"}`}>
            <div className={`border-b h-7 ${isDyslexia ? "border-b-2 border-gray-400 h-10" : "border-gray-300"}`} />
            <div className={`border-b h-7 ${isDyslexia ? "border-b-2 border-gray-400 h-10" : "border-gray-300"}`} />
          </div>
        </section>

        <Separator className="my-4" />

        {/* Self-assessment */}
        <section>
          <p className={`font-medium ${isDyslexia ? "text-base" : ""}`}>
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
        <div
          className={`print-page-break print-page max-w-2xl mx-auto border border-border rounded-xl shadow-sm p-8 mt-6 ${pageBg} ${bodyFont} ${bodySize} ${lineHeight} ${letterSpacing}`}
        >
          <h2 className={`font-bold text-center mb-2 ${isDyslexia ? "text-2xl" : "text-xl"}`}>
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
                  <p className="font-semibold"><RenderBlock text={item.answer} /></p>
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
