import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Rating, Severity, ClauseType } from "@/types";

// ─── className helper ──────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Score helpers ─────────────────────────────────────────────────────────

export function getRating(score: number): Rating {
  if (score <= 30) return "red";
  if (score <= 65) return "orange";
  return "green";
}

export function getRatingLabel(rating: Rating): string {
  switch (rating) {
    case "green":
      return "Safe";
    case "orange":
      return "Moderate";
    case "red":
      return "High risk";
  }
}

export function getScoreBarColor(rating: Rating): string {
  switch (rating) {
    case "green":
      return "bg-safe";
    case "orange":
      return "bg-moderate";
    case "red":
      return "bg-high";
  }
}

// ─── Clause helpers ────────────────────────────────────────────────────────

export const CLAUSE_LABELS: Record<ClauseType, string> = {
  personal_data: "Personal data",
  third_party: "Third party sharing",
  abusive: "Abusive clauses",
  retention: "Data retention",
  recourse: "Rights of recourse",
};

export const SEVERITY_LABELS: Record<Severity, string> = {
  high: "Concerning",
  medium: "Monitor",
  low: "Standard",
};

// ─── Date helpers ──────────────────────────────────────────────────────────

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ─── String helpers ────────────────────────────────────────────────────────

export function getDomainInitial(domain: string): string {
  return domain.charAt(0).toUpperCase();
}

export function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
