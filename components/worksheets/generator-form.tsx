"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSubjectsForGrade, getTopicsForSubjectAndGrade } from "@/lib/curriculum";
import type { Child, SubscriptionStatus } from "@/types";

interface GeneratorFormProps {
  children: Child[];
  preselectedChildId?: string;
  isAtLimit: boolean;
  subscriptionStatus: SubscriptionStatus;
}

const DIFFICULTY_OPTIONS = [
  { value: "1", label: "Easy Review", description: "Scaffolded, review of earlier concepts" },
  { value: "2", label: "Standard", description: "On-grade level practice" },
  { value: "3", label: "Challenge", description: "Stretch problems above grade level" },
];

const QUESTION_COUNTS = [6, 8, 10];

export default function WorksheetGeneratorForm({
  children,
  preselectedChildId,
  isAtLimit,
  subscriptionStatus,
}: GeneratorFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedChildId, setSelectedChildId] = useState(preselectedChildId || children[0]?.id || "");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<"1" | "2" | "3">("2");
  const [numQuestions, setNumQuestions] = useState<6 | 8 | 10>(8);
  const [specialInstructions, setSpecialInstructions] = useState("");

  const selectedChild = children.find((c) => c.id === selectedChildId);
  const availableSubjects = selectedChild ? getSubjectsForGrade(selectedChild.grade) : [];
  const availableTopics = selectedChild && subject ? getTopicsForSubjectAndGrade(selectedChild.grade, subject) : [];

  function handleChildChange(childId: string) {
    setSelectedChildId(childId);
    setSubject("");
    setTopic("");
  }

  function handleSubjectChange(s: string) {
    setSubject(s);
    setTopic("");
  }

  async function handleGenerate() {
    if (!selectedChildId || !subject || !topic) {
      setError("Please fill in all required fields");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/worksheets/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId: selectedChildId,
          subject,
          topic,
          difficulty: parseInt(difficulty) as 1 | 2 | 3,
          numQuestions,
          specialInstructions: specialInstructions || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to generate worksheet. Please try again.");
        setLoading(false);
        return;
      }

      router.push(`/worksheets/${data.worksheetId}`);
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  if (isAtLimit) {
    return (
      <Card className="border-primary/20">
        <CardContent className="py-12 text-center space-y-4">
          <div className="text-4xl">📋</div>
          <div>
            <h3 className="font-semibold text-lg">Monthly limit reached</h3>
            <p className="text-muted-foreground mt-1">
              {subscriptionStatus === "free"
                ? "You've used all 5 free worksheets this month."
                : "You've used all 250 worksheets this month."}
            </p>
          </div>
          {subscriptionStatus === "free" ? (
            <Link href="/billing">
              <Button>
                <Zap className="h-4 w-4 mr-1" />
                Upgrade to Pro — 250 worksheets/month
              </Button>
            </Link>
          ) : (
            <p className="text-sm text-muted-foreground">
              Your worksheets will reset at the start of next month.
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-5">
        {/* Child selection */}
        <div className="space-y-1.5">
          <Label>Child</Label>
          <Select value={selectedChildId} onValueChange={handleChildChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a child" />
            </SelectTrigger>
            <SelectContent>
              {children.map((child) => (
                <SelectItem key={child.id} value={child.id}>
                  {child.name} — {child.grade === "K" ? "Kindergarten" : `Grade ${child.grade}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedChild && (
            <p className="text-xs text-muted-foreground">
              Interests: {selectedChild.interests}
            </p>
          )}
        </div>

        {/* Subject */}
        <div className="space-y-1.5">
          <Label>Subject</Label>
          <Select value={subject} onValueChange={handleSubjectChange} disabled={!selectedChild}>
            <SelectTrigger>
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {availableSubjects.map((s) => (
                <SelectItem key={s.subject} value={s.subject}>
                  {s.subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Topic */}
        <div className="space-y-1.5">
          <Label>Topic</Label>
          <Select value={topic} onValueChange={setTopic} disabled={!subject}>
            <SelectTrigger>
              <SelectValue placeholder="Select a topic" />
            </SelectTrigger>
            <SelectContent>
              {availableTopics.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Difficulty */}
        <div className="space-y-2">
          <Label>Difficulty</Label>
          <div className="grid grid-cols-3 gap-2">
            {DIFFICULTY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setDifficulty(opt.value as "1" | "2" | "3")}
                className={`p-3 rounded-lg border text-left transition-all ${
                  difficulty === opt.value
                    ? "border-primary bg-accent ring-1 ring-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-sm font-medium">{opt.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5 leading-tight">
                  {opt.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Number of questions */}
        <div className="space-y-2">
          <Label>Number of questions</Label>
          <div className="flex gap-2">
            {QUESTION_COUNTS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setNumQuestions(n as 6 | 8 | 10)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                  numQuestions === n
                    ? "border-primary bg-accent ring-1 ring-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Special instructions */}
        <div className="space-y-1.5">
          <Label>
            Special instructions{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="e.g. Focus on borrowing in subtraction, include more word problems..."
            rows={2}
          />
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
            {error}
            {error.includes("limit") && subscriptionStatus === "free" && (
              <Link href="/billing" className="ml-1 underline font-medium">
                Upgrade to Pro
              </Link>
            )}
          </div>
        )}

        <Button
          className="w-full"
          size="lg"
          onClick={handleGenerate}
          disabled={loading || !subject || !topic}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating your worksheet...
            </>
          ) : (
            "Generate Worksheet"
          )}
        </Button>

        {loading && (
          <p className="text-xs text-center text-muted-foreground">
            This takes about 10-20 seconds. We&apos;re crafting something great!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
