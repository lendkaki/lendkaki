"use client";

import { useEffect, useMemo, useState } from "react";

type UserProfile = Record<string, any>;

function safeGet(obj: any, path: string) {
  return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

function fieldValue(userInfo: any, key: string) {
  // Myinfo can return nested { value, desc, ... } structures
  return safeGet(userInfo, `${key}.value`) ?? safeGet(userInfo, `${key}.desc`) ?? safeGet(userInfo, key);
}

export default function SingpassPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [raw, setRaw] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const myinfo = useMemo(() => {
    if (!user) return null;
    return user.person_info ?? user;
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/user")
      .then(async (res) => {
        if (res.status === 200) return await res.json();
        throw new Error("not_logged_in");
      })
      .then((data) => {
        if (cancelled) return;
        setUser(data);
        setRaw(JSON.stringify(data, null, 2));
        setError(null);
      })
      .catch(() => {
        if (cancelled) return;
        setUser(null);
        setRaw("");
        setError(null);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function logout() {
    setError(null);
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      if (!res.ok) throw new Error("logout_failed");
      setUser(null);
      setRaw("");
    } catch {
      setError("Logout failed. Please try again.");
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Singpass / Myinfo</h1>

      <div className="mt-4 flex items-center gap-3">
        <a
          className="rounded-md bg-primary px-4 py-2 text-white"
          href="/login"
        >
          Log in with Singpass
        </a>
        <button
          className="rounded-md border px-4 py-2"
          onClick={logout}
          disabled={!user}
        >
          Log out
        </button>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
      ) : user ? (
        <section className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold">Profile</h2>

          <div className="grid grid-cols-1 gap-2 rounded-lg border p-4 text-sm">
            <Row label="Name" value={fieldValue(myinfo, "name") ?? user.name} />
            <Row label="UINFIN" value={fieldValue(myinfo, "uinfin") ?? user.sub} />
            <Row label="Alias name" value={fieldValue(myinfo, "aliasname")} />
            <Row label="Email" value={fieldValue(myinfo, "email")} />
            <Row label="Mobile no" value={safeGet(myinfo, "mobileno.nbr.value") ?? fieldValue(myinfo, "mobileno")} />
            <Row label="Birth country" value={fieldValue(myinfo, "birthcountry")} />
            <Row label="Nationality" value={fieldValue(myinfo, "nationality")} />
            <Row label="Race" value={fieldValue(myinfo, "race")} />
            <Row label="Sex" value={fieldValue(myinfo, "sex")} />
            <Row label="Partial UINFIN" value={fieldValue(myinfo, "partialuinfin")} />
          </div>

          <details className="rounded-lg border p-4">
            <summary className="cursor-pointer text-sm font-medium">
              Raw JSON (session user)
            </summary>
            <pre className="mt-3 overflow-auto whitespace-pre-wrap break-words text-xs">
              {raw}
            </pre>
          </details>
        </section>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          You are not logged in.
        </p>
      )}

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
    </main>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  const v =
    value === undefined || value === null || value === "" ? "[not returned]" : String(value);
  return (
    <div className="grid grid-cols-[180px_1fr] gap-3">
      <strong>{label}</strong>
      <div>{v}</div>
    </div>
  );
}

