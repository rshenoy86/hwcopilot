import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import WorksheetGeneratorForm from "@/components/worksheets/generator-form";
import type { Child, Profile } from "@/types";

interface PageProps {
  searchParams: Promise<{ child?: string }>;
}

export default async function NewWorksheetPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const { child: preselectedChildId } = await searchParams;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profileResult, childrenResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", user.id).single(),
    supabase
      .from("children")
      .select("*")
      .eq("user_id", user.id)
      .eq("active", true)
      .order("created_at"),
  ]);

  const profile = profileResult.data as Profile | null;
  const children = (childrenResult.data as Child[]) || [];

  if (!profile) redirect("/onboarding");

  if (children.length === 0) redirect("/children");

  const isAtLimit = profile.worksheets_generated_this_month >= profile.worksheet_monthly_limit;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create a Worksheet</h1>
        <p className="text-muted-foreground mt-1">
          Personalized, curriculum-aligned practice — ready to print in 30 seconds.
        </p>
      </div>

      <WorksheetGeneratorForm
        children={children}
        preselectedChildId={preselectedChildId}
        isAtLimit={isAtLimit}
        subscriptionStatus={profile.subscription_status}
      />
    </div>
  );
}
