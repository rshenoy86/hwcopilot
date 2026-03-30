import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ChevronRight, ClipboardList, BookOpen } from "lucide-react";
import type { Test, TestSubmission, Child, QuestionResult } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TestResultsPage({ params }: PageProps) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [testResult, submissionResult] = await Promise.all([
    supabase
      .from("tests")
      .select("*, children(*)")
      .eq("id", id)
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("test_submissions")
      .select("*")
      .eq("test_id", id)
      .eq("user_id", user.id)
      .single(),
  ]);

  if (!testResult.data) notFound();
  if (!submissionResult.data) redirect(`/test-prep/${id}`);

  const test = testResult.data as Test & { children: Child };
  const submission = submissionResult.data as TestSubmission;
  const { feedback, practice_exercises } = submission;
  const child = test.children;

  const pct = feedback.percentage;
  const grade = pct >= 90 ? "A" : pct >= 80 ? "B" : pct >= 70 ? "C" : pct >= 60 ? "D" : "F";
  const gradeColor =
    pct >= 80 ? "text-green-600" : pct >= 60 ? "text-yellow-600" : "text-red-500";

  const sectionAResults = feedback.question_results.filter((_, i) => i < 5);
  const sectionBResults = feedback.question_results.filter((_, i) => i >= 5 && i < 9);
  const sectionCResults = feedback.question_results.filter((_, i) => i >= 9);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Score header */}
      <div className="text-center space-y-2 py-6">
        <div className={`text-7xl font-bold ${gradeColor}`}>{grade}</div>
        <p className="text-3xl font-semibold">
          {feedback.score} / {feedback.total_points} points ({pct}%)
        </p>
        <p className="text-muted-foreground">{test.title} · {child.name}</p>
      </div>

      {/* Summary + encouragement */}
      <Card>
        <CardContent className="p-5 space-y-2">
          <p className="text-sm leading-relaxed">{feedback.overall_summary}</p>
          <p className="text-sm font-medium text-primary">{feedback.encouragement}</p>
        </CardContent>
      </Card>

      {/* Strong vs weak areas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {feedback.strong_areas.length > 0 && (
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="p-4">
              <p className="font-semibold text-green-700 mb-2 text-sm">Strong areas ✓</p>
              <ul className="space-y-1">
                {feedback.strong_areas.map((area) => (
                  <li key={area} className="text-sm text-green-800 capitalize">{area}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        {feedback.weak_areas.length > 0 && (
          <Card className="border-orange-200 bg-orange-50/50">
            <CardContent className="p-4">
              <p className="font-semibold text-orange-700 mb-2 text-sm">Needs practice</p>
              <ul className="space-y-1">
                {feedback.weak_areas.map((area) => (
                  <li key={area} className="text-sm text-orange-800 capitalize">{area}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Question-by-question breakdown */}
      <div>
        <h2 className="font-semibold text-lg mb-3">Question Breakdown</h2>
        <div className="space-y-4">
          {[
            { label: "Section A — Multiple Choice", results: sectionAResults },
            { label: "Section B — Short Answer", results: sectionBResults },
            { label: "Section C — Show Your Work", results: sectionCResults },
          ].map(({ label, results }) =>
            results.length > 0 ? (
              <div key={label}>
                <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
                <div className="space-y-2">
                  {results.map((r) => (
                    <QuestionResultRow key={r.number} result={r} />
                  ))}
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>

      {/* Practice exercises */}
      {practice_exercises.length > 0 && (
        <div>
          <h2 className="font-semibold text-lg mb-1">Targeted Practice</h2>
          <p className="text-sm text-muted-foreground mb-3">
            {practice_exercises.length} exercises focused on {child.name}&apos;s weak areas.
          </p>
          <div className="space-y-4">
            {practice_exercises.map((ex) => (
              <Card key={ex.number}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-sm">{ex.number}. {ex.problem}</p>
                    <span className="text-xs text-muted-foreground bg-accent px-2 py-0.5 rounded-full shrink-0 capitalize">
                      {ex.topic}
                    </span>
                  </div>
                  <div className="bg-accent/50 rounded-lg px-3 py-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Hint: </span>{ex.hint}
                  </div>
                  <details className="text-sm">
                    <summary className="cursor-pointer text-primary font-medium hover:opacity-80">
                      Show answer &amp; explanation
                    </summary>
                    <div className="mt-2 space-y-1">
                      <p><span className="font-medium">Answer: </span>{ex.answer}</p>
                      <p className="text-muted-foreground leading-relaxed">{ex.explanation}</p>
                    </div>
                  </details>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pb-8">
        <Link href="/test-prep/new" className="flex-1">
          <Button className="w-full">
            <ClipboardList className="h-4 w-4 mr-1" />
            Generate Another Test
          </Button>
        </Link>
        <Link href="/worksheets/new" className="flex-1">
          <Button variant="outline" className="w-full">
            <BookOpen className="h-4 w-4 mr-1" />
            Create Practice Worksheet
          </Button>
        </Link>
        <Link href="/test-prep">
          <Button variant="ghost" className="w-full sm:w-auto">
            All Tests
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

function QuestionResultRow({ result }: { result: QuestionResult }) {
  return (
    <div className={`flex gap-3 p-3 rounded-lg border text-sm ${result.correct ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"}`}>
      <div className="shrink-0 mt-0.5">
        {result.correct
          ? <CheckCircle className="h-4 w-4 text-green-600" />
          : <XCircle className="h-4 w-4 text-red-500" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium">Q{result.number}</span>
          <span className="text-muted-foreground">
            {result.points_earned}/{result.points_possible} pts
          </span>
          {result.student_answer && (
            <span className="text-muted-foreground">
              · Student wrote: &ldquo;{result.student_answer}&rdquo;
            </span>
          )}
        </div>
        {result.feedback && (
          <p className="text-muted-foreground mt-0.5">{result.feedback}</p>
        )}
      </div>
    </div>
  );
}
