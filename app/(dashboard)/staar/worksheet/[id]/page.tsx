import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { STAAR_WORKSHEET_TOPIC } from "@/lib/staar-categories";
import { WorksheetView } from "./worksheet-view";
import type { Test, Child } from "@/types";

export default async function StaarWorksheetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: test } = await supabase
    .from("tests")
    .select("*, children(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("topic", STAAR_WORKSHEET_TOPIC)
    .single();

  if (!test) notFound();

  const typedTest = test as Test & { children: Child };

  return (
    <WorksheetView
      test={typedTest}
      childName={typedTest.children?.name ?? "Student"}
    />
  );
}
