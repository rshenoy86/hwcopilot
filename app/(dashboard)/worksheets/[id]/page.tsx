import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import WorksheetDisplay from "@/components/worksheets/worksheet-display";
import type { Child, Worksheet } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WorksheetPage({ params }: PageProps) {
  const supabase = await createClient();
  const { id } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: worksheet } = await supabase
    .from("worksheets")
    .select("*, children(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!worksheet) notFound();

  const child = worksheet.children as Child;

  return (
    <WorksheetDisplay
      worksheet={worksheet as Worksheet}
      child={child}
    />
  );
}
