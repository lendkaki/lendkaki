import { NextResponse } from "next/server";
import { leadFormSchema, quickLeadSchema, type LeadFormValues, type QuickLeadValues } from "@/lib/schemas";

const LEADS_API_KEY = process.env.NEXT_PUBLIC_LEADS_API_KEY;

function buildLeadEmailHtml(fields: LeadFormValues | QuickLeadValues): string {
  const isFullLead = "fullName" in fields;
  const name = isFullLead ? (fields as LeadFormValues).fullName : (fields as QuickLeadValues).name;
  const phone = fields.phone;
  const amount = isFullLead
    ? `$${((fields as LeadFormValues).loanAmount ?? 0).toLocaleString()}`
    : `$${((fields as QuickLeadValues).amount ?? 0).toLocaleString()}`;
  const nationality = fields.nationality === "foreigner" ? "Foreigner" : "Singaporean / PR";

  return `<!DOCTYPE html>
<html><body style="font-family:sans-serif;font-size:15px;color:#111;padding:32px;line-height:1.6">
  <p>This is a new Lendkaki Lead</p>
  <br/>
  <p><strong>Full Name:</strong> ${name}</p>
  <p><strong>Phone Number:</strong> ${phone}</p>
  <p><strong>Nationality:</strong> ${nationality}</p>
  <p><strong>Amount:</strong> ${amount}</p>
</body></html>`;
}

export async function POST(request: Request) {
  try {
    if (LEADS_API_KEY) {
      const providedKey = request.headers.get("x-api-key");
      if (providedKey !== LEADS_API_KEY) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    const body = await request.json();

    const {
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      landing_page,
      variant,
      agreedToTerms,
      customer_profile_id,
      ...formFields
    } = body;

    const fullParsed = leadFormSchema.safeParse(formFields);
    const quickParsed = quickLeadSchema.safeParse({
      ...formFields,
      agreedToTerms,
    });

    if (!fullParsed.success && !quickParsed.success) {
      const errors =
        fullParsed.error?.flatten().fieldErrors ??
        quickParsed.error?.flatten().fieldErrors;
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      const { supabase } = await import("@/lib/supabase");
      let payload;

      const profileId = customer_profile_id || null;

      if (fullParsed.success) {
        const data = fullParsed.data;
        payload = {
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
          customer_profile_id: profileId,
        };
      } else if (quickParsed.success) {
        const quickData = quickParsed.data;
        payload = {
          loan_amount: quickData.amount,
          loan_purpose: quickData.purpose,
          full_name: quickData.name,
          email: quickData.email,
          phone: quickData.phone,
          nationality: quickData.nationality,
          utm_source: utm_source || null,
          utm_medium: utm_medium || null,
          utm_campaign: utm_campaign || null,
          utm_content: utm_content || null,
          utm_term: utm_term || null,
          landing_page: landing_page || null,
          variant: variant || null,
          customer_profile_id: profileId,
        };
      }

      if (!payload) {
        return NextResponse.json(
          { error: "Validation failed" },
          { status: 400 }
        );
      }

      const { error } = await supabase.from("leads").insert(payload);

      if (error) {
        console.error("Supabase insert error:", error);
        return NextResponse.json(
          { error: "Failed to save lead" },
          { status: 500 }
        );
      }
    }

    // Send email notification for /apply-now submissions
    if (landing_page?.includes("/apply-now") && process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      const fields = fullParsed.success ? fullParsed.data : (quickParsed.data as QuickLeadValues);

      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: "smsappointment@crawfort.com.sg",
        subject: "Lendkaki Lead",
        html: buildLeadEmailHtml(fields),
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
