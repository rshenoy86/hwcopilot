import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Worksheet } from "@/types";

export default async function WorksheetsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: worksheets } = await supabase
    .from("worksheets")
    .select("*, children(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const allWorksheets = (worksheets as (Worksheet & { children: { name: string } })[]) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">All Worksheets</h1>
          <p className="text-muted-foreground mt-1">
            {allWorksheets.length} worksheet{allWorksheets.length !== 1 ? "s" : ""} generated
          </p>
        </div>
        <Link href="/worksheets/new">
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            New Worksheet
          </Button>
        </Link>
      </div>

      {allWorksheets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-4xl mb-3">📄</div>
            <h3 className="font-semibold text-lg">No worksheets yet</h3>
            <p className="text-muted-foreground mt-1 mb-4">
              Generate your first personalized worksheet in 30 seconds.
            </p>
            <Link href="/worksheets/new">
              <Button>
                <BookOpen className="h-4 w-4 mr-1" />
                Create First Worksheet
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {allWorksheets.map((w) => (
            <Link key={w.id} href={`/worksheets/${w.id}`}>
              <div className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-accent/50 transition-all bg-card">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">
                        {w.children?.name} — {w.topic}
                      </p>
                      <Badge variant="secondary">{w.subject}</Badge>
                      <span className="text-sm">{"⭐".repeat(w.difficulty)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {w.grade === "K" ? "Kindergarten" : `Grade ${w.grade}`} · {formatDate(w.created_at)}
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
