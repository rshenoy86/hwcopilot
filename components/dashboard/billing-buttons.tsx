"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap, Settings } from "lucide-react";
import { createCheckoutSession, createPortalSession } from "@/app/actions/billing";

interface BillingButtonsProps {
  isPro: boolean;
  showUpgradeOnly?: boolean;
}

export default function BillingButtons({ isPro, showUpgradeOnly }: BillingButtonsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpgrade() {
    setLoading(true);
    setError(null);
    try {
      const result = await createCheckoutSession();
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
      // If no error returned, a redirect happened — loading stays true briefly
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      if (!msg.includes("NEXT_REDIRECT")) {
        setError(msg);
        setLoading(false);
      }
    }
  }

  async function handleManage() {
    setLoading(true);
    setError(null);
    try {
      const result = await createPortalSession();
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      if (!msg.includes("NEXT_REDIRECT")) {
        setError(msg);
        setLoading(false);
      }
    }
  }

  if (error) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="outline" size="sm" onClick={() => setError(null)}>
          Try again
        </Button>
      </div>
    );
  }

  if (isPro && !showUpgradeOnly) {
    return (
      <Button
        variant="outline"
        className="w-full"
        onClick={handleManage}
        disabled={loading}
      >
        <Settings className="h-4 w-4 mr-2" />
        {loading ? "Loading..." : "Manage Subscription"}
      </Button>
    );
  }

  return (
    <Button
      className="w-full"
      size="lg"
      onClick={handleUpgrade}
      disabled={loading}
    >
      <Zap className="h-4 w-4 mr-2" />
      {loading ? "Loading checkout..." : "Upgrade to Pro — $12/month"}
    </Button>
  );
}
