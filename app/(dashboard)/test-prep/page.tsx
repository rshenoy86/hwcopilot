import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardList, Plus, ArrowRight, Zap } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Test, Profile } from "@/types";

const FREE_LIMIT = 1;
const PRO_LIMIT = 10;

export default async function TestPrepPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profileResult, testsResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", user.id).single(),
    supabase
      .from("tests")
      .select("*, children(name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const profile = profileResult.data as Profile | null;
  if (!profile) redirect("/onboarding");

  const tests = (testsResult.data as (Test & { children: { name: string } })[]) || [];
  const limit = profile.subscription_status === "pro" ? PRO_LIMIT : FREE_LIMIT;
  const used = profile.test_prep_used_this_month ?? 0;
  const isAtLimit = used >= limit;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Test Prep</h1>
          <p className="text-muted-foreground mt-1">
            Generate a practice test, upload the completed copy, and get instant feedback.
          </p>
        </div>
        {!isAtLimit ? (
          <Link href="/test-prep/new">
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              New Test
            </Button>
          </Link>
        ) : (
          <Link href="/billing">
            <Button variant="outline">
              <Zap className="h-4 w-4 mr-1" />
              Upgrade for More
            </Button>
          </Link>
        )}
      </div>

      {/* Usage bar for free users */}
      {profile.subscription_status === "free" && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-sm">
                {used === 0
                  ? "You have 1 free test prep available this month."
                  : "You've used your 1 free test prep this month."}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Upgrade to Pro for 10 test preps/month.
              </p>
            </div>
            {isAtLimit && (
              <Link href="/billing">
                <Button size="sm">
                  <Zap className="h-3.5 w-3.5 mr-1" />
                  Upgrade
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      {tests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="font-semibold text-lg">No tests yet</h3>
            <p className="text-muted-foreground mt-1 mb-4 max-w-sm mx-auto">
              Generate a personalized practice test, have your child complete it, then upload a photo for instant AI grading and feedback.
            </p>
            <Link href="/test-prep/new">
              <Button>
                <ClipboardList className="h-4 w-4 mr-1" />
                Generate First Test
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {tests.map((t) => (
            <Link key={t.id} href={`/test-prep/${t.id}${t.status === "graded" ? "/results" : ""}`}>
              <div className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-accent/50 transition-all bg-card">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <ClipboardList className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">{t.children?.name} — {t.topic}</p>
                      <Badge variant="secondary">{t.subject}</Badge>
                      <Badge variant={t.status === "graded" ? "success" : "warning"}>
                        {t.status === "graded" ? "Graded" : "Awaiting Upload"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t.grade === "K" ? "Kindergarten" : `Grade ${t.grade}`} · {formatDate(t.created_at)}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
