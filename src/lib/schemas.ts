import { z } from "zod";

export const stepLoanDetailsSchema = z.object({
  loanAmount: z
    .number({ error: "Loan amount is required" })
    .min(1000, "Minimum loan amount is $1,000")
    .max(300000, "Maximum loan amount is $300,000"),
  tenure: z
    .number({ error: "Tenure is required" })
    .min(3, "Minimum tenure is 3 months")
    .max(72, "Maximum tenure is 72 months"),
});

export const stepPersonalSchema = z.object({
  fullName: z
    .string({ error: "Full name is required" })
    .min(2, "Name must be at least 2 characters"),
  email: z
    .string({ error: "Email is required" })
    .email("Please enter a valid email address"),
  phone: z
    .string({ error: "Phone number is required" })
    .regex(/^[689]\d{7}$/, "Please enter a valid Singapore phone number"),
  nationality: z.enum(["citizen_pr", "foreigner"], {
    error: "Please select your nationality",
  }),
  loanPurpose: z.enum(
    [
      "personal",
      "business",
      "bridging",
      "debt-consolidation",
      "medical",
      "renovation",
      "wedding",
      "education",
      "travel",
      "emergency",
    ],
    { error: "Please select a loan purpose" }
  ),
});

export const stepEmploymentSchema = z.object({
  employmentStatus: z.enum(["employed", "self-employed", "unemployed"], {
    error: "Please select your employment status",
  }),
  monthlyIncome: z
    .number({ error: "Monthly income is required" })
    .min(0, "Income cannot be negative"),
  company: z.string().optional(),
});

export const leadFormSchema = stepLoanDetailsSchema
  .merge(stepPersonalSchema)
  .merge(stepEmploymentSchema);

export type LeadFormValues = z.infer<typeof leadFormSchema>;

export const quickLeadSchema = z.object({
  fullName: z
    .string({ error: "Please fill out this field." })
    .min(2, "Name must be at least 2 characters"),
  phone: z
    .string({ error: "Please fill out this field." })
    .regex(/^[689]\d{7}$/, "Please enter a valid Singapore phone number"),
  email: z
    .string({ error: "Please fill out this field." })
    .email("Please enter a valid email address"),
  loanAmount: z
    .number({ error: "Please fill out this field." })
    .min(1000, "Minimum loan amount is $1,000")
    .max(300000, "Maximum loan amount is $300,000"),
  loanPurpose: z.enum(
    [
      "personal",
      "business",
      "bridging",
      "debt-consolidation",
      "medical",
      "renovation",
      "wedding",
      "education",
      "travel",
      "emergency",
    ],
    { error: "Please fill out this field." }
  ),
  nationality: z.enum(["citizen_pr", "foreigner"], {
    error: "Please fill out this field.",
  }),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms to proceed.",
  }),
});

export type QuickLeadValues = z.infer<typeof quickLeadSchema>;
