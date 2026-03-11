import * as openidClient from "openid-client";
import { getSingpassEnv } from "@/lib/singpass/env";

type ImportedKey = { kid: string; alg: string; key: CryptoKey };

let cached:
  | {
      config: openidClient.Configuration;
      dpop: ReturnType<typeof openidClient.getDPoPHandle>;
      initializedAt: number;
    }
  | undefined;

const ONE_HOUR_MS = 60 * 60 * 1000;

async function importSigKeys(): Promise<{
  publicKey: ImportedKey;
  privateKey: ImportedKey;
}> {
  const env = getSingpassEnv();
  const jwk = env.SINGPASS_JWKS_SIG_PRIVATE as any;
  if (!jwk?.kid || !jwk?.alg) {
    throw new Error("SINGPASS_JWKS_SIG_PRIVATE must include kid and alg");
  }

  const publicJwk = { ...jwk };
  delete (publicJwk as any).d;

  const publicKey: ImportedKey = {
    kid: jwk.kid,
    alg: jwk.alg,
    key: await crypto.subtle.importKey(
      "jwk",
      publicJwk,
      { name: "ECDSA", namedCurve: "P-256" },
      true,
      ["verify"]
    ),
  };

  const privateKey: ImportedKey = {
    kid: jwk.kid,
    alg: jwk.alg,
    key: await crypto.subtle.importKey(
      "jwk",
      jwk,
      { name: "ECDSA", namedCurve: "P-256" },
      false,
      ["sign"]
    ),
  };

  return { publicKey, privateKey };
}

async function importEncKey(): Promise<ImportedKey | null> {
  const env = getSingpassEnv();
  const jwk = env.SINGPASS_JWKS_ENC_PRIVATE as any;
  if (!jwk) return null;
  if (!jwk?.kid || !jwk?.alg) {
    throw new Error("SINGPASS_JWKS_ENC_PRIVATE must include kid and alg");
  }
  return {
    kid: jwk.kid,
    alg: jwk.alg,
    key: await crypto.subtle.importKey(
      "jwk",
      jwk,
      { name: "ECDH", namedCurve: "P-256" },
      false,
      ["deriveKey", "deriveBits"]
    ),
  };
}

function buildDpopHandle(opts: {
  config: openidClient.Configuration;
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}) {
  return openidClient.getDPoPHandle(
    opts.config,
    { publicKey: opts.publicKey, privateKey: opts.privateKey },
    {
      [openidClient.modifyAssertion]: (_header, payload) => {
        // Singpass expects DPoP JWT validity <= 2 minutes
        if (typeof (payload as any).iat === "number") {
          (payload as any).exp = (payload as any).iat + 120;
        }
      },
    }
  );
}

export async function getSingpassClient() {
  if (cached && Date.now() - cached.initializedAt < ONE_HOUR_MS) return cached;

  const env = getSingpassEnv();
  const { publicKey, privateKey } = await importSigKeys();
  const encKey = await importEncKey();

  const config = await openidClient.discovery(
    new URL(env.SINGPASS_ISSUER_URL),
    env.SINGPASS_CLIENT_ID,
    undefined,
    // openid-client expects a CryptoKey/KeyObject, but Singpass demo flow also relies on kid/alg metadata.
    // Cast to satisfy TS while preserving runtime behavior used in the reference implementation.
    openidClient.PrivateKeyJwt(
      { kid: privateKey.kid, alg: privateKey.alg, key: privateKey.key } as any
    )
  );

  if (encKey) {
    openidClient.enableDecryptingResponses(
      config,
      ["A256GCM", "A256CBC-HS512"],
      { kid: encKey.kid, alg: encKey.alg, key: encKey.key } as any
    );
  }

  const dpop = buildDpopHandle({
    config,
    publicKey: publicKey.key,
    privateKey: privateKey.key,
  });

  cached = { config, dpop, initializedAt: Date.now() };
  return cached;
}

export function getDpopOptions(dpop: ReturnType<typeof openidClient.getDPoPHandle>) {
  return { DPoP: dpop };
}

