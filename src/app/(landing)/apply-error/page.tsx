"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const ERROR_MESSAGES: Record<string, { title: string; description: string }> = {
  cancelled: {
    title: "Singpass login was cancelled",
    description:
      "It looks like the Singpass login was cancelled. No worries — you can try again or apply manually instead.",
  },
  login_failed: {
    title: "Singpass login failed",
    description:
      "We couldn't complete the login with Singpass. This may be a temporary issue. Please try again or apply manually.",
  },
  session_expired: {
    title: "Your session has expired",
    description:
      "Your session timed out before we could complete the process. Please start again.",
  },
  server_error: {
    title: "Something went wrong",
    description:
      "We encountered an unexpected error while connecting to Singpass. Please try again in a moment.",
  },
};

const DEFAULT_ERROR = {
  title: "Something went wrong",
  description:
    "We ran into an issue processing your request. You can try again with Singpass or apply manually.",
};

function ApplyErrorContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("reason") ?? "unknown";
  const { title, description } =
    ERROR_MESSAGES[errorCode] ?? DEFAULT_ERROR;

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3673ae]">
              <span className="text-sm font-bold text-white">LK</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#3673ae]">
              LendKaki
            </span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
            <Shield className="h-4 w-4 text-primary" />
            <span>256-bit SSL Encrypted</span>
          </div>
        </div>
      </header>

      <main className="flex min-h-screen items-center justify-center px-4 pt-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <AlertTriangle className="h-8 w-8 text-amber-600" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            {description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="gap-2 rounded-full px-6">
              <Link href="/apply">
                Try again with Singpass
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="gap-2 rounded-full px-6"
            >
              <Link href="/apply-now">Apply manually instead</Link>
            </Button>
          </div>

          <p className="mt-6 text-xs text-slate-400">
            Need help?{" "}
            <a
              href="https://wa.me/6589009628"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              Chat with us on WhatsApp
            </a>
          </p>
        </motion.div>
      </main>
    </div>
  );
}

export default function ApplyErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <span className="text-sm text-slate-400">Loading…</span>
        </div>
      }
    >
      <ApplyErrorContent />
    </Suspense>
  );
}
