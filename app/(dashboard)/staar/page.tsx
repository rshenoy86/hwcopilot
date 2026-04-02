import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  ClipboardList,
  Plus,
  ArrowRight,
  Zap,
  TrendingUp,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import {
  STAAR_TOPIC,
  STAAR_PRACTICE_TOPIC,
  isStaarGrade,
  getMastery,
  type StaarGapReport,
} from "@/lib/staar-categories";
import type { Test, Profile, Child } from "@/types";

const PRO_LIMIT = 10;
const FREE_LIMIT = 1;

type StaarTest = Test & { children: { name: string; id: string } };

export default async function StaarHubPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profileResult, testsResult, childrenResult, submissionsResult] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).single(),
      supabase
        .from("tests")
        .select("*, children(name, id)")
        .eq("user_id", user.id)
        .in("topic", [STAAR_TOPIC, STAAR_PRACTICE_TOPIC])
        .order("created_at", { ascending: false }),
      supabase
        .from("children")
        .select("*")
        .eq("user_id", user.id)
        .eq("active", true),
      supabase
        .from("test_submissions")
        .select("test_id, feedback")
        .eq("user_id", user.id),
    ]);

  const profile = profileResult.data as Profile | null;
  if (!profile) redirect("/onboarding");

  const allTests = (testsResult.data as StaarTest[]) || [];
  const children = (childrenResult.data as Child[]) || [];
  const submissions = submissionsResult.data || [];

  const isPro = profile.subscription_status === "pro";
  const limit = isPro ? PRO_LIMIT : FREE_LIMIT;
  const used = profile.test_prep_used_this_month ?? 0;
  const isAtLimit = used >= limit;

  // Split by type
  const practiceTests = allTests.filter((t) => t.topic === STAAR_PRACTICE_TOPIC);
  const assessments = allTests.filter((t) => t.topic === STAAR_TOPIC);

  // Build submission map for scores
  const submissionMap = new Map(submissions.map((s) => [s.test_id, s.feedback]));

  // Progress: average pct across graded assessments
  const gradedAssessments = assessments.filter((t) => t.status === "graded");
  const avgPct =
    gradedAssessments.length > 0
      ? Math.round(
          gradedAssessments.reduce((sum, t) => {
            const fb = submissionMap.get(t.id) as StaarGapReport | undefined;
            return sum + (fb?.overall_pct ?? 0);
          }, 0) / gradedAssessments.length
        )
      : null;

  const hasStaarChildren = children.some((c) => isStaarGrade(c.grade));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold">STAAR Prep</h1>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              2025 Season
            </span>
          </div>
          <p className="text-muted-foreground">
            Diagnostic assessments and practice tests for STAAR Math.
          </p>
        </div>
        {hasStaarChildren && isPro && !isAtLimit && (
          <Link href="/staar/practice/new">
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              Practice Test
            </Button>
          </Link>
        )}
        {hasStaarChildren && isPro && isAtLimit && (
          <Link href="/billing">
            <Button variant="outline">
              <Zap className="h-4 w-4 mr-1" />
              Upgrade for More
            </Button>
          </Link>
        )}
      </div>

      {/* No STAAR-eligible children */}
      {!hasStaarChildren && (
        <Card>
          <CardContent className="py-10 text-center space-y-2">
            <div className="text-3xl">📚</div>
            <p className="font-semibold">STAAR starts in Grade 3</p>
            <p className="text-sm text-muted-foreground">
              Add a child in grades 3–8 to get started.
            </p>
            <Link href="/children">
              <Button className="mt-2" size="sm">Add Child</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {hasStaarChildren && (
        <>
          {/* Progress summary */}
          {avgPct !== null && (
            <Card className="border-indigo-100 bg-gradient-to-r from-indigo-50 to-slate-50">
              <CardContent className="p-5 flex items-center gap-5">
                <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground mb-1.5">
                    Average readiness score — {gradedAssessments.length} assessment
                    {gradedAssessments.length !== 1 ? "s" : ""}
                  </p>
                  <div className="flex items-center gap-3">
                    <Progress value={avgPct} className="flex-1" />
                    <span className={`text-lg font-bold ${getMastery(avgPct).textColor}`}>
                      {avgPct}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Usage + action cards for Pro */}
          {isPro && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-sm">
                    {used} of {limit} STAAR practice tests used this month
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Resets at the start of next month.
                  </p>
                </div>
                <span className="text-sm font-bold text-primary">
                  {limit - used} left
                </span>
              </CardContent>
            </Card>
          )}

          {/* Empty state — first time */}
          {allTests.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/staar/new">
                <Card className="hover:border-amber-300 hover:shadow-md transition-all cursor-pointer h-full">
                  <CardContent className="p-6 space-y-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <Target className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold">STAAR Readiness Check</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        12-question diagnostic across all reporting categories. Find the gaps before STAAR.
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">~10 minutes · Free</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href={isPro ? "/staar/practice/new" : "/billing"}>
                <Card className={`hover:shadow-md transition-all cursor-pointer h-full ${!isPro ? "opacity-70" : "hover:border-primary/50"}`}>
                  <CardContent className="p-6 space-y-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <ClipboardList className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">STAAR Practice Test</p>
                        {!isPro && <Badge variant="secondary" className="text-xs">Pro</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Full graded practice test. Multiple choice, short answer, and show-your-work.
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">~20 minutes · Graded with feedback</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          )}

          {/* Test history */}
          {allTests.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Activity</h2>
                <Link href="/staar/new">
                  <Button variant="outline" size="sm">
                    <Target className="h-3.5 w-3.5 mr-1" />
                    Readiness Check
                  </Button>
                </Link>
              </div>

              <div className="space-y-2">
                {allTests.map((t) => {
                  const isAssessment = t.topic === STAAR_TOPIC;
                  const fb = submissionMap.get(t.id) as StaarGapReport | undefined;
                  const pct = fb?.overall_pct;
                  const mastery = pct !== undefined ? getMastery(pct) : null;
                  const href = isAssessment
                    ? `/staar/${t.id}${t.status === "graded" ? "/results" : ""}`
                    : `/test-prep/${t.id}${t.status === "graded" ? "/results" : ""}`;

                  return (
                    <Link key={t.id} href={href}>
                      <div className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-accent/50 transition-all bg-card">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${isAssessment ? "bg-amber-50" : "bg-primary/10"}`}>
                            {isAssessment
                              ? <Target className="h-5 w-5 text-amber-600" />
                              : <ClipboardList className="h-5 w-5 text-primary" />
                            }
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-sm">
                                {t.children?.name} —{" "}
                                {isAssessment ? "Readiness Check" : "Practice Test"}
                              </p>
                              <Badge variant={t.status === "graded" ? "success" : "warning"}>
                                {t.status === "graded" ? "Graded" : "In Progress"}
                              </Badge>
                              {mastery && pct !== undefined && (
                                <span className={`text-xs font-semibold ${mastery.textColor}`}>
                                  {pct}%
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Grade {t.grade} · {formatDate(t.created_at)}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upgrade CTA for free users */}
          {!isPro && allTests.length > 0 && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-sm">Unlock STAAR Practice Tests</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Full graded practice tests with feedback and progress tracking.
                  </p>
                </div>
                <Link href="/billing">
                  <Button size="sm">
                    <Zap className="h-3.5 w-3.5 mr-1" />
                    Upgrade
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
