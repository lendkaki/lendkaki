"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const partners = [
  { name: "DBS", abbr: "DBS" },
  { name: "OCBC", abbr: "OCBC" },
  { name: "UOB", abbr: "UOB" },
  { name: "Standard Chartered", abbr: "SC" },
  { name: "HSBC", abbr: "HSBC" },
  { name: "Citibank", abbr: "Citi" },
  { name: "POSB", abbr: "POSB" },
  { name: "Maybank", abbr: "MB" },
  { name: "RHB", abbr: "RHB" },
  { name: "Funding Societies", abbr: "FS" },
];

function LogoItem({ name, abbr }: { name: string; abbr: string }) {
  return (
    <div className="flex shrink-0 items-center gap-3 rounded-xl border border-border/50 bg-card/50 px-6 py-3.5 transition-opacity hover:opacity-100 opacity-60">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
        {abbr.slice(0, 2)}
      </div>
      <span className="whitespace-nowrap text-sm font-medium text-muted-foreground">
        {name}
      </span>
    </div>
  );
}

export function PartnersScroller() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const doubledPartners = [...partners, ...partners];

  return (
    <section ref={ref} className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center text-sm font-medium text-muted-foreground"
        >
          Trusted by Singapore&apos;s leading banks and lenders
        </motion.p>
      </div>

      {/* Row 1 - scrolls left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="marquee"
      >
        <div className="marquee-track">
          {doubledPartners.map((partner, i) => (
            <LogoItem key={`r1-${i}`} name={partner.name} abbr={partner.abbr} />
          ))}
        </div>
      </motion.div>

      {/* Row 2 - scrolls right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="marquee mt-4"
      >
        <div className="marquee-track-reverse">
          {[...doubledPartners].reverse().map((partner, i) => (
            <LogoItem key={`r2-${i}`} name={partner.name} abbr={partner.abbr} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
