"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
  Facebook,
  Instagram,
} from "lucide-react";

const data = {
  company: {
    name: "LendKaki",
    description:
      "Singapore's most trusted loan comparison platform. Compare rates from banks and licensed financial institutions. Fast, free, and secure.",
  },
  social: [
    { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/share/1Auajw8YMF/" },
    { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/lendkaki.sg?igsh=NWRqYnoxcmpoMzBt" },
    { icon: null, label: "TikTok", href: "https://www.tiktok.com/@lendkaki.sg" },
  ],
  loanTypes: [
    { text: "Personal Loans", href: "#loans" },
    { text: "Business Loans", href: "#loans" },
    { text: "Bridging Loans", href: "#loans" },
    { text: "Debt Consolidation", href: "#loans" },
  ],
  company_links: [
    { text: "About Us", href: "#about" },
    { text: "How It Works", href: "#how-it-works" },
  ],
  resources: [
    { text: "FAQs", href: "/#faq" },
    { text: "Loan Calculator", href: "/loan-calculator" },
    { text: "PDPA Compliance", href: "/pdpa" },
  ],
  contact: [
    { icon: Mail, text: "support@lendkaki.com", href: "mailto:support@lendkaki.com" },
    { icon: Phone, text: "+65 8900 9628", href: "tel:+6589009628" },
    {
      icon: MapPin,
      text: "2 Venture Drive, #19-21, Vision Exchange, Singapore 608526",
      isAddress: true,
    },
  ],
};

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer
      ref={ref}
      className="mt-16 w-full place-self-end rounded-t-xl bg-[#07172a] text-white dark:bg-[#07172a]"
    >
      <div className="mx-auto max-w-screen-xl px-4 pb-6 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Brand + Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="mx-auto flex max-w-md flex-col lg:mx-0 lg:max-w-xs">
              <span className="font-[family-name:var(--font-vampiro)] w-full text-center text-5xl font-medium text-white lg:text-left lg:text-7xl">
                {data.company.name}
              </span>
              <p className="mt-6 text-center leading-relaxed text-white/60 lg:text-left">
                {data.company.description}
              </p>
            </div>

            <ul className="mt-8 flex justify-center gap-6 lg:justify-start md:gap-8">
              {data.social.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 transition hover:text-white"
                  >
                    <span className="sr-only">{label}</span>
                    {Icon ? (
                      <Icon className="size-6" />
                    ) : (
                      /* TikTok SVG */
                      <svg className="size-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
                      </svg>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Link Columns */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
            {/* Loan Types */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center sm:text-left"
            >
              <p className="text-lg font-medium text-white">Loan Types</p>
              <ul className="mt-8 space-y-4 text-sm">
                {data.loanTypes.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      className="text-white/60 transition hover:text-white"
                      href={href}
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Company */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="text-center sm:text-left"
            >
              <p className="text-lg font-medium text-white">Company</p>
              <ul className="mt-8 space-y-4 text-sm">
                {data.company_links.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      className="text-white/60 transition hover:text-white"
                      href={href}
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.26 }}
              className="text-center sm:text-left"
            >
              <p className="text-lg font-medium text-white">Resources</p>
              <ul className="mt-8 space-y-4 text-sm">
                {data.resources.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      className="text-white/60 transition hover:text-white"
                      href={href}
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.34 }}
              className="text-center sm:text-left"
            >
              <p className="text-lg font-medium text-white">Contact Us</p>
              <ul className="mt-8 flex flex-col items-center space-y-4 text-sm sm:items-start">
                {data.contact.map(({ icon: Icon, text, href, isAddress }) => (
                  <li key={text}>
                    {href ? (
                      <a
                        className="flex items-start gap-1.5"
                        href={href}
                      >
                        <Icon className="mt-0.5 size-5 shrink-0 text-primary shadow-sm" />
                        <span className="text-white/60 transition hover:text-white">
                          {text}
                        </span>
                      </a>
                    ) : (
                      <div className="flex items-start gap-1.5">
                        <Icon className="mt-0.5 size-5 shrink-0 text-primary shadow-sm" />
                        {isAddress ? (
                          <address className="not-italic text-white/60 transition">
                            {text}
                          </address>
                        ) : (
                          <span className="text-white/60 transition">
                            {text}
                          </span>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center sm:flex sm:justify-between sm:text-left"
          >
            <p className="order-first text-sm text-white/50 transition sm:mt-0">
              &copy; 2026 LendKaki. All rights reserved.
            </p>

            <p className="mt-4 text-sm sm:mt-0">
              <span className="block text-white/50 sm:inline">
                Licensed loan comparison platform
              </span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-6 space-y-2 text-center text-xs leading-relaxed text-white/40"
          >
            <p>
              LendKaki is managed and operated by Lendkaki Pay Pte. Ltd. (UEN: 202607335C).
            </p>
            <p>
              LendKaki is a loan comparison platform. We are not a lender. All loan
              products are offered by licensed banks and financial institutions
              regulated by the Monetary Authority of Singapore (MAS) and/or the
              Ministry of Law (MinLaw). Rates shown are indicative and subject to
              change.
            </p>
            <p className="pt-1">
              <Link href="/terms" className="hover:text-white/70 underline underline-offset-2">Terms of Use</Link>
              {" · "}
              <Link href="/privacy" className="hover:text-white/70 underline underline-offset-2">Privacy Policy</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
