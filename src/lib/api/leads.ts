import type { QuickLeadValues } from "@/lib/schemas";

export type SubmitLeadOptions = {
  landing_page?: string;
  variant?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

/**
 * Submit a quick lead to /api/leads (saves to Supabase when configured).
 * Use from any form that collects QuickLeadValues (home, apply, apply-now, loan pages).
 */
export async function submitLead(
  data: QuickLeadValues,
  options?: SubmitLeadOptions
): Promise<{ success: boolean; error?: string }> {
  const landing_page =
    options?.landing_page ??
    (typeof window !== "undefined" ? window.location.pathname : "");
  const params =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;

  const body = {
    ...data,
    agreedToTerms: data.agreedToTerms ?? true,
    landing_page: landing_page || undefined,
    variant: options?.variant,
    utm_source: options?.utm_source ?? params?.get("utm_source") ?? undefined,
    utm_medium: options?.utm_medium ?? params?.get("utm_medium") ?? undefined,
    utm_campaign:
      options?.utm_campaign ?? params?.get("utm_campaign") ?? undefined,
    utm_content:
      options?.utm_content ?? params?.get("utm_content") ?? undefined,
    utm_term: options?.utm_term ?? params?.get("utm_term") ?? undefined,
  };

  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (process.env.NEXT_PUBLIC_LEADS_API_KEY) {
    headers["x-api-key"] = process.env.NEXT_PUBLIC_LEADS_API_KEY;
  }

  const res = await fetch("/api/leads", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      success: false,
      error: json.error ?? "Failed to save lead",
    };
  }
  return { success: true };
}

/**
 * Submit lead in the background (fire-and-forget). Use for optimistic UI:
 * show success/matching modal immediately, then call this so the save feels instant.
 * Optional onFailure callback if the save fails (e.g. show a subtle toast).
 */
export function submitLeadInBackground(
  data: QuickLeadValues,
  options?: SubmitLeadOptions & { onFailure?: (error: string) => void }
): void {
  const { onFailure, ...submitOptions } = options ?? {};
  submitLead(data, submitOptions).then((result) => {
    if (!result.success && onFailure) onFailure(result.error ?? "Failed to save");
  });
}
