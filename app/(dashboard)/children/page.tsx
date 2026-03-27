import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import ChildCard from "@/components/dashboard/child-card";
import AddChildDialog from "@/components/dashboard/add-child-dialog";
import type { Child, Profile } from "@/types";

export default async function ChildrenPage() {
  const supabase = await createClient();

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

  const canAddMore = profile.subscription_status === "pro" || children.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Children</h1>
          <p className="text-muted-foreground mt-1">
            Manage your children&apos;s profiles and settings.
          </p>
        </div>
        {canAddMore ? (
          <AddChildDialog />
        ) : (
          <Link href="/billing">
            <Button variant="outline">
              Upgrade to add more children
            </Button>
          </Link>
        )}
      </div>

      {children.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-4xl mb-3">👶</div>
            <h3 className="font-semibold text-lg">No children yet</h3>
            <p className="text-muted-foreground mt-1 mb-4">
              Add your child&apos;s profile to start generating personalized worksheets.
            </p>
            <AddChildDialog />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {children.map((child) => (
            <ChildCard key={child.id} child={child} />
          ))}
        </div>
      )}

      {profile.subscription_status === "free" && children.length >= 1 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold">Need to add more children?</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Pro plan includes unlimited child profiles.
              </p>
            </div>
            <Link href="/billing">
              <Button size="sm">Upgrade to Pro</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
