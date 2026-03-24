/**
 * Single source of truth for Myinfo coded values.
 * Import this wherever you need code → label resolution (client or server).
 */

export const MYINFO_CODE_LABELS: Record<string, Record<string, string>> = {
  sex: { F: "Female", M: "Male", U: "Unknown" },
  marital: {
    "1": "Single",
    "2": "Married",
    "3": "Widowed",
    "5": "Divorced",
  },
  residential: {
    C: "Singapore Citizen",
    P: "Permanent Resident",
    A: "Foreigner",
    U: "Unknown",
    N: "Not Applicable",
  },
  housingtype: {
    "121": "Detached House",
    "122": "Semi-Detached House",
    "123": "Terrace House",
    "131": "Condominium",
    "132": "Executive Condominium",
    "139": "Apartment",
  },
  hdbtype: {
    "111": "1-Room Flat (HDB)",
    "112": "2-Room Flat (HDB)",
    "113": "3-Room Flat (HDB)",
    "114": "4-Room Flat (HDB)",
    "115": "5-Room Flat (HDB)",
    "116": "Executive Flat (HDB)",
    "118": "Studio Apartment (HDB)",
  },
  passtype: {
    P1Pass: "Employment Pass (P1)",
    P2Pass: "Employment Pass (P2)",
    QPass: "Employment Pass (Q)",
    SPass: "S Pass",
    RPass: "Work Permit",
    STP: "Student's Pass",
    DP: "Dependent Pass",
    LTVP: "Long-Term Visit Pass",
  },
};

export function resolveCode(
  category: string,
  code: string | null | undefined
): string {
  if (!code) return "—";
  return MYINFO_CODE_LABELS[category]?.[code] ?? code;
}

export function formatAddress(regadd: Record<string, unknown> | null): string {
  if (!regadd) return "—";
  const v = (key: string) => {
    const field = regadd[key];
    if (!field) return "";
    if (typeof field === "string") return field;
    if (typeof field === "object" && field !== null && "value" in field)
      return String((field as any).value ?? "");
    return "";
  };

  const parts = [
    v("block") ? `Blk ${v("block")}` : "",
    v("street"),
    v("floor") && v("unit") ? `#${v("floor")}-${v("unit")}` : "",
    v("building"),
    v("postal") ? `Singapore ${v("postal")}` : "",
    v("country") && v("country") !== "SG" ? v("country") : "",
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" ") : "—";
}
