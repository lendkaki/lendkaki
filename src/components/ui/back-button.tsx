"use client";

export function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
    >
      ← Back
    </button>
  );
}
