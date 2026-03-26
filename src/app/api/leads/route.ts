import { NextResponse } from "next/server";
import { leadFormSchema, quickLeadSchema, type LeadFormValues, type QuickLeadValues } from "@/lib/schemas";

const LEADS_API_KEY = process.env.NEXT_PUBLIC_LEADS_API_KEY;

const PURPOSE_LABELS: Record<string, string> = {
  personal: "Personal Loan",
  business: "Business Loan",
  bridging: "Bridging Loan",
  "debt-consolidation": "Debt Consolidation",
  medical: "Medical",
  renovation: "Renovation",
  wedding: "Wedding",
  education: "Education",
  travel: "Travel",
  emergency: "Emergency",
};

type EmailMeta = {
  landing_page?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};

function buildLeadEmailHtml(
  fields: LeadFormValues | QuickLeadValues,
  meta: EmailMeta
): string {
  const isFullLead = "fullName" in fields;

  const name = isFullLead ? (fields as LeadFormValues).fullName : (fields as QuickLeadValues).name;
  const phone = fields.phone;
  const email = fields.email ?? "—";
  const amount = isFullLead
    ? `$${((fields as LeadFormValues).loanAmount ?? 0).toLocaleString()}`
    : `$${((fields as QuickLeadValues).amount ?? 0).toLocaleString()}`;
  const purpose = isFullLead
    ? PURPOSE_LABELS[(fields as LeadFormValues).loanPurpose] ?? (fields as LeadFormValues).loanPurpose
    : PURPOSE_LABELS[(fields as QuickLeadValues).purpose] ?? (fields as QuickLeadValues).purpose;
  const nationality = fields.nationality === "foreigner" ? "Foreigner" : "Singaporean / PR";

  const extraRows = isFullLead
    ? `
      <tr><td style="padding:8px 12px;font-weight:600;color:#374151;white-space:nowrap">Employment</td><td style="padding:8px 12px;color:#111827">${(fields as LeadFormValues).employmentStatus ?? "—"}</td></tr>
      <tr style="background:#f9fafb"><td style="padding:8px 12px;font-weight:600;color:#374151;white-space:nowrap">Monthly Income</td><td style="padding:8px 12px;color:#111827">${(fields as LeadFormValues).monthlyIncome != null ? `$${(fields as LeadFormValues).monthlyIncome!.toLocaleString()}` : "—"}</td></tr>
      <tr><td style="padding:8px 12px;font-weight:600;color:#374151;white-space:nowrap">Company</td><td style="padding:8px 12px;color:#111827">${(fields as LeadFormValues).company ?? "—"}</td></tr>
      <tr style="background:#f9fafb"><td style="padding:8px 12px;font-weight:600;color:#374151;white-space:nowrap">Tenure</td><td style="padding:8px 12px;color:#111827">${(fields as LeadFormValues).tenure != null ? `${(fields as LeadFormValues).tenure} months` : "—"}</td></tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1)">

        <!-- Header -->
        <tr>
          <td style="background:#0f1b3d;padding:24px 32px">
            <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#93c5fd">New Lead</p>
            <h1 style="margin:6px 0 0;font-size:22px;font-weight:800;color:#ffffff">Loan Application Received</h1>
          </td>
        </tr>

        <!-- Applicant summary -->
        <tr>
          <td style="padding:24px 32px 8px">
            <p style="margin:0;font-size:13px;color:#6b7280">A new loan application was submitted via <strong>${meta.landing_page ?? "lendkaki.com"}</strong></p>
          </td>
        </tr>

        <!-- Field table -->
        <tr>
          <td style="padding:0 32px 24px">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-top:16px;font-size:14px">
              <tr style="background:#f9fafb"><td style="padding:8px 12px;font-weight:600;color:#374151;white-space:nowrap">Name</td><td style="padding:8px 12px;color:#111827">${name}</td></tr>
              <tr><td style="padding:8px 12px;font-weight:600;color:#374151;white-space:nowrap">Phone</td><td style="padding:8px 12px;color:#111827"><a href="tel:+65${phone}" style="color:#1d4ed8;text-decoration:none">+65 ${phone}</a></td></tr>
              <tr style="background:#f9fafb"><td style="padding:8px 12px;font-weight:600;color:#374151;white-space:nowrap">Email</td><td style="padding:8px 12px;color:#111827">${email !== "—" ? `<a href="mailto:${email}" style="color:#1d4ed8;text-decoration:none">${email}</a>` : "—"}</td></tr>
              <tr><td style="padding:8px 12px;font-weight:600;color:#374151;white-space:nowrap">Loan Amount</td><td style="padding:8px 12px;color:#111827;font-weight:700">${amount}</td></tr>
              <tr style="background:#f9fafb"><td style="padding:8px 12px;font-weight:600;color:#374151;white-space:nowrap">Loan Purpose</td><td style="padding:8px 12px;color:#111827">${purpose}</td></tr>
              <tr><td style="padding:8px 12px;font-weight:600;color:#374151;white-space:nowrap">Nationality</td><td style="padding:8px 12px;color:#111827">${nationality}</td></tr>
              ${extraRows}
            </table>
          </td>
        </tr>

        ${meta.utm_source || meta.utm_medium || meta.utm_campaign ? `
        <!-- UTM -->
        <tr>
          <td style="padding:0 32px 24px">
            <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#9ca3af">Traffic Source</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;font-size:13px">
              ${meta.utm_source ? `<tr style="background:#f9fafb"><td style="padding:7px 12px;font-weight:600;color:#374151;white-space:nowrap">Source</td><td style="padding:7px 12px;color:#111827">${meta.utm_source}</td></tr>` : ""}
              ${meta.utm_medium ? `<tr><td style="padding:7px 12px;font-weight:600;color:#374151;white-space:nowrap">Medium</td><td style="padding:7px 12px;color:#111827">${meta.utm_medium}</td></tr>` : ""}
              ${meta.utm_campaign ? `<tr style="background:#f9fafb"><td style="padding:7px 12px;font-weight:600;color:#374151;white-space:nowrap">Campaign</td><td style="padding:7px 12px;color:#111827">${meta.utm_campaign}</td></tr>` : ""}
            </table>
          </td>
        </tr>` : ""}

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb">
            <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center">LendKaki &mdash; Internal Lead Notification &mdash; Do not reply</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
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
    if (landing_page?.includes("/apply-now") && process.env.RESEND_API_KEY && process.env.LEAD_NOTIFICATION_EMAIL) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      const fields = fullParsed.success ? fullParsed.data : (quickParsed.data as QuickLeadValues);
      const applicantName = "fullName" in fields ? fields.fullName : (fields as QuickLeadValues).name;

      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: process.env.LEAD_NOTIFICATION_EMAIL,
        subject: `New Loan Application — ${applicantName}`,
        html: buildLeadEmailHtml(fields, {
          landing_page,
          utm_source,
          utm_medium,
          utm_campaign,
        }),
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
