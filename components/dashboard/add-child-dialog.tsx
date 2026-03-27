"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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
import { addChild } from "@/app/actions/profile";
import { getSubjectsForGrade } from "@/lib/curriculum";
import type { Grade } from "@/types";

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

export default function AddChildDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [grade, setGrade] = useState<Grade | "">("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [interests, setInterests] = useState("");
  const [learningNotes, setLearningNotes] = useState("");

  const availableSubjects = grade ? getSubjectsForGrade(grade as Grade) : [];

  function toggleSubject(subject: string) {
    setSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  }

  function resetForm() {
    setName("");
    setGrade("");
    setSubjects([]);
    setInterests("");
    setLearningNotes("");
    setError(null);
  }

  async function handleSubmit() {
    if (!name || !grade || subjects.length === 0 || !interests) {
      setError("Please fill in all required fields");
      return;
    }
    setLoading(true);
    setError(null);
    const result = await addChild({
      name,
      grade,
      subjects,
      interests,
      learning_notes: learningNotes || undefined,
    });
    setLoading(false);
    if (result?.error) {
      if (result.error === "upgrade_required") {
        setError("Upgrade to Pro to add more than one child.");
      } else {
        setError(result.error);
      }
      return;
    }
    resetForm();
    setOpen(false);
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-1" />
        Add Child
      </Button>

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add a child</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Child&apos;s name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Emma"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Grade</Label>
              <Select value={grade} onValueChange={(v) => { setGrade(v as Grade); setSubjects([]); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {GRADES.map((g) => (
                    <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {grade && (
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
            )}

            <div className="space-y-1.5">
              <Label>Interests</Label>
              <Textarea
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="e.g. dinosaurs, soccer, Minecraft..."
                rows={2}
              />
            </div>

            <div className="space-y-1.5">
              <Label>
                Learning notes <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Textarea
                value={learningNotes}
                onChange={(e) => setLearningNotes(e.target.value)}
                placeholder="Any special needs, strengths, or areas to focus on..."
                rows={2}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                {loading ? "Adding..." : "Add child"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
