"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertTriangle, ChevronRight, FileText } from "lucide-react";
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
import {
  isStaarGrade,
  worksheetTotalQuestions,
  STAAR_MATH_CATEGORIES,
} from "@/lib/staar-categories";
import type { Child } from "@/types";

export default function NewStaarWorksheetPage() {
  const router = useRouter();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [childId, setChildId] = useState("");

  const staarChildren = children.filter((c) => isStaarGrade(c.grade));
  const selectedChild = staarChildren.find((c) => c.id === childId);
  const totalQ = selectedChild
    ? worksheetTotalQuestions(selectedChild.grade)
    : 36;
  const perCategory = selectedChild
    ? totalQ / STAAR_MATH_CATEGORIES.length
    : 9;

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: childrenData } = await supabase
        .from("children")
        .select("*")
        .eq("user_id", user.id)
        .eq("active", true)
        .order("created_at");

      const all = (childrenData as Child[]) || [];
      setChildren(all);

      const eligible = all.filter((c) => isStaarGrade(c.grade));
      if (eligible.length === 1) setChildId(eligible[0].id);

      setLoading(false);
    }
    load();
  }, [router]);

  async function handleGenerate() {
    if (!childId) return;
    setError(null);
    setGenerating(true);

    const res = await fetch("/api/staar/worksheet/generate", {
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

    router.push(`/staar/worksheet/${data.testId}`);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
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
              Add a child in grades 3–8 to generate a worksheet.
            </p>
            <Link href="/children">
              <Button className="mt-2" size="sm">
                Add Child
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full mb-4">
          <AlertTriangle className="h-3.5 w-3.5" />
          STAAR Season 2026
        </div>
        <h1 className="text-2xl font-bold">STAAR Full Test Worksheet</h1>
        <p className="text-muted-foreground mt-1">
          A full-length STAAR Math practice test with an answer key — ready to
          print.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
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

          <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
            <p className="font-medium">
              What&apos;s included ({totalQ} questions total):
            </p>
            <ul className="space-y-1 text-muted-foreground">
              {STAAR_MATH_CATEGORIES.map((c) => (
                <li key={c.name}>
                  • {c.name} ({perCategory} questions)
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground pt-1">
              Aligned to{" "}
              {selectedChild
                ? `Grade ${selectedChild.grade}`
                : "your child&apos;s grade"}{" "}
              Texas TEKS standards. All multiple choice (A–D).
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <FileText className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-900">Printable with answer key</p>
              <p className="text-blue-700 mt-0.5">
                After generating, print the worksheet for your child and the
                answer key separately.
              </p>
            </div>
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
            onClick={handleGenerate}
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating worksheet… (this takes ~30 seconds)
              </>
            ) : (
              <>
                Generate Full Test Worksheet{" "}
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
