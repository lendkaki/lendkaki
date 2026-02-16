"use client";

import { Badge } from "@/components/ui/badge";
import { Fingerprint } from "lucide-react";

export function SingpassButton() {
  return (
    <button
      type="button"
      disabled
      className="group relative flex w-full items-center justify-center gap-3 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 px-6 py-4 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 disabled:cursor-not-allowed"
    >
      <Fingerprint className="h-5 w-5 text-primary" />
      <span>Fast-track with Singpass</span>
      <Badge
        variant="secondary"
        className="ml-2 bg-primary/10 text-primary text-xs"
      >
        Coming Soon
      </Badge>
    </button>
  );
}
