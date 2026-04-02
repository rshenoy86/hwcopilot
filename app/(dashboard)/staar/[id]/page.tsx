import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import StaarAssessment from "@/components/staar/assessment";
import { STAAR_TOPIC } from "@/lib/staar-categories";
import type { Test, Child } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StaarAssessmentPage({ params }: PageProps) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: test } = await supabase
    .from("tests")
    .select("*, children(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("topic", STAAR_TOPIC)
    .single();

  if (!test) notFound();
  if (test.status === "graded") redirect(`/staar/${id}/results`);

  const child = test.children as Child;

  return (
    <div className="py-4">
      <StaarAssessment test={test as Test} child={child} />
    </div>
  );
}
