"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { isStaarGrade, STAAR_PRACTICE_TOPIC } from "@/lib/staar-categories";
import type { Child } from "@/types";

export default function NewStaarPracticePage() {
  const router = useRouter();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [childId, setChildId] = useState("");

  const staarChildren = children.filter((c) => isStaarGrade(c.grade));

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data } = await supabase
        .from("children")
        .select("*")
        .eq("user_id", user.id)
        .eq("active", true)
        .order("created_at");

      const all = (data as Child[]) || [];
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

    const res = await fetch("/api/tests/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ childId, subject: "Math", topic: STAAR_PRACTICE_TOPIC }),
    });

    const data = await res.json();
    setGenerating(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong. Please try again.");
      return;
    }

    router.push(`/test-prep/${data.testId}`);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/staar" className="text-sm text-muted-foreground hover:text-foreground">
          ← STAAR Prep
        </Link>
        <h1 className="text-2xl font-bold mt-3">Generate STAAR Practice Test</h1>
        <p className="text-muted-foreground mt-1">
          A full practice test covering all STAAR Math reporting categories.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-5">
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

          <div className="bg-slate-50 rounded-xl p-4 text-sm space-y-1.5">
            <p className="font-medium">What you&apos;ll get:</p>
            <ul className="space-y-0.5 text-muted-foreground">
              <li>• 5 multiple choice questions (Section A)</li>
              <li>• 4 short answer questions (Section B)</li>
              <li>• 2 show-your-work questions (Section C)</li>
              <li>• Instant AI grading with feedback</li>
              <li>• Covers all 4 STAAR Math reporting categories</li>
            </ul>
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
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating...</>
            ) : (
              <>Generate Practice Test <ChevronRight className="h-4 w-4 ml-1" /></>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
