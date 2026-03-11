export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string;
          created_at: string;
          loan_amount: number | null;
          loan_purpose: string | null;
          tenure: number | null;
          full_name: string | null;
          email: string | null;
          phone: string | null;
          nationality: string | null;
          employment_status: string | null;
          monthly_income: number | null;
          company: string | null;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          utm_content: string | null;
          utm_term: string | null;
          landing_page: string | null;
          variant: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          loan_amount?: number | null;
          loan_purpose?: string | null;
          tenure?: number | null;
          full_name?: string | null;
          email?: string | null;
          phone?: string | null;
          nationality?: string | null;
          employment_status?: string | null;
          monthly_income?: number | null;
          company?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          utm_content?: string | null;
          utm_term?: string | null;
          landing_page?: string | null;
          variant?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          loan_amount?: number | null;
          loan_purpose?: string | null;
          tenure?: number | null;
          full_name?: string | null;
          email?: string | null;
          phone?: string | null;
          nationality?: string | null;
          employment_status?: string | null;
          monthly_income?: number | null;
          company?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          utm_content?: string | null;
          utm_term?: string | null;
          landing_page?: string | null;
          variant?: string | null;
        };
        Relationships: [];
      };
      myinfo_profiles: {
        Row: {
          id: string;
          created_at: string;
          flow: string | null;
          sub: string | null;
          uinfin: string | null;
          loan_amount: number | null;
          loan_purpose: string | null;
          raw: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          flow?: string | null;
          sub?: string | null;
          uinfin?: string | null;
          loan_amount?: number | null;
          loan_purpose?: string | null;
          raw: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          flow?: string | null;
          sub?: string | null;
          uinfin?: string | null;
          loan_amount?: number | null;
          loan_purpose?: string | null;
          raw?: Json;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};

