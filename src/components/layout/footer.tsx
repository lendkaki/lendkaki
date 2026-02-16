"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  "Loan Types": [
    { label: "Personal Loans", href: "#loans" },
    { label: "Business Loans", href: "#loans" },
    { label: "Bridging Loans", href: "#loans" },
    { label: "Debt Consolidation", href: "#loans" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Contact", href: "#" },
    { label: "Careers", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Disclaimer", href: "#" },
  ],
};

export function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer ref={ref} className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">
                  LK
                </span>
              </div>
              <span className="text-lg font-bold tracking-tight">LendKaki</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Singapore&apos;s trusted loan aggregator. Compare rates from 50+
              licensed lenders in one place.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links], colIndex) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.1 + colIndex * 0.08,
              }}
            >
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <Separator className="my-8" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left"
        >
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} LendKaki. All rights reserved.
          </p>
          <p className="max-w-xl text-xs leading-relaxed text-muted-foreground">
            LendKaki is a loan comparison platform. We are not a lender. All loan
            products are offered by licensed banks and financial institutions
            regulated by the Monetary Authority of Singapore (MAS) and/or the
            Ministry of Law (MinLaw). Rates shown are indicative and subject to
            change.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
