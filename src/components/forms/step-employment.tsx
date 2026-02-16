"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LeadFormValues } from "@/lib/schemas";

export function StepEmployment() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<LeadFormValues>();

  const employmentStatus = watch("employmentStatus");

  return (
    <div className="space-y-6">
      {/* Employment Status */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Employment Status</Label>
        <Select
          onValueChange={(value) =>
            setValue(
              "employmentStatus",
              value as LeadFormValues["employmentStatus"]
            )
          }
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select employment status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="employed">Employed</SelectItem>
            <SelectItem value="self-employed">Self-Employed</SelectItem>
            <SelectItem value="unemployed">Unemployed</SelectItem>
          </SelectContent>
        </Select>
        {errors.employmentStatus && (
          <p className="text-sm text-destructive">
            {errors.employmentStatus.message}
          </p>
        )}
      </div>

      {/* Monthly Income */}
      <div className="space-y-2">
        <Label htmlFor="monthlyIncome" className="text-sm font-medium">
          Monthly Income (SGD)
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            $
          </span>
          <Input
            id="monthlyIncome"
            type="number"
            placeholder="5000"
            className="h-11 pl-7"
            {...register("monthlyIncome", { valueAsNumber: true })}
          />
        </div>
        {errors.monthlyIncome && (
          <p className="text-sm text-destructive">
            {errors.monthlyIncome.message}
          </p>
        )}
      </div>

      {/* Company (conditional) */}
      {(employmentStatus === "employed" ||
        employmentStatus === "self-employed") && (
        <div className="space-y-2">
          <Label htmlFor="company" className="text-sm font-medium">
            Company Name{" "}
            <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="company"
            placeholder="e.g. DBS Bank"
            className="h-11"
            {...register("company")}
          />
        </div>
      )}
    </div>
  );
}
