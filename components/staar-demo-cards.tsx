"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, BookOpen, CheckCircle, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SKILLS = [
  { skill: "Fractions & Decimals", pct: 38, color: "bg-red-500", label: "Below grade level", gap: true },
  { skill: "Geometry & Measurement", pct: 61, color: "bg-amber-400", label: "Approaching", gap: true },
  { skill: "Place Value", pct: 88, color: "bg-emerald-500", label: "On track", gap: false },
  { skill: "Data & Graphs", pct: 70, color: "bg-amber-400", label: "Approaching", gap: false },
];

const WORKPLAN = [
  {
    week: "Week 1",
    topic: "Fractions Basics",
    detail: "Comparing, ordering, equivalents",
    worksheets: 3,
    done: false,
  },
  {
    week: "Week 2",
    topic: "Fractions in Word Problems",
    detail: "Real-world application, STAAR format",
    worksheets: 3,
    done: false,
  },
  {
    week: "Week 3",
    topic: "Mixed Review + Decimals",
    detail: "Full practice test + targeted drill",
    worksheets: 2,
    done: false,
  },
];

export function STAARDemoCards() {
  const [step, setStep] = useState<0 | 1>(0);
  const [animating, setAnimating] = useState(false);
  const [bars, setBars] = useState(false);

  // Animate bars in on mount
  useEffect(() => {
    const t = setTimeout(() => setBars(true), 300);
    return () => clearTimeout(t);
  }, []);

  // Auto-advance from gap → plan after 3.5s, then loop back after 4s
  useEffect(() => {
    const advance = setTimeout(() => {
      setAnimating(true);
      setTimeout(() => {
        setStep((s) => (s === 0 ? 1 : 0));
        setAnimating(false);
      }, 400);
    }, step === 0 ? 3500 : 4500);
    return () => clearTimeout(advance);
  }, [step]);

  return (
    <div className="w-full">

      {/* Mobile: animated single card */}
      <div className="lg:hidden flex flex-col items-center gap-2 max-w-sm mx-auto">
        {/* Step indicator pills */}
        <div className="flex gap-2 mb-1">
          {[0, 1].map((i) => (
            <button
              key={i}
              onClick={() => setStep(i as 0 | 1)}
              className={`h-1.5 rounded-full transition-all duration-300 ${step === i ? "w-6 bg-amber-400" : "w-3 bg-white/20"}`}
            />
          ))}
        </div>
        <div
          className={`w-full ${animating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}
          style={{ transition: "opacity 0.35s ease, transform 0.35s ease" }}
        >
          {step === 0 ? <GapCard bars={bars} /> : <WorkplanCard />}
        </div>
      </div>

      {/* Desktop: both cards side by side with arrow */}
      <div className="hidden lg:flex items-stretch gap-4 w-full">
        <div className="flex-1"><GapCard bars={bars} /></div>
        <div className="flex items-center shrink-0">
          <div className="flex flex-col items-center gap-1.5">
            <div className="h-8 w-8 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center">
              <ArrowRight className="h-4 w-4 text-amber-400" />
            </div>
            <span className="text-[10px] text-slate-400 font-medium text-center leading-tight">then<br/>GuruBuddy<br/>builds</span>
          </div>
        </div>
        <div className="flex-1"><WorkplanCard /></div>
      </div>

    </div>
  );
}

function GapCard({ bars }: { bars: boolean }) {
  const worstSkill = SKILLS[0];

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-5 text-slate-900 lg:h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600 shrink-0">
          E
        </div>
        <div className="min-w-0">
          <p className="font-bold text-sm">Emma · 4th Grade</p>
          <p className="text-xs text-slate-500">STAAR Math Readiness</p>
        </div>
        <div className="ml-auto shrink-0">
          <span className="text-xs font-semibold bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            3 gaps
          </span>
        </div>
      </div>

      {/* Critical gap callout */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
        <p className="text-xs font-semibold text-red-800 mb-0.5">Critical gap detected</p>
        <p className="text-sm font-bold text-red-900">Fractions &amp; Decimals</p>
        <p className="text-xs text-red-600 mt-0.5">Emma is scoring below grade level — likely to miss these STAAR questions</p>
      </div>

      {/* All skills */}
      <div className="space-y-3 flex-1">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Skill Mastery</p>
        {SKILLS.map((s) => (
          <div key={s.skill}>
            <div className="flex justify-between text-xs mb-1">
              <span className={`font-medium ${s.gap ? "text-slate-800" : "text-slate-400"}`}>{s.skill}</span>
              <span className={s.gap ? "text-slate-600 font-semibold" : "text-slate-300"}>{s.pct}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${s.color} rounded-full transition-all duration-700 ease-out ${s.gap ? "" : "opacity-40"}`}
                style={{ width: bars ? `${s.pct}%` : "0%" }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-[10px] text-slate-300 mt-4">Step 1 of 2 · Gap identified</p>
    </div>
  );
}

function WorkplanCard() {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-5 text-slate-900 lg:h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-sm">Emma&apos;s Recovery Plan</p>
          <p className="text-xs text-slate-500">Personalized · 4th Grade · 3 weeks</p>
        </div>
        <div className="ml-auto shrink-0">
          <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
            STAAR-ready
          </span>
        </div>
      </div>

      {/* Weekly plan */}
      <div className="space-y-3 flex-1">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Targeted Worksheet Plan</p>
        {WORKPLAN.map((w, i) => (
          <div key={w.week} className="flex gap-3 items-start">
            <div className="flex flex-col items-center shrink-0 pt-0.5">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? "bg-red-100 text-red-700" : "bg-indigo-100 text-indigo-700"}`}>
                {i + 1}
              </div>
              {i < WORKPLAN.length - 1 && <div className="w-px h-4 bg-slate-100 mt-1" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-slate-700">{w.week}: {w.topic}</p>
                <span className="text-[10px] text-slate-400 shrink-0">{w.worksheets} sheets</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">{w.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link href="/signup" className="block mt-4">
        <button className="w-full bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold text-sm py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1.5">
          Get Emma&apos;s Full Plan
          <ChevronRight className="h-4 w-4" />
        </button>
      </Link>

      <p className="text-center text-[10px] text-slate-300 mt-3">Step 2 of 2 · Plan ready in seconds</p>
    </div>
  );
}
