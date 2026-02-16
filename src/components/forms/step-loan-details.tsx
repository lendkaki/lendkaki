"use client";

import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { loanPurposeOptions } from "@/lib/loan-data";
import type { LeadFormValues } from "@/lib/schemas";

export function StepLoanDetails() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<LeadFormValues>();

  const loanAmount = watch("loanAmount") || 20000;
  const tenure = watch("tenure") || 24;

  return (
    <div className="space-y-8">
      {/* Loan Amount Slider */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Loan Amount</Label>
          <span className="font-mono text-2xl font-bold text-primary">
            ${loanAmount.toLocaleString("en-SG")}
          </span>
        </div>
        <Slider
          min={1000}
          max={300000}
          step={1000}
          value={[loanAmount]}
          onValueChange={(value) => setValue("loanAmount", value[0])}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>$1,000</span>
          <span>$300,000</span>
        </div>
        {errors.loanAmount && (
          <p className="text-sm text-destructive">{errors.loanAmount.message}</p>
        )}
      </div>

      {/* Loan Purpose */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Purpose of Loan</Label>
        <Select
          onValueChange={(value) =>
            setValue("loanPurpose", value as LeadFormValues["loanPurpose"])
          }
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select loan purpose" />
          </SelectTrigger>
          <SelectContent>
            {loanPurposeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.loanPurpose && (
          <p className="text-sm text-destructive">
            {errors.loanPurpose.message}
          </p>
        )}
      </div>

      {/* Tenure Slider */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Repayment Tenure</Label>
          <span className="font-mono text-lg font-semibold text-foreground">
            {tenure} months
          </span>
        </div>
        <Slider
          min={3}
          max={72}
          step={3}
          value={[tenure]}
          onValueChange={(value) => setValue("tenure", value[0])}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>3 months</span>
          <span>72 months</span>
        </div>
        {errors.tenure && (
          <p className="text-sm text-destructive">{errors.tenure.message}</p>
        )}
      </div>
    </div>
  );
}
