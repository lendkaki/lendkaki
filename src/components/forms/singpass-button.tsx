"use client";

import { Badge } from "@/components/ui/badge";
import { Fingerprint } from "lucide-react";

export function SingpassButton() {
  return (
    <button
      type="button"
      disabled
      className="group relative flex w-full min-w-[280px] items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 px-4 py-4 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 disabled:cursor-not-allowed sm:gap-3 sm:px-6"
    >
      <Fingerprint className="h-5 w-5 shrink-0 text-primary" />
      <span className="whitespace-nowrap">Fast-track with Singpass</span>
      <Badge
        variant="secondary"
        className="ml-1 shrink-0 bg-primary/10 text-xs text-primary sm:ml-2"
      >
        Coming Soon
      </Badge>
    </button>
  );
}
