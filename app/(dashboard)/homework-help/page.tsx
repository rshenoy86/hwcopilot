import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap } from "lucide-react";
import HomeworkHelpChat from "@/components/dashboard/homework-help-chat";
import type { Child, HomeworkHelpSession, Profile } from "@/types";

export default async function HomeworkHelpPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profileResult, childrenResult, sessionsResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", user.id).single(),
    supabase.from("children").select("*").eq("user_id", user.id).eq("active", true).order("created_at"),
    supabase
      .from("homework_help_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const profile = profileResult.data as Profile | null;
  const children = (childrenResult.data as Child[]) || [];
  const recentSessions = (sessionsResult.data as HomeworkHelpSession[]) || [];

  if (!profile) redirect("/onboarding");

  if (profile.subscription_status !== "pro") {
    return (
      <div className="max-w-lg mx-auto mt-12 text-center space-y-6">
        <div className="text-5xl">💬</div>
        <div>
          <h1 className="text-2xl font-bold">Homework Help</h1>
          <p className="text-muted-foreground mt-2">
            Get step-by-step explanations for any homework question, tailored to your child&apos;s grade level.
          </p>
        </div>
        <Card className="border-primary/20 bg-primary/5 text-left">
          <CardContent className="p-5 space-y-3">
            <p className="font-semibold">Pro feature</p>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li>✓ Ask any homework question</li>
              <li>✓ Step-by-step explanations</li>
              <li>✓ Grade-appropriate language</li>
              <li>✓ Explain it like I&apos;m in [grade] mode</li>
              <li>✓ All previous sessions saved</li>
            </ul>
          </CardContent>
        </Card>
        <Link href="/billing">
          <Button size="lg" className="w-full">
            <Zap className="h-4 w-4 mr-2" />
            Upgrade to Pro — $12/month
          </Button>
        </Link>
        <p className="text-xs text-muted-foreground">
          Also includes 250 worksheets/month and unlimited child profiles.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Homework Help</h1>
        <p className="text-muted-foreground mt-1">
          Paste any homework question and get a clear, step-by-step explanation.
        </p>
      </div>
      <HomeworkHelpChat children={children} recentSessions={recentSessions} />
    </div>
  );
}
