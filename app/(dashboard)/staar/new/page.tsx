"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertTriangle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { isStaarGrade } from "@/lib/staar-categories";
import type { Child } from "@/types";

const SUBJECTS = [
  { label: "Math", available: true },
  { label: "ELA / Reading", available: false },
  { label: "Science", available: false },
];

export default function NewStaarPage() {
  const router = useRouter();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [childId, setChildId] = useState("");

  const staarChildren = children.filter((c) => isStaarGrade(c.grade));
  const selectedChild = staarChildren.find((c) => c.id === childId);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: childrenData } = await supabase
        .from("children")
        .select("*")
        .eq("user_id", user.id)
        .eq("active", true)
        .order("created_at");

      const all = (childrenData as Child[]) || [];
      setChildren(all);

      // Pre-select if exactly one STAAR-eligible child
      const eligible = all.filter((c) => isStaarGrade(c.grade));
      if (eligible.length === 1) setChildId(eligible[0].id);

      setLoading(false);
    }
    load();
  }, [router]);

  async function handleStart() {
    if (!childId) return;
    setError(null);
    setGenerating(true);

    const res = await fetch("/api/staar/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ childId }),
    });

    const data = await res.json();
    setGenerating(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong. Please try again.");
      return;
    }

    router.push(`/staar/${data.testId}`);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <p className="text-muted-foreground mb-4">Add a child profile first.</p>
        <Link href="/children"><Button>Add Child</Button></Link>
      </div>
    );
  }

  if (staarChildren.length === 0) {
    return (
      <div className="max-w-lg mx-auto py-12">
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <div className="text-4xl">📚</div>
            <h3 className="font-semibold text-lg">STAAR starts in Grade 3</h3>
            <p className="text-muted-foreground text-sm">
              STAAR assessments are for grades 3–8. Your children are in grades K–2, which don&apos;t take STAAR yet.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full mb-4">
          <AlertTriangle className="h-3.5 w-3.5" />
          STAAR Season 2026
        </div>
        <h1 className="text-2xl font-bold">STAAR Readiness Assessment</h1>
        <p className="text-muted-foreground mt-1">
          12 questions covering all STAAR Math reporting categories. Takes about 10 minutes.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Child selector */}
          <div className="space-y-1.5">
            <Label>Child</Label>
            <Select value={childId} onValueChange={setChildId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a child" />
              </SelectTrigger>
              <SelectContent>
                {staarChildren.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} — Grade {c.grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label>Subject</Label>
            <div className="grid grid-cols-3 gap-2">
              {SUBJECTS.map((s) => (
                <div
                  key={s.label}
                  className={`rounded-lg border px-3 py-2.5 text-sm font-medium text-center transition-colors ${
                    s.available
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-muted/40 text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {s.label}
                  {!s.available && (
                    <div className="text-xs font-normal mt-0.5 text-muted-foreground">
                      Coming soon
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* What to expect */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
            <p className="font-medium">What this assessment covers:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Numerical Representations &amp; Relationships (3 questions)</li>
              <li>• Computations &amp; Algebraic Reasoning (3 questions)</li>
              <li>• Geometry &amp; Measurement (3 questions)</li>
              <li>• Data Analysis &amp; Financial Literacy (3 questions)</li>
            </ul>
            <p className="text-xs text-muted-foreground pt-1">
              Aligned to {selectedChild ? `Grade ${selectedChild.grade}` : "your child&apos;s grade"} Texas TEKS standards.
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            className="w-full"
            size="lg"
            disabled={!childId || generating}
            onClick={handleStart}
          >
            {generating ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating assessment...</>
            ) : (
              <>Start STAAR Readiness Check <ChevronRight className="h-4 w-4 ml-1" /></>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            This does not count against your monthly test prep limit.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
