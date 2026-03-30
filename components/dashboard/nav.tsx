"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, Users, MessageCircle, CreditCard, LogOut, Menu, X, ClipboardList } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { signOut } from "@/app/actions/auth";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types";
import Mascot from "@/components/mascot";

interface DashboardNavProps {
  profile: Profile;
  userEmail: string;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/worksheets/new", label: "New Worksheet", icon: BookOpen },
  { href: "/test-prep", label: "Test Prep", icon: ClipboardList },
  { href: "/children", label: "My Children", icon: Users },
  { href: "/homework-help", label: "Homework Help", icon: MessageCircle },
  { href: "/billing", label: "Plan & Billing", icon: CreditCard },
];

export default function DashboardNav({ profile, userEmail }: DashboardNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm no-print">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-1.5 font-bold text-lg text-primary">
            <Mascot size={36} />
            GuruBuddy
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {profile.subscription_status === "free" && (
              <Link href="/billing">
                <Badge variant="warning" className="cursor-pointer hover:opacity-80 transition-opacity">
                  Free Plan
                </Badge>
              </Link>
            )}
            {profile.subscription_status === "pro" && (
              <Badge variant="success">Pro</Badge>
            )}
            <div className="text-sm text-muted-foreground">{profile.first_name}</div>
            <form action={signOut}>
              <Button variant="ghost" size="sm" type="submit" className="text-muted-foreground">
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card pb-4 px-4">
          <nav className="flex flex-col gap-1 mt-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <div className="text-sm text-muted-foreground">{userEmail}</div>
            <form action={signOut}>
              <Button variant="ghost" size="sm" type="submit">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
