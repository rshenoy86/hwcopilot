"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Upload, X, ImageIcon } from "lucide-react";

interface TestUploadFormProps {
  testId: string;
}

const MAX_FILES = 6;
const MAX_SIZE_MB = 10;

export default function TestUploadForm({ testId }: TestUploadFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<"idle" | "uploading" | "grading">("idle");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    const valid = selected.filter((f) => {
      if (!f.type.startsWith("image/")) return false;
      if (f.size > MAX_SIZE_MB * 1024 * 1024) return false;
      return true;
    });

    if (valid.length !== selected.length) {
      setError(`Some files were skipped. Only images under ${MAX_SIZE_MB}MB are accepted.`);
    } else {
      setError(null);
    }

    const combined = [...files, ...valid].slice(0, MAX_FILES);
    setFiles(combined);

    const newPreviews = combined.map((f) => URL.createObjectURL(f));
    setPreviews(newPreviews);
  }

  function removeFile(index: number) {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
  }

  async function handleSubmit() {
    if (files.length === 0) {
      setError("Please add at least one photo of the completed test.");
      return;
    }

    setError(null);
    setUploading(true);
    setStage("uploading");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    // Upload images to Supabase Storage
    const uploadedPaths: string[] = [];
    for (const file of files) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/${testId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("test-submissions")
        .upload(path, file, { contentType: file.type, upsert: false });

      if (uploadError) {
        setError("Failed to upload images. Please try again.");
        setUploading(false);
        setStage("idle");
        return;
      }

      uploadedPaths.push(path);
    }

    // Call grading API
    setStage("grading");

    const res = await fetch(`/api/tests/${testId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imagePaths: uploadedPaths }),
    });

    const data = await res.json();
    setUploading(false);
    setStage("idle");

    if (!res.ok) {
      setError(data.error || "Grading failed. Please try again.");
      return;
    }

    router.push(`/test-prep/${testId}/results`);
  }

  return (
    <Card className="no-print">
      <CardContent className="p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-lg">Upload Completed Test</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Once your child finishes, take a clear photo of each page and upload below. Our AI will grade it and give detailed feedback.
          </p>
        </div>

        {/* Upload area */}
        <div
          className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium">Tap to add photos</p>
          <p className="text-xs text-muted-foreground mt-1">
            Up to {MAX_FILES} images · Max {MAX_SIZE_MB}MB each · JPG, PNG, or HEIC
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Previews */}
        {previews.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {previews.map((src, i) => (
              <div key={i} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-border bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Page ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeFile(i)}
                  className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 text-white hover:bg-black/80 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                  <ImageIcon className="h-3 w-3 inline mr-0.5" />
                  p.{i + 1}
                </div>
              </div>
            ))}
            {previews.length < MAX_FILES && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="aspect-[3/4] rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <div className="text-center">
                  <Upload className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-xs">Add more</span>
                </div>
              </button>
            )}
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button
          className="w-full"
          disabled={files.length === 0 || uploading}
          onClick={handleSubmit}
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {stage === "uploading" ? "Uploading photos..." : "Grading test with AI..."}
            </>
          ) : (
            "Grade This Test"
          )}
        </Button>

        {uploading && stage === "grading" && (
          <p className="text-center text-xs text-muted-foreground">
            This takes about 15–30 seconds. Please don&apos;t close this page.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
