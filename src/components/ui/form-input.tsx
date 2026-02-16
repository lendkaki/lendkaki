"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, icon, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <div
          className={cn(
            "flex h-11 items-center overflow-hidden rounded-full border border-border bg-background pl-3 transition-all focus-within:ring-2 focus-within:ring-primary/30",
            error && "border-destructive focus-within:ring-destructive/30",
            className
          )}
        >
          {icon && <div className="mr-2 shrink-0 text-muted-foreground">{icon}</div>}
          <input
            ref={ref}
            className="h-full w-full bg-transparent px-2 outline-none placeholder:text-muted-foreground"
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  }
);
FormInput.displayName = "FormInput";

export { FormInput };
