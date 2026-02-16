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
  Twitter,
  Linkedin,
} from "lucide-react";

const data = {
  company: {
    name: "LendKaki",
    description:
      "Singapore's most trusted loan comparison platform. Compare rates from 50+ licensed lenders and get your best deal in minutes. Fast, free, and secure.",
  },
  social: [
    { icon: Facebook, label: "Facebook", href: "#" },
    { icon: Instagram, label: "Instagram", href: "#" },
    { icon: Twitter, label: "Twitter", href: "#" },
    { icon: Linkedin, label: "LinkedIn", href: "#" },
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
    { text: "Our Partners", href: "#partners" },
    { text: "Blog", href: "#blog" },
  ],
  resources: [
    { text: "FAQs", href: "#faq" },
    { text: "Loan Calculator", href: "#apply" },
    { text: "Guides & Tips", href: "#guides" },
    { text: "Contact Us", href: "#contact" },
  ],
  contact: [
    { icon: Mail, text: "support@lendkaki.sg", href: "mailto:support@lendkaki.sg" },
    { icon: Phone, text: "+65 6123 4567", href: "tel:+6561234567" },
    {
      icon: MapPin,
      text: "1 Raffles Place, Singapore 048616",
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
      className="mt-16 w-full place-self-end rounded-t-xl bg-secondary dark:bg-secondary/20"
    >
      <div className="mx-auto max-w-screen-xl px-4 pb-6 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Brand + Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center gap-2 text-primary sm:justify-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">
                  LK
                </span>
              </div>
              <span className="text-2xl font-semibold">{data.company.name}</span>
            </div>

            <p className="mt-6 max-w-md text-center leading-relaxed text-foreground/50 sm:max-w-xs sm:text-left">
              {data.company.description}
            </p>

            <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
              {data.social.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-primary transition hover:text-primary/80"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="size-6" />
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
              <p className="text-lg font-medium">Loan Types</p>
              <ul className="mt-8 space-y-4 text-sm">
                {data.loanTypes.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      className="text-secondary-foreground/70 transition hover:text-foreground"
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
              <p className="text-lg font-medium">Company</p>
              <ul className="mt-8 space-y-4 text-sm">
                {data.company_links.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      className="text-secondary-foreground/70 transition hover:text-foreground"
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
              <p className="text-lg font-medium">Resources</p>
              <ul className="mt-8 space-y-4 text-sm">
                {data.resources.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      className="text-secondary-foreground/70 transition hover:text-foreground"
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
              <p className="text-lg font-medium">Contact Us</p>
              <ul className="mt-8 space-y-4 text-sm">
                {data.contact.map(({ icon: Icon, text, href, isAddress }) => (
                  <li key={text}>
                    {href ? (
                      <a
                        className="flex items-center justify-center gap-1.5 sm:justify-start"
                        href={href}
                      >
                        <Icon className="size-5 shrink-0 text-primary shadow-sm" />
                        <span className="flex-1 text-secondary-foreground/70 transition hover:text-foreground">
                          {text}
                        </span>
                      </a>
                    ) : (
                      <div className="flex items-center justify-center gap-1.5 sm:justify-start">
                        <Icon className="size-5 shrink-0 text-primary shadow-sm" />
                        {isAddress ? (
                          <address className="-mt-0.5 flex-1 not-italic text-secondary-foreground/70 transition">
                            {text}
                          </address>
                        ) : (
                          <span className="flex-1 text-secondary-foreground/70 transition">
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

        <div className="mt-12 border-t border-border/50 pt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center sm:flex sm:justify-between sm:text-left"
          >
            <p className="text-secondary-foreground/70 order-first text-sm transition sm:mt-0">
              &copy; {new Date().getFullYear()} LendKaki. All rights reserved.
            </p>

            <p className="mt-4 text-sm sm:mt-0">
              <span className="block text-secondary-foreground/70 sm:inline">
                Licensed loan comparison platform
              </span>
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-6 text-center text-xs leading-relaxed text-secondary-foreground/60"
          >
            LendKaki is a loan comparison platform. We are not a lender. All loan
            products are offered by licensed banks and financial institutions
            regulated by the Monetary Authority of Singapore (MAS) and/or the
            Ministry of Law (MinLaw). Rates shown are indicative and subject to
            change.
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
