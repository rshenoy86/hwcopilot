"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, BookOpen, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { deleteChild } from "@/app/actions/profile";
import EditChildDialog from "./edit-child-dialog";
import type { Child } from "@/types";

interface ChildCardProps {
  child: Child;
}

export default function ChildCard({ child }: ChildCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await deleteChild(child.id);
    setDeleting(false);
    setShowDeleteConfirm(false);
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">{child.name}</h3>
                <Badge variant="secondary">
                  {child.grade === "K" ? "Kinder" : `Grade ${child.grade}`}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <EditChildDialog child={child}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </EditChildDialog>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Subjects</p>
              <div className="flex flex-wrap gap-1">
                {child.subjects.slice(0, 4).map((s) => (
                  <span key={s} className="text-xs bg-accent px-2 py-0.5 rounded-full">
                    {s}
                  </span>
                ))}
                {child.subjects.length > 4 && (
                  <span className="text-xs text-muted-foreground">+{child.subjects.length - 4} more</span>
                )}
              </div>
            </div>

            {child.interests && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Interests</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{child.interests}</p>
              </div>
            )}

            {child.learning_notes && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Learning notes</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{child.learning_notes}</p>
              </div>
            )}
          </div>

          <Link href={`/worksheets/new?child=${child.id}`}>
            <Button size="sm" className="w-full">
              <BookOpen className="h-3.5 w-3.5 mr-1" />
              Create Worksheet
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Delete confirmation */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove {child.name}?</DialogTitle>
            <DialogDescription>
              This will remove {child.name}&apos;s profile. Their worksheets will still be saved. You can always add them back later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
