"use client";

import { useFormContext } from "react-hook-form";
import { FormInput } from "@/components/ui/form-input";
import { Label } from "@/components/ui/label";
import { Briefcase, DollarSign, Building2 } from "lucide-react";
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
    <div className="space-y-5">
      {/* Employment Status */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Employment Status</Label>
        <div
          className={`flex h-11 items-center overflow-hidden rounded-full border border-border bg-background pl-3 transition-all focus-within:ring-2 focus-within:ring-primary/30 ${
            errors.employmentStatus ? "border-destructive focus-within:ring-destructive/30" : ""
          }`}
        >
          <Briefcase className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
          <Select
            onValueChange={(value) =>
              setValue(
                "employmentStatus",
                value as LeadFormValues["employmentStatus"],
                { shouldDirty: true }
              )
            }
          >
            <SelectTrigger className="h-full w-full border-0 bg-transparent px-2 shadow-none focus:ring-0">
              <SelectValue placeholder="Select employment status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="employed">Employed</SelectItem>
              <SelectItem value="self-employed">Self-Employed</SelectItem>
              <SelectItem value="unemployed">Unemployed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {errors.employmentStatus && (
          <p className="mt-1.5 text-xs text-destructive">
            {errors.employmentStatus.message}
          </p>
        )}
      </div>

      {/* Monthly Income */}
      <div className="space-y-2">
        <Label htmlFor="monthlyIncome" className="text-sm font-medium">
          Monthly Income (SGD)
        </Label>
        <FormInput
          id="monthlyIncome"
          type="number"
          placeholder="5000"
          icon={<DollarSign className="h-4 w-4" />}
          error={errors.monthlyIncome?.message}
          {...register("monthlyIncome", { valueAsNumber: true })}
        />
      </div>

      {/* Company (conditional) */}
      {(employmentStatus === "employed" ||
        employmentStatus === "self-employed") && (
        <div className="space-y-2">
          <Label htmlFor="company" className="text-sm font-medium">
            Company Name{" "}
            <span className="text-muted-foreground">(optional)</span>
          </Label>
          <FormInput
            id="company"
            placeholder="e.g. DBS Bank"
            icon={<Building2 className="h-4 w-4" />}
            {...register("company")}
          />
        </div>
      )}
    </div>
  );
}
