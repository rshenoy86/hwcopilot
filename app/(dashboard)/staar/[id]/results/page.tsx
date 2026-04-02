import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronRight, Zap } from "lucide-react";
import { STAAR_TOPIC, getMastery, type StaarGapReport } from "@/lib/staar-categories";
import type { Child } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StaarResultsPage({ params }: PageProps) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [testResult, submissionResult, profileResult] = await Promise.all([
    supabase
      .from("tests")
      .select("*, children(*)")
      .eq("id", id)
      .eq("user_id", user.id)
      .eq("topic", STAAR_TOPIC)
      .single(),
    supabase
      .from("test_submissions")
      .select("*")
      .eq("test_id", id)
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("profiles")
      .select("subscription_status")
      .eq("user_id", user.id)
      .single(),
  ]);

  if (!testResult.data) notFound();
  if (!submissionResult.data) redirect(`/staar/${id}`);

  const test = testResult.data;
  const child = test.children as Child;
  const report = submissionResult.data.feedback as unknown as StaarGapReport;
  const isPro = profileResult.data?.subscription_status === "pro";

  const weakCategories = report.category_scores.filter((s) => s.pct < 70);
  const overallMastery = getMastery(report.overall_pct);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      {/* Score header */}
      <div className="text-center py-8 space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          {child.name} · Grade {report.grade} · STAAR Math Readiness
        </p>
        <div className={`text-6xl font-bold ${overallMastery.textColor}`}>
          {report.overall_pct}%
        </div>
        <p className="text-lg font-medium">
          {report.total_correct} of {report.total_questions} correct
        </p>
        <span
          className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${overallMastery.badgeClass}`}
        >
          {overallMastery.label}
        </span>
      </div>

      {/* Category breakdown */}
      <Card>
        <CardContent className="p-6 space-y-5">
          <h2 className="font-semibold">Skill Mastery by Reporting Category</h2>
          <div className="space-y-5">
            {report.category_scores.map((cat) => {
              const m = getMastery(cat.pct);
              return (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <p className="text-sm font-medium">{cat.category}</p>
                      <p className="text-xs text-muted-foreground">
                        {cat.correct} of {cat.total} correct
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold ${m.textColor}`}>
                        {m.label}
                      </span>
                      <span className="text-sm font-bold">{cat.pct}%</span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${m.barColor} rounded-full transition-all`}
                      style={{ width: `${cat.pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Gap closing section */}
      {weakCategories.length > 0 ? (
        <Card className={isPro ? "border-primary/30" : "border-amber-200 bg-amber-50/50"}>
          <CardContent className="p-6 space-y-4">
            <div>
              <h2 className="font-semibold">
                {isPro
                  ? "Close the gaps with targeted worksheets"
                  : "Ready to close these gaps?"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {isPro
                  ? `${weakCategories.length} area${weakCategories.length > 1 ? "s" : ""} where ${child.name} needs practice before STAAR.`
                  : `${child.name} has ${weakCategories.length} area${weakCategories.length > 1 ? "s" : ""} to strengthen. Upgrade to Pro to generate targeted practice worksheets.`}
              </p>
            </div>

            {isPro ? (
              <div className="space-y-2">
                {weakCategories.map((cat) => (
                  <Link
                    key={cat.category}
                    href={`/worksheets/new?child=${child.id}&subject=Math&topic=${encodeURIComponent(cat.worksheetTopic)}`}
                  >
                    <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-white hover:border-primary/40 hover:bg-accent/50 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <BookOpen className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{cat.shortName} Worksheet</p>
                          <p className="text-xs text-muted-foreground">
                            Personalized practice for {child.name}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {weakCategories.map((cat) => (
                  <div
                    key={cat.category}
                    className="flex items-center justify-between p-3 rounded-xl border border-amber-200 bg-white opacity-60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{cat.shortName} Worksheet</p>
                        <p className="text-xs text-muted-foreground">
                          Personalized practice for {child.name}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      Pro
                    </span>
                  </div>
                ))}

                <Link href="/billing">
                  <Button className="w-full mt-2" size="lg">
                    <Zap className="h-4 w-4 mr-2" />
                    Upgrade to Pro — $12/month
                  </Button>
                </Link>
                <p className="text-center text-xs text-muted-foreground">
                  250 worksheets/month · Unlimited child profiles · Cancel anytime
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="p-6 text-center space-y-2">
            <div className="text-3xl">🎉</div>
            <h2 className="font-semibold text-emerald-800">
              {child.name} is looking strong across all categories!
            </h2>
            <p className="text-sm text-emerald-700">
              Keep it up with regular practice to stay sharp before STAAR.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/staar/new" className="flex-1">
          <Button variant="outline" className="w-full">
            Retake Assessment
          </Button>
        </Link>
        <Link href="/dashboard" className="flex-1">
          <Button variant="ghost" className="w-full">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
