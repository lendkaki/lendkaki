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

export function StepPersonal() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<LeadFormValues>();

  return (
    <div className="space-y-6">
      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-sm font-medium">
          Full Name (as per NRIC)
        </Label>
        <Input
          id="fullName"
          placeholder="e.g. Tan Ah Kow"
          className="h-11"
          {...register("fullName")}
        />
        {errors.fullName && (
          <p className="text-sm text-destructive">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="h-11"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium">
          Mobile Number
        </Label>
        <div className="flex gap-2">
          <div className="flex h-11 w-16 shrink-0 items-center justify-center rounded-md border border-input bg-muted text-sm text-muted-foreground">
            +65
          </div>
          <Input
            id="phone"
            placeholder="9123 4567"
            className="h-11"
            {...register("phone")}
          />
        </div>
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        )}
      </div>

      {/* Nationality */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Nationality</Label>
        <Select
          onValueChange={(value) =>
            setValue("nationality", value as LeadFormValues["nationality"])
          }
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select nationality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="citizen_pr">
              Singapore Citizen / PR
            </SelectItem>
            <SelectItem value="foreigner">Foreigner</SelectItem>
          </SelectContent>
        </Select>
        {errors.nationality && (
          <p className="text-sm text-destructive">
            {errors.nationality.message}
          </p>
        )}
      </div>
    </div>
  );
}
