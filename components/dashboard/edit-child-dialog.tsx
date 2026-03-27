"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateChild } from "@/app/actions/profile";
import { getSubjectsForGrade } from "@/lib/curriculum";
import type { Child, Grade } from "@/types";

const GRADES: { value: Grade; label: string }[] = [
  { value: "K", label: "Kindergarten" },
  { value: "1", label: "1st Grade" },
  { value: "2", label: "2nd Grade" },
  { value: "3", label: "3rd Grade" },
  { value: "4", label: "4th Grade" },
  { value: "5", label: "5th Grade" },
  { value: "6", label: "6th Grade" },
  { value: "7", label: "7th Grade" },
  { value: "8", label: "8th Grade" },
];

interface EditChildDialogProps {
  child: Child;
  children: React.ReactNode;
}

export default function EditChildDialog({ child, children }: EditChildDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(child.name);
  const [grade, setGrade] = useState<Grade>(child.grade);
  const [subjects, setSubjects] = useState<string[]>(child.subjects);
  const [interests, setInterests] = useState(child.interests);
  const [learningNotes, setLearningNotes] = useState(child.learning_notes || "");

  const availableSubjects = getSubjectsForGrade(grade);

  function toggleSubject(subject: string) {
    setSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  }

  async function handleSubmit() {
    if (!name || !grade || subjects.length === 0 || !interests) {
      setError("Please fill in all required fields");
      return;
    }
    setLoading(true);
    setError(null);
    const result = await updateChild(child.id, {
      name,
      grade,
      subjects,
      interests,
      learning_notes: learningNotes || undefined,
    });
    setLoading(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setOpen(false);
  }

  return (
    <>
      <span onClick={() => setOpen(true)}>{children}</span>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {child.name}&apos;s profile</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Child&apos;s name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label>Grade</Label>
              <Select value={grade} onValueChange={(v) => { setGrade(v as Grade); setSubjects([]); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GRADES.map((g) => (
                    <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Subjects</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableSubjects.map((s) => (
                  <label
                    key={s.subject}
                    className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors text-sm ${
                      subjects.includes(s.subject)
                        ? "border-primary bg-accent"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Checkbox
                      checked={subjects.includes(s.subject)}
                      onCheckedChange={() => toggleSubject(s.subject)}
                    />
                    {s.subject}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Interests</Label>
              <Textarea
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Learning notes <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Textarea
                value={learningNotes}
                onChange={(e) => setLearningNotes(e.target.value)}
                rows={2}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                {loading ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
