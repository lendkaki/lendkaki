export interface Loan {
  id: string;
  lender: string;
  lenderLogo?: string;
  category: LoanCategory;
  interestRate: number;
  maxInterestRate?: number;
  minAmount: number;
  maxAmount: number;
  minTenure: number;
  maxTenure: number;
  monthlyInstallment?: number;
  features: string[];
  isPromoted?: boolean;
}

export type LoanCategory =
  | "personal"
  | "business"
  | "bridging"
  | "debt-consolidation";

export type LoanPurpose =
  | "personal"
  | "business"
  | "bridging"
  | "debt-consolidation"
  | "medical"
  | "renovation"
  | "wedding"
  | "education"
  | "travel"
  | "emergency";

export type EmploymentStatus = "employed" | "self-employed" | "unemployed";

export type Nationality = "citizen_pr" | "foreigner";

export interface LeadFormData {
  loanAmount: number;
  loanPurpose: LoanPurpose;
  tenure: number;
  fullName: string;
  email: string;
  phone: string;
  nationality: Nationality;
  employmentStatus: EmploymentStatus;
  monthlyIncome: number;
  company?: string;
}

export interface TrustStat {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
}

export interface HowItWorksStep {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}
