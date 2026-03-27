import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, MessageCircle, ArrowRight, Zap } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Child, Worksheet } from "@/types";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profileResult, childrenResult, recentWorksheetsResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", user.id).single(),
    supabase
      .from("children")
      .select("*")
      .eq("user_id", user.id)
      .eq("active", true)
      .order("created_at"),
    supabase
      .from("worksheets")
      .select("*, children(name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const profile = profileResult.data;
  const children = (childrenResult.data as Child[]) || [];
  const recentWorksheets = (recentWorksheetsResult.data as (Worksheet & { children: { name: string } })[]) || [];

  if (!profile) redirect("/onboarding");

  const usagePercent = Math.min(
    100,
    Math.round((profile.worksheets_generated_this_month / profile.worksheet_monthly_limit) * 100)
  );

  const isNearLimit = profile.subscription_status === "free" && profile.worksheets_generated_this_month >= 4;
  const isAtLimit = profile.worksheets_generated_this_month >= profile.worksheet_monthly_limit;

  const resetDate = new Date(profile.month_reset_date);
  resetDate.setMonth(resetDate.getMonth() + 1);

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, {profile.first_name}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Ready to create some great worksheets?
        </p>
      </div>

      {/* Usage bar — most important element */}
      <Card className={isAtLimit ? "border-destructive/30 bg-destructive/5" : isNearLimit ? "border-amber-200 bg-amber-50" : ""}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">
              Worksheets this month
            </CardTitle>
            {profile.subscription_status === "pro" && (
              <Badge variant="success">Pro</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={usagePercent} className={isAtLimit ? "bg-destructive/20" : isNearLimit ? "bg-amber-100" : ""} />
          <div className="flex items-center justify-between text-sm">
            <span className={isAtLimit ? "text-destructive font-medium" : "text-muted-foreground"}>
              <span className="font-semibold text-foreground">
                {profile.worksheets_generated_this_month}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">
                {profile.worksheet_monthly_limit}
              </span>{" "}
              worksheets used
            </span>
            <span className="text-muted-foreground text-xs">
              Resets {formatDate(resetDate)}
            </span>
          </div>

          {isAtLimit && profile.subscription_status === "free" && (
            <div className="rounded-lg bg-primary/10 border border-primary/20 p-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">You&apos;ve used all 5 free worksheets</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Upgrade to Pro for 250 worksheets/month
                </p>
              </div>
              <Link href="/billing">
                <Button size="sm" className="whitespace-nowrap">
                  <Zap className="h-3.5 w-3.5 mr-1" />
                  Upgrade
                </Button>
              </Link>
            </div>
          )}

          {isAtLimit && profile.subscription_status === "pro" && (
            <div className="rounded-lg bg-muted/50 border p-3">
              <p className="text-sm text-muted-foreground">
                You&apos;ve hit your 250 worksheet limit. Worksheets reset on{" "}
                <span className="font-medium text-foreground">{formatDate(resetDate)}</span>.
              </p>
            </div>
          )}

          {isNearLimit && !isAtLimit && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 flex items-center justify-between gap-3">
              <p className="text-sm text-amber-800">
                Almost at your limit! {profile.worksheet_monthly_limit - profile.worksheets_generated_this_month} worksheet{profile.worksheet_monthly_limit - profile.worksheets_generated_this_month !== 1 ? "s" : ""} remaining.
              </p>
              <Link href="/billing">
                <Button size="sm" variant="outline" className="whitespace-nowrap border-amber-300 text-amber-800 hover:bg-amber-100">
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/worksheets/new">
            <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Generate Worksheet</p>
                  <p className="text-xs text-muted-foreground">Ready in 30 seconds</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/homework-help">
            <Card className={`hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group ${profile.subscription_status === "free" ? "opacity-75" : ""}`}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">Homework Help</p>
                    {profile.subscription_status === "free" && (
                      <Badge variant="secondary" className="text-xs">Pro</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">AI tutoring, step by step</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/children">
            <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                  <Plus className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">Add Child</p>
                    {profile.subscription_status === "free" && (
                      <Badge variant="secondary" className="text-xs">Pro</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Manage child profiles</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Children */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Your children</h2>
          <Link href="/children" className="text-sm text-primary hover:underline flex items-center gap-1">
            Manage <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {children.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No children added yet.</p>
              <Link href="/children">
                <Button className="mt-4" size="sm">Add your first child</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {children.map((child) => (
              <Card key={child.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{child.name}</h3>
                        <Badge variant="secondary">
                          {child.grade === "K" ? "Kindergarten" : `Grade ${child.grade}`}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {child.subjects.slice(0, 3).join(", ")}
                        {child.subjects.length > 3 && ` +${child.subjects.length - 3} more`}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Link href={`/worksheets/new?child=${child.id}`}>
                      <Button size="sm" variant="outline" className="w-full">
                        <BookOpen className="h-3.5 w-3.5 mr-1" />
                        Create Worksheet
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Recent worksheets */}
      {recentWorksheets.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent worksheets</h2>
            <Link href="/worksheets" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentWorksheets.map((w) => (
              <Link key={w.id} href={`/worksheets/${w.id}`}>
                <div className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-accent/50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {w.children?.name} — {w.subject}: {w.topic}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(w.created_at)} · {"⭐".repeat(w.difficulty)}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
