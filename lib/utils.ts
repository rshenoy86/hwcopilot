import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

// Returns the reset date: 30 days after the period start date
export function getResetDate(periodStartDate: string): Date {
  const start = new Date(periodStartDate);
  const reset = new Date(start);
  reset.setDate(reset.getDate() + 30);
  return reset;
}

// Check if the 30-day period has expired
export function isPeriodExpired(periodStartDate: string): boolean {
  const resetDate = getResetDate(periodStartDate);
  return new Date() >= resetDate;
}

// Keep for backwards compatibility
export function getFirstOfCurrentMonth(): string {
  return getTodayString();
}
