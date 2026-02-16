"use client";

import { useFormContext } from "react-hook-form";
import { FormInput } from "@/components/ui/form-input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { loanPurposeOptions } from "@/lib/loan-data";
import type { LeadFormValues } from "@/lib/schemas";

export function StepPersonal() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<LeadFormValues>();

  return (
    <div className="space-y-5">
      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-sm font-medium">
          Full Name (as per NRIC)
        </Label>
        <FormInput
          id="fullName"
          placeholder="e.g. Tan Ah Kow"
          icon={<User className="h-4 w-4" />}
          error={errors.fullName?.message}
          {...register("fullName")}
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email Address
        </Label>
        <FormInput
          id="email"
          type="email"
          placeholder="you@example.com"
          icon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium">
          Mobile Number
        </Label>
        <div className="flex gap-2">
          <div className="flex h-11 w-16 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-sm font-medium text-muted-foreground">
            +65
          </div>
          <FormInput
            id="phone"
            placeholder="9123 4567"
            icon={<Phone className="h-4 w-4" />}
            error={errors.phone?.message}
            {...register("phone")}
          />
        </div>
      </div>

      {/* Nationality */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Nationality</Label>
        <div
          className={`flex h-11 items-center overflow-hidden rounded-full border border-border bg-background pl-3 transition-all focus-within:ring-2 focus-within:ring-primary/30 ${
            errors.nationality ? "border-destructive focus-within:ring-destructive/30" : ""
          }`}
        >
          <Globe className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
          <Select
            onValueChange={(value) =>
              setValue("nationality", value as LeadFormValues["nationality"], {
                shouldDirty: true,
              })
            }
          >
            <SelectTrigger className="h-full w-full border-0 bg-transparent px-2 shadow-none focus:ring-0">
              <SelectValue placeholder="Select nationality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="citizen_pr">
                Singapore Citizen / PR
              </SelectItem>
              <SelectItem value="foreigner">Foreigner</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {errors.nationality && (
          <p className="mt-1.5 text-xs text-destructive">
            {errors.nationality.message}
          </p>
        )}
      </div>

      {/* Loan Purpose */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Purpose of Loan</Label>
        <div
          className={`flex h-11 items-center overflow-hidden rounded-full border border-border bg-background pl-3 transition-all focus-within:ring-2 focus-within:ring-primary/30 ${
            errors.loanPurpose ? "border-destructive focus-within:ring-destructive/30" : ""
          }`}
        >
          <svg className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 5.333v5.334a2.67 2.67 0 0 1-2.667 2.666H4.667A2.67 2.67 0 0 1 2 10.667V5.333m12 0A2.67 2.67 0 0 0 11.333 2.667H4.667A2.67 2.67 0 0 0 2 5.333m12 0v.334c0 .589-.239 1.153-.664 1.569l-2.003 1.953a1.33 1.33 0 0 1-1.853 0L8 7.764 6.52 9.189a1.33 1.33 0 0 1-1.853 0L2.664 7.236A2.22 2.22 0 0 1 2 5.667v-.334" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          <Select
            onValueChange={(value) =>
              setValue("loanPurpose", value as LeadFormValues["loanPurpose"], {
                shouldDirty: true,
              })
            }
          >
            <SelectTrigger className="h-full w-full border-0 bg-transparent px-2 shadow-none focus:ring-0">
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
        </div>
        {errors.loanPurpose && (
          <p className="mt-1.5 text-xs text-destructive">
            {errors.loanPurpose.message}
          </p>
        )}
      </div>
    </div>
  );
}
