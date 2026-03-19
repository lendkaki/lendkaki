/**
 * Parses a raw Myinfo userinfo payload into a flat structure
 * suitable for inserting into the customer_profiles table.
 *
 * Myinfo fields come in varying shapes:
 *   - Simple value:  { "value": "MALE" }
 *   - Coded value:   { "code": "M", "desc": "MALE" }
 *   - Nested:        { "nbr": { "value": "91234567" } }
 *   - Complex:       { "type": "SG", "block": { "value": "123" }, ... }
 *
 * This parser extracts the **code** where available (to keep the DB
 * normalised — resolve labels via src/lib/myinfo/codes.ts), falling back to raw value.
 */

// ---------------------------------------------------------------------------
//  Tiny helpers
// ---------------------------------------------------------------------------

function val(field: unknown): string | null {
  if (field == null) return null;
  if (typeof field === "string") return field || null;
  if (typeof field === "number") return String(field);
  if (typeof field === "object") {
    const f = field as Record<string, unknown>;
    if ("value" in f) return val(f.value);
  }
  return null;
}

function code(field: unknown): string | null {
  if (field == null) return null;
  if (typeof field === "string") return field || null;
  if (typeof field === "object") {
    const f = field as Record<string, unknown>;
    if ("code" in f && f.code != null) return String(f.code);
    if ("value" in f) return val(f.value);
  }
  return null;
}

function dateVal(field: unknown): string | null {
  const v = val(field);
  if (!v) return null;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

function boolVal(field: unknown): boolean | null {
  if (field == null) return null;
  if (typeof field === "boolean") return field;
  const v = val(field);
  if (v == null) return null;
  return v.toLowerCase() === "true" || v === "Y" || v === "y";
}

function phoneVal(field: unknown): string | null {
  if (field == null) return null;
  if (typeof field === "object") {
    const f = field as Record<string, unknown>;
    if ("nbr" in f) return val(f.nbr);
    if ("value" in f) return val(f.value);
  }
  return val(field);
}

// ---------------------------------------------------------------------------
//  Main parser
// ---------------------------------------------------------------------------

export interface CustomerProfileInsert {
  sub: string;
  uinfin: string | null;
  name: string | null;
  aliasname: string | null;
  hanyupinyinname: string | null;
  hanyupinyinaliasname: string | null;
  marriedname: string | null;
  sex: string | null;
  race: string | null;
  dob: string | null;
  nationality: string | null;
  birthcountry: string | null;
  residential_status: string | null;
  marital_status: string | null;
  email: string | null;
  mobileno: string | null;
  regadd: Record<string, unknown> | null;
  housingtype: string | null;
  hdbtype: string | null;
  hdbownership: unknown[] | null;
  employment: string | null;
  employmentsector: string | null;
  occupation: string | null;
  passtype: string | null;
  passstatus: string | null;
  passexpirydate: string | null;
  noa_basic: Record<string, unknown> | null;
  cpf_contributions: Record<string, unknown> | null;
  cpf_housing_withdrawal: Record<string, unknown> | null;
  vehicles: unknown[] | null;
  ownerprivate: boolean | null;
  loan_amount: number | null;
  loan_purpose: string | null;
  raw: Record<string, unknown> | null;
}

export function parseMyinfoPayload(
  sub: string,
  rawPayload: Record<string, unknown>,
  opts?: {
    loanAmount?: number | null;
    loanPurpose?: string | null;
  }
): CustomerProfileInsert {
  const userinfo = (rawPayload.userinfo ?? rawPayload) as Record<string, unknown>;
  const p = (userinfo.person_info ?? userinfo) as Record<string, unknown>;

  const uinfin = val(p.uinfin) ?? (typeof rawPayload.uinfin === "string" ? rawPayload.uinfin : null);

  const regaddRaw = p.regadd as Record<string, unknown> | undefined;
  let regadd: Record<string, unknown> | null = null;
  if (regaddRaw && typeof regaddRaw === "object") {
    regadd = regaddRaw;
  }

  const hdbownershipRaw = p.hdbownership;
  let hdbownership: unknown[] | null = null;
  if (Array.isArray(hdbownershipRaw) && hdbownershipRaw.length > 0) {
    hdbownership = hdbownershipRaw;
  } else if (hdbownershipRaw && typeof hdbownershipRaw === "object" && !Array.isArray(hdbownershipRaw)) {
    hdbownership = [hdbownershipRaw];
  }

  const cpfRaw = p.cpfcontributions;
  let cpfContributions: Record<string, unknown> | null = null;
  if (cpfRaw && typeof cpfRaw === "object" && !Array.isArray(cpfRaw)) {
    cpfContributions = cpfRaw as Record<string, unknown>;
  } else if (Array.isArray(cpfRaw) && cpfRaw.length > 0) {
    cpfContributions = { history: cpfRaw } as Record<string, unknown>;
  }

  const cpfHousingRaw = p.cpfhousingwithdrawal ?? p.cpfwithdrawal;
  let cpfHousingWithdrawal: Record<string, unknown> | null = null;
  if (cpfHousingRaw && typeof cpfHousingRaw === "object") {
    cpfHousingWithdrawal = cpfHousingRaw as Record<string, unknown>;
  }

  const noaRaw = p["noa-basic"] ?? p.noabsc ?? p.noa;
  let noaBasic: Record<string, unknown> | null = null;
  if (noaRaw && typeof noaRaw === "object") {
    noaBasic = noaRaw as Record<string, unknown>;
  }

  const vehiclesRaw = p.vehicles;
  let vehicles: unknown[] | null = null;
  if (Array.isArray(vehiclesRaw) && vehiclesRaw.length > 0) {
    vehicles = vehiclesRaw;
  }

  return {
    sub,
    uinfin,
    name: val(p.name),
    aliasname: val(p.aliasname),
    hanyupinyinname: val(p.hanyupinyinname),
    hanyupinyinaliasname: val(p.hanyupinyinaliasname),
    marriedname: val(p.marriedname),
    sex: code(p.sex),
    race: code(p.race),
    dob: dateVal(p.dob),
    nationality: code(p.nationality),
    birthcountry: code(p.birthcountry),
    residential_status: code(p.residentialstatus) ?? code(p.residential),
    marital_status: code(p.marital),
    email: val(p.email) ?? val(p.emailaddress),
    mobileno: phoneVal(p.mobileno),
    regadd,
    housingtype: code(p.housingtype),
    hdbtype: code(p.hdbtype),
    hdbownership,
    employment: val(p.employment),
    employmentsector: code(p.employmentsector),
    occupation: code(p.occupation),
    passtype: code(p.passtype),
    passstatus: code(p.passstatus),
    passexpirydate: dateVal(p.passexpirydate),
    noa_basic: noaBasic,
    cpf_contributions: cpfContributions,
    cpf_housing_withdrawal: cpfHousingWithdrawal,
    vehicles,
    ownerprivate: boolVal(p.ownerprivate),
    loan_amount: opts?.loanAmount ?? null,
    loan_purpose: opts?.loanPurpose ?? null,
    raw: rawPayload,
  };
}
