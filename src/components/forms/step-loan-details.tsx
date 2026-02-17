"use client";
"use no memo";

import { useState, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { LeadFormValues } from "@/lib/schemas";

export function StepLoanDetails() {
  const {
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<LeadFormValues>();

  const [loanAmount, setLoanAmount] = useState(
    () => getValues("loanAmount") || 20000
  );
  const [tenure, setTenure] = useState(() => getValues("tenure") || 24);

  const handleLoanAmountChange = useCallback(
    (value: number[]) => {
      const amount = value[0];
      setLoanAmount(amount);
      setValue("loanAmount", amount, { shouldDirty: true });
    },
    [setValue]
  );

  const handleTenureChange = useCallback(
    (value: number[]) => {
      const months = value[0];
      setTenure(months);
      setValue("tenure", months, { shouldDirty: true });
    },
    [setValue]
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Loan Amount Slider */}
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:justify-between">
          <Label className="text-sm font-medium">Loan Amount</Label>
          <span className="font-mono text-xl font-semibold text-slate-900 sm:text-lg">
            ${loanAmount.toLocaleString("en-SG")}{loanAmount >= 100000 ? "+" : ""}
          </span>
        </div>
        <Slider
          min={1000}
          max={100000}
          step={1000}
          value={[loanAmount]}
          onValueChange={handleLoanAmountChange}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>$1k</span>
          <span>&gt;$100k</span>
        </div>
        {errors.loanAmount && (
          <p className="text-sm text-destructive">
            {errors.loanAmount.message}
          </p>
        )}
      </div>

      {/* Tenure Slider */}
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:justify-between">
          <Label className="text-sm font-medium">Repayment Tenure</Label>
          <span className="font-mono text-xl font-semibold text-foreground sm:text-lg">
            {tenure} months{tenure >= 24 ? "+" : ""}
          </span>
        </div>
        <Slider
          min={1}
          max={24}
          step={1}
          value={[tenure]}
          onValueChange={handleTenureChange}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1 month</span>
          <span>&gt;24 months</span>
        </div>
        {errors.tenure && (
          <p className="text-sm text-destructive">{errors.tenure.message}</p>
        )}
      </div>
    </div>
  );
}
