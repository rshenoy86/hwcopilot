"use client";

import { useState } from "react";
import { Monitor, Printer } from "lucide-react";
import TestPaper from "@/components/tests/test-paper";
import TestUploadForm from "@/components/tests/test-upload-form";
import TestOnlineForm from "@/components/tests/test-online-form";
import type { Test, Child } from "@/types";

interface TestModeSelectorProps {
  test: Test;
  child: Child;
}

type Mode = "online" | "paper";

export default function TestModeSelector({ test, child }: TestModeSelectorProps) {
  const [mode, setMode] = useState<Mode>("online");

  return (
    <div className="space-y-6">
      {/* Mode toggle */}
      <div>
        <h1 className="text-2xl font-bold mb-1">{test.title}</h1>
        <p className="text-muted-foreground text-sm mb-4">
          How would {child.name} like to take this test?
        </p>
        <div className="inline-flex rounded-xl border border-border bg-muted p-1 gap-1">
          <button
            onClick={() => setMode("online")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === "online"
                ? "bg-white shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Monitor className="h-4 w-4" />
            Take Online
          </button>
          <button
            onClick={() => setMode("paper")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === "paper"
                ? "bg-white shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Printer className="h-4 w-4" />
            Print &amp; Upload
          </button>
        </div>
      </div>

      {mode === "online" ? (
        <TestOnlineForm test={test} child={child} />
      ) : (
        <div className="space-y-8">
          <TestPaper test={test} child={child} />
          <TestUploadForm testId={test.id} />
        </div>
      )}
    </div>
  );
}
