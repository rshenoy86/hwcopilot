import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-4">
        <div className="text-6xl">📄</div>
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-muted-foreground">
          Hmm, that page doesn&apos;t exist. Maybe it was moved, or you have a typo in the URL.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link href="/">
            <Button variant="outline">Go home</Button>
          </Link>
          <Link href="/dashboard">
            <Button>Go to dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
