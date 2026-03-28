"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { completeOnboarding } from "@/app/actions/profile";
import { getSubjectsForGrade } from "@/lib/curriculum";
import type { Grade } from "@/types";
import Mascot from "@/components/mascot";

const GRADES: { value: Grade; label: string }[] = [
  { value: "K", label: "Kindergarten" },
  { value: "1", label: "1st Grade" },
  { value: "2", label: "2nd Grade" },
  { value: "3", label: "3rd Grade" },
  { value: "4", label: "4th Grade" },
  { value: "5", label: "5th Grade" },
  { value: "6", label: "6th Grade" },
  { value: "7", label: "7th Grade" },
  { value: "8", label: "8th Grade" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [childName, setChildName] = useState("");
  const [childGrade, setChildGrade] = useState<Grade | "">("");
  const [childSubjects, setChildSubjects] = useState<string[]>([]);
  const [childInterests, setChildInterests] = useState("");
  const [childLearningNotes, setChildLearningNotes] = useState("");

  const availableSubjects = childGrade ? getSubjectsForGrade(childGrade as Grade) : [];

  function toggleSubject(subject: string) {
    setChildSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  }

  async function handleFinish() {
    if (!firstName || !childName || !childGrade || childSubjects.length === 0 || !childInterests) {
      setError("Please fill in all required fields");
      return;
    }
    setError(null);
    setLoading(true);
    const result = await completeOnboarding({
      firstName,
      childName,
      childGrade,
      childSubjects,
      childInterests,
      childLearningNotes: childLearningNotes || undefined,
    });
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 text-3xl font-bold text-primary"><Mascot size={52} />GuruBuddy</span>
          <div className="mt-4 flex justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-8 rounded-full transition-colors ${
                  s <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Step {step} of 3</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          {/* Step 1: Parent name */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold">Hi there! What&apos;s your name?</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  We&apos;ll use this to personalize your experience.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="firstName">Your first name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Sarah"
                  autoFocus
                />
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  if (!firstName.trim()) {
                    setError("Please enter your first name");
                    return;
                  }
                  setError(null);
                  setStep(2);
                }}
              >
                Continue
              </Button>
              {error && <p className="text-sm text-destructive text-center">{error}</p>}
            </div>
          )}

          {/* Step 2: Child info */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold">Tell us about your child</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  This helps us create worksheets that are just right for them.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="childName">Child&apos;s name</Label>
                <Input
                  id="childName"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="e.g. Emma"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Grade</Label>
                <Select
                  value={childGrade}
                  onValueChange={(v) => {
                    setChildGrade(v as Grade);
                    setChildSubjects([]);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADES.map((g) => (
                      <SelectItem key={g.value} value={g.value}>
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {childGrade && (
                <div className="space-y-2">
                  <Label>Subjects (select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableSubjects.map((s) => (
                      <label
                        key={s.subject}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                          childSubjects.includes(s.subject)
                            ? "border-primary bg-accent"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Checkbox
                          checked={childSubjects.includes(s.subject)}
                          onCheckedChange={() => toggleSubject(s.subject)}
                        />
                        <span className="text-sm font-medium">{s.subject}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="interests">What does {childName || "your child"} love?</Label>
                <Textarea
                  id="interests"
                  value={childInterests}
                  onChange={(e) => setChildInterests(e.target.value)}
                  placeholder="e.g. dinosaurs, soccer, Minecraft, cats, space exploration..."
                  rows={2}
                />
                <p className="text-xs text-muted-foreground">
                  We&apos;ll weave these into worksheet problems to make them more engaging!
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="learningNotes">
                  Any learning notes?{" "}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Textarea
                  id="learningNotes"
                  value={childLearningNotes}
                  onChange={(e) => setChildLearningNotes(e.target.value)}
                  placeholder="e.g. struggles with fractions, advanced reader, dyslexia..."
                  rows={2}
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    if (!childName || !childGrade || childSubjects.length === 0 || !childInterests) {
                      setError("Please fill in all required fields");
                      return;
                    }
                    setError(null);
                    setStep(3);
                  }}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Done */}
          {step === 3 && (
            <div className="space-y-6 text-center">
              <div className="text-5xl">🎉</div>
              <div>
                <h2 className="text-xl font-bold">You&apos;re all set, {firstName}!</h2>
                <p className="mt-2 text-muted-foreground">
                  {childName}&apos;s profile is ready. Let&apos;s create your first worksheet — it only takes 30 seconds.
                </p>
              </div>

              <div className="bg-accent rounded-xl p-4 text-left space-y-2">
                <p className="font-medium text-sm">Your free plan includes:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ 5 worksheets per month</li>
                  <li>✓ All subjects and grade levels</li>
                  <li>✓ Personalized to {childName}&apos;s interests</li>
                  <li>✓ Print-ready format</li>
                </ul>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button
                className="w-full"
                size="lg"
                onClick={handleFinish}
                disabled={loading}
              >
                {loading ? "Setting up your account..." : "Go to my dashboard"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
