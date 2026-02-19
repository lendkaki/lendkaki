import { NextResponse } from "next/server";
import { leadFormSchema, quickLeadSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      landing_page,
      variant,
      agreedToTerms: _agreedToTerms,
      ...formFields
    } = body;

    const fullParsed = leadFormSchema.safeParse(formFields);
    const quickParsed = quickLeadSchema.safeParse({ ...formFields, agreedToTerms: body.agreedToTerms });

    if (!fullParsed.success && !quickParsed.success) {
      const errors = fullParsed.error?.flatten().fieldErrors ?? quickParsed.error?.flatten().fieldErrors;
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    const data = fullParsed.success ? fullParsed.data : formFields;

    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      const { supabase } = await import("@/lib/supabase");
      const { error } = await supabase.from("leads").insert({
        loan_amount: data.loanAmount,
        loan_purpose: data.loanPurpose,
        tenure: data.tenure ?? null,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        nationality: data.nationality,
        employment_status: data.employmentStatus ?? null,
        monthly_income: data.monthlyIncome ?? null,
        company: data.company || null,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
        utm_content: utm_content || null,
        utm_term: utm_term || null,
        landing_page: landing_page || null,
        variant: variant || null,
      });

      if (error) {
        console.error("Supabase insert error:", error);
        return NextResponse.json(
          { error: "Failed to save lead" },
          { status: 500 }
        );
      }
    } else {
      console.log("Lead received (Supabase not configured):", {
        ...data,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_content,
        utm_term,
        landing_page,
        variant,
      });
    }

    return NextResponse.json(
      { success: true, message: "Application submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
