"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSubjectsForGrade, getTopicsForSubjectAndGrade } from "@/lib/curriculum";
import type { Child, Grade } from "@/types";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function NewTestPage() {
  const router = useRouter();
  const [children, setChildren] = useState<Child[]>([]);
  const [profile, setProfile] = useState<{ subscription_status: string; test_prep_used_this_month: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [childId, setChildId] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");

  const selectedChild = children.find((c) => c.id === childId);
  const subjects = selectedChild ? getSubjectsForGrade(selectedChild.grade as Grade) : [];
  const topics = selectedChild && subject ? getTopicsForSubjectAndGrade(selectedChild.grade as Grade, subject) : [];

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const [{ data: profileData }, { data: childrenData }] = await Promise.all([
        supabase.from("profiles").select("subscription_status, test_prep_used_this_month").eq("user_id", user.id).single(),
        supabase.from("children").select("*").eq("user_id", user.id).eq("active", true).order("created_at"),
      ]);

      setProfile(profileData);
      setChildren((childrenData as Child[]) || []);
      if (childrenData && childrenData.length === 1) setChildId(childrenData[0].id);
      setLoading(false);
    }
    load();
  }, [router]);

  const limit = profile?.subscription_status === "pro" ? 10 : 1;
  const isAtLimit = (profile?.test_prep_used_this_month ?? 0) >= limit;

  async function handleGenerate() {
    if (!childId || !subject || !topic) {
      setError("Please fill in all fields.");
      return;
    }
    setError(null);
    setGenerating(true);

    const res = await fetch("/api/tests/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ childId, subject, topic }),
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

  if (children.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <p className="text-muted-foreground mb-4">Add a child profile first before generating a test.</p>
        <Link href="/children"><Button>Add Child</Button></Link>
      </div>
    );
  }

  if (isAtLimit) {
    return (
      <div className="max-w-lg mx-auto">
        <Card className="text-center">
          <CardContent className="py-12 space-y-4">
            <div className="text-4xl">📋</div>
            <h3 className="font-semibold text-lg">
              {profile?.subscription_status === "free"
                ? "You've used your 1 free test prep this month"
                : "You've used all 10 test preps this month"}
            </h3>
            <p className="text-muted-foreground text-sm">
              {profile?.subscription_status === "free"
                ? "Upgrade to Pro for 10 test preps per month, plus 250 worksheets and AI Homework Help."
                : "Your test preps reset at the start of next month."}
            </p>
            {profile?.subscription_status === "free" && (
              <Link href="/billing">
                <Button><Zap className="h-4 w-4 mr-1" />Upgrade to Pro</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Generate a Practice Test</h1>
        <p className="text-muted-foreground mt-1">
          A real test with multiple choice, short answer, and show-your-work questions. Takes about 30 seconds.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-5">
          {/* Child selector */}
          <div className="space-y-1.5">
            <Label>Child</Label>
            <Select value={childId} onValueChange={(v) => { setChildId(v); setSubject(""); setTopic(""); }}>
              <SelectTrigger><SelectValue placeholder="Select a child" /></SelectTrigger>
              <SelectContent>
                {children.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} — {c.grade === "K" ? "Kindergarten" : `Grade ${c.grade}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <Label>Subject</Label>
            <Select
              value={subject}
              onValueChange={(v) => { setSubject(v); setTopic(""); }}
              disabled={!childId}
            >
              <SelectTrigger><SelectValue placeholder={childId ? "Select a subject" : "Select a child first"} /></SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.subject} value={s.subject}>{s.subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Topic */}
          <div className="space-y-1.5">
            <Label>Topic</Label>
            <Select value={topic} onValueChange={setTopic} disabled={!subject}>
              <SelectTrigger><SelectValue placeholder={subject ? "Select a topic" : "Select a subject first"} /></SelectTrigger>
              <SelectContent>
                {topics.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="bg-accent rounded-lg p-3 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">What you&apos;ll get:</p>
            <ul className="space-y-0.5">
              <li>• 5 multiple choice questions (Section A)</li>
              <li>• 4 short answer questions (Section B)</li>
              <li>• 2 show-your-work questions (Section C)</li>
              <li>• 30 points total · Answer key included</li>
            </ul>
          </div>

          <Button
            className="w-full"
            disabled={!childId || !subject || !topic || generating}
            onClick={handleGenerate}
          >
            {generating ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating test...</>
            ) : (
              "Generate Practice Test"
            )}
          </Button>

          {profile?.subscription_status === "free" && (
            <p className="text-center text-xs text-muted-foreground">
              Using 1 of your 1 free test prep this month.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
