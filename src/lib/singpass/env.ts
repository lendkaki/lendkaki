import { z } from "zod";

const jwkJson = z
  .string()
  .min(2)
  .transform((s) => JSON.parse(s) as unknown);

export const singpassEnvSchema = z.object({
  SINGPASS_ISSUER_URL: z.string().url(),
  SINGPASS_CLIENT_ID: z.string().min(2),
  SINGPASS_REDIRECT_URI: z.string().url(),
  SINGPASS_SCOPES: z.string().min(1),
  SINGPASS_JWKS_SIG_PRIVATE: jwkJson,
  SINGPASS_JWKS_ENC_PRIVATE: jwkJson.optional(),
  APP_BASE_URL: z.string().url(),
});

export type SingpassEnv = z.infer<typeof singpassEnvSchema>;

export function getSingpassEnv(): SingpassEnv {
  const parsed = singpassEnvSchema.safeParse({
    SINGPASS_ISSUER_URL: process.env.SINGPASS_ISSUER_URL,
    SINGPASS_CLIENT_ID: process.env.SINGPASS_CLIENT_ID,
    SINGPASS_REDIRECT_URI: process.env.SINGPASS_REDIRECT_URI,
    SINGPASS_SCOPES: process.env.SINGPASS_SCOPES,
    SINGPASS_JWKS_SIG_PRIVATE: process.env.SINGPASS_JWKS_SIG_PRIVATE,
    SINGPASS_JWKS_ENC_PRIVATE: process.env.SINGPASS_JWKS_ENC_PRIVATE,
    APP_BASE_URL: process.env.APP_BASE_URL,
  });
  if (!parsed.success) {
    throw new Error(
      `Invalid Singpass env: ${parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")}`
    );
  }
  return parsed.data;
}

