import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TestModeSelector from "@/components/tests/test-mode-selector";
import type { Test, Child } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TestPage({ params }: PageProps) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: test } = await supabase
    .from("tests")
    .select("*, children(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!test) notFound();

  if (test.status === "graded") redirect(`/test-prep/${id}/results`);

  const child = test.children as Child;

  return (
    <div className="max-w-3xl mx-auto">
      <TestModeSelector test={test as Test} child={child} />
    </div>
  );
}
