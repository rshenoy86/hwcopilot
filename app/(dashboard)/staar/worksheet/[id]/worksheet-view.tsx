"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Printer, KeyRound, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TestVisualRenderer } from "@/components/tests/visuals";
import { STAAR_MATH_CATEGORIES } from "@/lib/staar-categories";
import type { Test, Child, TestQuestion } from "@/types";

interface Props {
  test: Test & { children: Child };
  childName: string;
}

const OPTION_LETTERS = ["A", "B", "C", "D"];

function QuestionItem({
  q,
  showAnswer,
  index,
}: {
  q: TestQuestion;
  showAnswer: boolean;
  index: number;
}) {
  return (
    <div className="question-item mb-5 break-inside-avoid">
      <div className="flex gap-3">
        <span className="font-bold text-sm w-7 shrink-0 pt-0.5">{index}.</span>
        <div className="flex-1 min-w-0">
          {q.visual && (
            <div className="mb-2">
              <TestVisualRenderer visual={q.visual} />
            </div>
          )}
          <p className="text-sm leading-relaxed mb-2.5">{q.question}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {q.options?.map((opt, oi) => {
              const letter = OPTION_LETTERS[oi];
              const isCorrect = showAnswer && letter === q.correct_answer;
              return (
                <div
                  key={oi}
                  className={`flex items-center gap-2 text-sm px-2 py-1 rounded ${
                    isCorrect
                      ? "bg-emerald-50 border border-emerald-300 font-semibold text-emerald-800"
                      : ""
                  }`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-5 h-5 rounded-full border text-xs font-bold shrink-0 ${
                      isCorrect
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-gray-400"
                    }`}
                  >
                    {letter}
                  </span>
                  <span>{opt.replace(/^[A-D]\.\s*/, "")}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorksheetView({ test, childName }: Props) {
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  const questions = test.questions as TestQuestion[];
  const totalQ = questions.length;
  const perCategory = Math.floor(totalQ / STAAR_MATH_CATEGORIES.length);

  const sections = STAAR_MATH_CATEGORIES.map((cat, i) => ({
    category: cat,
    questions: questions.slice(i * perCategory, (i + 1) * perCategory),
    startNum: i * perCategory + 1,
  }));

  function printWorksheet() {
    const style = document.createElement("style");
    style.id = "__ws_print";
    style.textContent = `
      @media print {
        body * { visibility: hidden; }
        #ws-worksheet, #ws-worksheet * { visibility: visible; }
        #ws-worksheet {
          position: absolute; left: 0; top: 0;
          width: 100%; padding: 24px; box-sizing: border-box;
          border: none !important; box-shadow: none !important;
        }
        .no-print { display: none !important; }
        .question-item { page-break-inside: avoid; }
      }
    `;
    document.head.appendChild(style);
    window.print();
    document.getElementById("__ws_print")?.remove();
  }

  function printAnswerKey() {
    const style = document.createElement("style");
    style.id = "__ak_print";
    style.textContent = `
      @media print {
        body * { visibility: hidden; }
        #ws-answer-key {
          display: block !important;
          visibility: visible;
          position: absolute; left: 0; top: 0;
          width: 100%; padding: 24px; box-sizing: border-box;
        }
        #ws-answer-key * { visibility: visible; }
        .no-print { display: none !important; }
      }
    `;
    document.head.appendChild(style);
    window.print();
    document.getElementById("__ak_print")?.remove();
  }

  return (
    <div id="ws-print-root" className="max-w-3xl mx-auto space-y-6">
      {/* Controls — hidden when printing */}
      <div className="no-print flex items-center justify-between">
        <Link href="/staar">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            STAAR Prep
          </Button>
        </Link>
        <div className="flex flex-wrap gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAnswerKey((v) => !v)}
          >
            {showAnswerKey ? (
              <>
                <EyeOff className="h-4 w-4 mr-1.5" />
                Hide Answers
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-1.5" />
                Show Answers
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={printAnswerKey}>
            <KeyRound className="h-4 w-4 mr-1.5" />
            Print Answer Key
          </Button>
          <Button size="sm" onClick={printWorksheet}>
            <Printer className="h-4 w-4 mr-1.5" />
            Print Worksheet
          </Button>
        </div>
      </div>

      {/* ── WORKSHEET ── */}
      <div
        id="ws-worksheet"
        className="bg-white border border-border rounded-xl p-8 space-y-8"
      >
        {/* Header */}
        <div className="border-b border-black pb-4 space-y-4">
          <div className="text-center space-y-0.5">
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-500">
              State of Texas Assessments of Academic Readiness
            </p>
            <h1 className="text-xl font-bold">
              Grade {test.grade} Mathematics — Full Practice Test
            </h1>
            <p className="text-sm text-gray-500">
              {totalQ} questions · All multiple choice (A–D)
            </p>
          </div>
          <div className="grid grid-cols-3 gap-x-6 gap-y-2 text-sm">
            <div className="flex items-end gap-1">
              <span className="font-medium whitespace-nowrap">Name:</span>
              <span className="border-b border-black flex-1 min-w-0 pb-0.5 truncate">
                {childName}
              </span>
            </div>
            <div className="flex items-end gap-1">
              <span className="font-medium whitespace-nowrap">Date:</span>
              <span className="border-b border-black flex-1 pb-0.5" />
            </div>
            <div className="flex items-end gap-1">
              <span className="font-medium whitespace-nowrap">Score:</span>
              <span className="border-b border-black flex-1 pb-0.5" />
              <span>/ {totalQ}</span>
            </div>
          </div>
        </div>

        {/* Directions */}
        <div className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
          <span className="font-semibold">Directions: </span>
          Read each question carefully and choose the best answer. Circle or
          write the letter of your answer. You may use scratch paper to work
          problems.
        </div>

        {/* Questions by reporting category */}
        {sections.map(({ category, questions: qs, startNum }) => (
          <div key={category.name}>
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b pb-1.5 mb-4">
              Reporting Category: {category.name}
            </h2>
            <div>
              {qs.map((q, qi) => (
                <QuestionItem
                  key={q.number ?? startNum + qi}
                  q={q}
                  showAnswer={showAnswerKey}
                  index={startNum + qi}
                />
              ))}
            </div>
          </div>
        ))}

        <div className="text-center text-sm text-gray-400 border-t pt-4">
          — End of Test —
        </div>
      </div>

      {/* ── ANSWER KEY (screen toggle) ── */}
      {showAnswerKey && (
        <div className="no-print bg-white border border-border rounded-xl p-8 space-y-6">
          <div className="border-b pb-3 flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-muted-foreground" />
            <div>
              <h2 className="font-bold text-lg">Answer Key</h2>
              <p className="text-sm text-muted-foreground">
                Grade {test.grade} STAAR Math Practice Test
              </p>
            </div>
          </div>
          {sections.map(({ category, questions: qs, startNum }) => (
            <div key={category.name}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                {category.name}
              </h3>
              <div className="grid grid-cols-6 sm:grid-cols-9 gap-3">
                {qs.map((q, qi) => (
                  <div key={q.number ?? startNum + qi} className="text-center">
                    <div className="text-xs text-gray-400 mb-0.5">
                      {startNum + qi}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center font-bold text-emerald-800 text-sm mx-auto">
                      {q.correct_answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── ANSWER KEY (print-only version, always in DOM) ── */}
      <div
        id="ws-answer-key"
        className="hidden bg-white p-8 space-y-6"
        style={{ display: "none" }}
      >
        <div className="border-b pb-3">
          <h2 className="text-lg font-bold">Answer Key</h2>
          <p className="text-sm text-gray-500">
            Grade {test.grade} STAAR Mathematics Practice Test · {totalQ}{" "}
            questions
          </p>
        </div>
        {sections.map(({ category, questions: qs, startNum }) => (
          <div key={category.name}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              {category.name}
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(9, minmax(0, 1fr))",
                gap: "12px",
              }}
            >
              {qs.map((q, qi) => (
                <div
                  key={q.number ?? startNum + qi}
                  style={{ textAlign: "center" }}
                >
                  <div style={{ fontSize: "11px", color: "#9ca3af" }}>
                    {startNum + qi}
                  </div>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      border: "1.5px solid #6ee7b7",
                      backgroundColor: "#d1fae5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "13px",
                      color: "#065f46",
                      margin: "2px auto 0",
                    }}
                  >
                    {q.correct_answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
