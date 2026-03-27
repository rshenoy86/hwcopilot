import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Zap } from "lucide-react";
import { formatDate, getResetDate } from "@/lib/utils";
import BillingButtons from "@/components/dashboard/billing-buttons";
import type { Profile } from "@/types";

interface PageProps {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}

export default async function BillingPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const { success, canceled } = await searchParams;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile) redirect("/onboarding");

  const p = profile as Profile;

  const usagePercent = Math.min(
    100,
    Math.round((p.worksheets_generated_this_month / p.worksheet_monthly_limit) * 100)
  );

  const resetDate = getResetDate(p.month_reset_date);

  const isPro = p.subscription_status === "pro";

  const PRO_FEATURES = [
    "250 worksheets per month (household pool)",
    "Unlimited child profiles",
    "All subjects and difficulty levels",
    "AI Homework Help — step-by-step explanations",
    "Priority support",
  ];

  const FREE_FEATURES = [
    "5 worksheets per month",
    "1 child profile",
    "All subjects and grade levels",
    "Print-ready format",
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Plan & Billing</h1>
        <p className="text-muted-foreground mt-1">Manage your subscription and usage.</p>
      </div>

      {success && (
        <div className="rounded-xl bg-green-50 border border-green-200 p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
          <div>
            <p className="font-semibold text-green-800">Welcome to Pro!</p>
            <p className="text-sm text-green-700">
              Your subscription is active. You now have access to 250 worksheets/month and all Pro features.
            </p>
          </div>
        </div>
      )}

      {canceled && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
          Checkout was canceled. Your plan hasn&apos;t changed.
        </div>
      )}

      {/* Current plan */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Current Plan</CardTitle>
            <Badge variant={isPro ? "success" : "secondary"}>
              {isPro ? "Pro" : "Free"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Worksheets this month</span>
              <span className="font-medium">
                {p.worksheets_generated_this_month} / {p.worksheet_monthly_limit}
              </span>
            </div>
            <Progress value={usagePercent} />
            <p className="text-xs text-muted-foreground">
              Resets on {formatDate(resetDate)}
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            {(isPro ? PRO_FEATURES : FREE_FEATURES).map((f) => (
              <div key={f} className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>

          <BillingButtons isPro={isPro} />
        </CardContent>
      </Card>

      {/* Upgrade card for free users */}
      {!isPro && (
        <Card className="border-primary/30 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-lg">Upgrade to Pro</h3>
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  Everything you need for serious homework practice.
                </p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-bold">$12</div>
                <div className="text-xs text-muted-foreground">/month</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {PRO_FEATURES.map((f) => (
                <div key={f} className="flex items-start gap-1.5 text-xs">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <BillingButtons isPro={false} showUpgradeOnly />
            </div>

            <p className="text-xs text-center text-muted-foreground mt-3">
              Cancel anytime. No contracts.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pricing comparison */}
      {!isPro && (
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="font-semibold mb-1">Free</p>
              <p className="text-2xl font-bold">$0</p>
              <p className="text-xs text-muted-foreground mb-3">Forever</p>
              <ul className="text-xs space-y-1.5 text-muted-foreground">
                <li>5 worksheets/month</li>
                <li>1 child profile</li>
                <li>Basic subjects</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="border-primary/30">
            <CardContent className="p-4">
              <p className="font-semibold mb-1">Pro</p>
              <p className="text-2xl font-bold">$12</p>
              <p className="text-xs text-muted-foreground mb-3">per month</p>
              <ul className="text-xs space-y-1.5">
                <li className="font-medium">250 worksheets/month</li>
                <li>Unlimited children</li>
                <li>Homework Help AI</li>
                <li>All subjects</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
