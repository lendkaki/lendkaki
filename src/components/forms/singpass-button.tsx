"use client";

import { Badge } from "@/components/ui/badge";
import { Fingerprint } from "lucide-react";

export function SingpassButton() {
  return (
    <button
      type="button"
      disabled
      className="group relative flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 px-3 py-4 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 disabled:cursor-not-allowed sm:gap-3 sm:px-6 sm:text-sm"
    >
      <Fingerprint className="h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" />
      <span className="truncate">Fast-track with Singpass</span>
      <Badge
        variant="secondary"
        className="ml-1 shrink-0 bg-primary/10 text-[10px] text-primary sm:ml-2 sm:text-xs"
      >
        Coming Soon
      </Badge>
    </button>
  );
}
