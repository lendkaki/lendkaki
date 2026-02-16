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
    </div>
  );
}
