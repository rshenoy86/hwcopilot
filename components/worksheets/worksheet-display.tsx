"use client";

import { useState } from "react";
import Link from "next/link";
import { Printer, Plus, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Child, Worksheet, WorksheetVisual } from "@/types";
import { WorksheetVisualRenderer } from "@/components/tests/visuals";
import { getThemeConfig } from "@/lib/theme-config";
import { ThemeSVG } from "./theme-svgs";

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
  const theme = getThemeConfig(worksheet.theme);
  const hasTheme = !!worksheet.theme;

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
        className={`print-page max-w-2xl mx-auto border rounded-xl shadow-sm ${pageBg} ${bodyFont} ${bodySize} ${lineHeight} ${letterSpacing} overflow-hidden`}
        style={{ borderColor: hasTheme ? theme.primary : undefined }}
      >
        {/* Themed top bar */}
        {hasTheme && (
          <div
            className="h-2 w-full"
            style={{ backgroundColor: theme.primary }}
          />
        )}

        <div className="p-8 relative pb-24">
          {/* Bottom corner characters */}
          {hasTheme && (
            <>
              <div className="absolute bottom-4 left-4 w-14 h-14 opacity-70 pointer-events-none">
                {worksheet.theme_image_url ? (
                  <img src={worksheet.theme_image_url} alt="" className="w-full h-full object-contain" />
                ) : (
                  <ThemeSVG theme={worksheet.theme} worksheetId={worksheet.id + "-bl"} className="w-full h-full drop-shadow-sm" />
                )}
              </div>
              <div className="absolute bottom-4 right-4 w-14 h-14 opacity-70 pointer-events-none">
                {worksheet.theme_image_url ? (
                  <img src={worksheet.theme_image_url} alt="" className="w-full h-full object-contain" />
                ) : (
                  <ThemeSVG theme={worksheet.theme} worksheetId={worksheet.id + "-br"} className="w-full h-full drop-shadow-sm" />
                )}
              </div>
            </>
          )}

          {/* Header — characters on both sides, title centered */}
          <div className="flex items-start gap-3 mb-6">
            {/* Top-left character */}
            {hasTheme && (
              <div className="w-20 h-20 shrink-0">
                {worksheet.theme_image_url ? (
                  <img src={worksheet.theme_image_url} alt="" className="w-full h-full object-contain drop-shadow-md" />
                ) : (
                  <ThemeSVG theme={worksheet.theme} worksheetId={worksheet.id + "-tl"} className="w-full h-full drop-shadow-md" />
                )}
              </div>
            )}

            <div className="flex-1 text-center min-w-0">
              <h1
                className={`font-bold ${isDyslexia ? "text-2xl" : "text-xl"} ${hasTheme ? "font-[family-name:var(--font-fredoka,sans-serif)]" : ""}`}
                style={hasTheme ? { color: theme.dark } : undefined}
              >
                {child.name}&apos;s {worksheet.subject} Practice
              </h1>

              {hasTheme && (
                <div
                  className="inline-flex items-center gap-1 mt-1 px-3 py-0.5 rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: theme.primary }}
                >
                  {theme.emoji} {worksheet.theme}
                </div>
              )}

              <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                <span>Topic: <strong className="text-foreground">{worksheet.topic}</strong></span>
                <span>Date: <span className="border-b border-dashed border-muted-foreground">________________</span></span>
                <span>Difficulty: {DIFFICULTY_STARS[worksheet.difficulty]}</span>
              </div>
              <div className="text-center text-xs text-muted-foreground mt-1">
                {gradeLabel} · {DIFFICULTY_LABELS[worksheet.difficulty]}
              </div>
            </div>

            {/* Top-right character */}
            {hasTheme && (
              <div className="w-24 h-24 shrink-0">
                {worksheet.theme_image_url ? (
                  <img src={worksheet.theme_image_url} alt="" className="w-full h-full object-contain drop-shadow-md" />
                ) : (
                  <ThemeSVG theme={worksheet.theme} worksheetId={worksheet.id} className="w-full h-full drop-shadow-md" />
                )}
              </div>
            )}
          </div>

          <Separator className="my-4" style={hasTheme ? { backgroundColor: theme.primary, opacity: 0.3 } : undefined} />

          {/* Learn It */}
          <section className={isDyslexia ? "mb-10" : "mb-6"}>
            <h2
              className={`font-bold ${sectionHeaderSize} mb-3 flex items-center gap-2`}
            >
              {hasTheme ? (
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-white text-sm font-bold"
                  style={{ backgroundColor: theme.primary }}
                >
                  📚 LET&apos;S LEARN IT
                </span>
              ) : (
                "📚 LET'S LEARN IT"
              )}
            </h2>
            <div
              className={`rounded-lg ${isDyslexia ? "p-5" : "p-3"} ${maxLineWidth}`}
              style={hasTheme
                ? { backgroundColor: theme.light, borderLeft: `3px solid ${theme.primary}` }
                : { backgroundColor: "rgb(239 246 255)" }
              }
            >
              <RenderBlock text={worksheet.content.learn_it} />
            </div>
          </section>

          {/* Worked Example */}
          <section className={isDyslexia ? "mb-10" : "mb-6"}>
            <h2 className={`font-bold ${sectionHeaderSize} mb-3`}>
              {hasTheme ? (
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-white text-sm font-bold"
                  style={{ backgroundColor: theme.dark }}
                >
                  ✏️ WORKED EXAMPLE
                </span>
              ) : (
                "✏️ WORKED EXAMPLE"
              )}
            </h2>
            <div
              className={`rounded-lg border ${isDyslexia ? "p-5" : "p-3"} ${maxLineWidth}`}
              style={hasTheme
                ? { backgroundColor: "rgb(255 251 235)", borderColor: theme.primary + "44" }
                : { backgroundColor: "rgb(255 251 235)", borderColor: "rgb(254 243 199)" }
              }
            >
              <RenderBlock text={worksheet.content.worked_example} />
            </div>
          </section>

          <Separator className="my-4" style={hasTheme ? { backgroundColor: theme.primary, opacity: 0.3 } : undefined} />

          {/* Problems */}
          <section className={isDyslexia ? "mb-10" : "mb-6"}>
            <h2 className={`font-bold ${sectionHeaderSize} mb-4`}>
              {hasTheme ? (
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-white text-sm font-bold"
                  style={{ backgroundColor: theme.primary }}
                >
                  📝 YOUR TURN
                </span>
              ) : (
                "📝 YOUR TURN"
              )}
            </h2>
            <div className={problemSpacing}>
              {worksheet.content.problems.map((problem, i) => {
                const visual: WorksheetVisual | null | undefined =
                  worksheet.content.problem_visuals?.[i];
                return (
                <div key={i} className={isDyslexia ? "space-y-3" : "space-y-1"}>
                  <p className={`font-medium ${maxLineWidth}`}>
                    {i + 1}. <RenderBlock text={problem} className="inline" />
                  </p>
                  {visual && <WorksheetVisualRenderer visual={visual} />}
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
                );
              })}
            </div>
          </section>

          <Separator className="my-4" style={hasTheme ? { backgroundColor: theme.primary, opacity: 0.3 } : undefined} />

          {/* Challenge */}
          <section className={isDyslexia ? "mb-10" : "mb-6"}>
            <h2 className={`font-bold ${sectionHeaderSize} mb-3`}>
              {hasTheme ? (
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-white text-sm font-bold"
                  style={{ backgroundColor: theme.dark }}
                >
                  ⭐ CHALLENGE
                </span>
              ) : (
                "⭐ CHALLENGE"
              )}
            </h2>
            <div
              className={`rounded-lg border ${isDyslexia ? "p-5" : "p-3"} ${maxLineWidth}`}
              style={hasTheme
                ? { backgroundColor: theme.light, borderColor: theme.primary + "55" }
                : { backgroundColor: "rgb(250 245 255)", borderColor: "rgb(233 213 255)" }
              }
            >
              <RenderBlock text={worksheet.content.challenge} />
            </div>
            <div className={`mt-3 ${isDyslexia ? "space-y-3" : "space-y-2"}`}>
              <div className={`border-b h-7 ${isDyslexia ? "border-b-2 border-gray-400 h-10" : "border-gray-300"}`} />
              <div className={`border-b h-7 ${isDyslexia ? "border-b-2 border-gray-400 h-10" : "border-gray-300"}`} />
            </div>
          </section>

          <Separator className="my-4" style={hasTheme ? { backgroundColor: theme.primary, opacity: 0.3 } : undefined} />

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
      </div>

      {/* Answer Key */}
      {showAnswerKey && (
        <div
          className={`print-page-break print-page max-w-2xl mx-auto border rounded-xl shadow-sm mt-6 overflow-hidden ${pageBg} ${bodyFont} ${bodySize} ${lineHeight} ${letterSpacing}`}
          style={{ borderColor: hasTheme ? theme.primary : undefined }}
        >
          {hasTheme && <div className="h-2 w-full" style={{ backgroundColor: theme.primary }} />}
          <div className="p-8">
            <h2 className={`font-bold text-center mb-2 ${isDyslexia ? "text-2xl" : "text-xl"} ${hasTheme ? "font-[family-name:var(--font-fredoka,sans-serif)]" : ""}`}
              style={hasTheme ? { color: theme.dark } : undefined}
            >
              {child.name} — Answer Key — {today}
            </h2>
            <p className="text-center text-sm text-muted-foreground mb-6">
              {worksheet.subject}: {worksheet.topic} · {gradeLabel}
            </p>

            <Separator className="mb-4" style={hasTheme ? { backgroundColor: theme.primary, opacity: 0.3 } : undefined} />

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
