import { NextResponse } from "next/server";
import { leadFormSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = leadFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Attempt Supabase insert if environment variables are configured
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      const { supabase } = await import("@/lib/supabase");
      const { error } = await supabase.from("leads").insert({
        loan_amount: data.loanAmount,
        loan_purpose: data.loanPurpose,
        tenure: data.tenure,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        nationality: data.nationality,
        employment_status: data.employmentStatus,
        monthly_income: data.monthlyIncome,
        company: data.company || null,
      });

      if (error) {
        console.error("Supabase insert error:", error);
        return NextResponse.json(
          { error: "Failed to save lead" },
          { status: 500 }
        );
      }
    } else {
      // Log to console in development when Supabase is not configured
      console.log("Lead received (Supabase not configured):", data);
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
