"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Fingerprint } from "lucide-react";

const rotatingWords = [
  "personal needs",
  "business growth",
  "debt freedom",
  "home renovation",
  "your wedding",
];

function RotatingText() {
  const [index, setIndex] = useState(0);

  const advance = useCallback(() => {
    setIndex((prev) => (prev + 1) % rotatingWords.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(advance, 2500);
    return () => clearInterval(interval);
  }, [advance]);

  return (
    <span className="relative inline-flex h-[1.15em] items-end overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={rotatingWords[index]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block text-white/90"
        >
          {rotatingWords[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function HeroCards() {
  return (
    <div className="relative mx-auto h-[340px] w-full max-w-md sm:h-[400px] lg:max-w-none">
      {/* Card 3 (back) */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotate: 6 }}
        animate={{ opacity: 0.5, y: 0, rotate: 6 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="absolute right-0 top-8 h-52 w-64 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm sm:right-4 sm:h-60 sm:w-72"
      >
        <div className="h-3 w-20 rounded-full bg-white/20" />
        <div className="mt-4 h-3 w-14 rounded-full bg-white/15" />
        <div className="mt-6 font-mono text-3xl font-bold text-white/30">
          5.0%
        </div>
      </motion.div>

      {/* Card 2 (middle) */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotate: 2 }}
        animate={{ opacity: 0.75, y: 0, rotate: 2 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="absolute right-6 top-14 h-52 w-64 rounded-2xl border border-white/15 bg-white/15 p-5 backdrop-blur-sm sm:right-10 sm:h-60 sm:w-72"
      >
        <div className="h-3 w-24 rounded-full bg-white/25" />
        <div className="mt-4 h-3 w-16 rounded-full bg-white/20" />
        <div className="mt-6 font-mono text-3xl font-bold text-white/40">
          4.18%
        </div>
      </motion.div>

      {/* Card 1 (front) */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: -2 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="absolute right-12 top-20 h-52 w-64 rounded-2xl border border-white/20 bg-white/20 p-6 shadow-2xl shadow-black/10 backdrop-blur-md sm:right-16 sm:h-60 sm:w-72"
      >
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-white/30" />
          <div>
            <div className="h-3 w-20 rounded-full bg-white/40" />
            <div className="mt-1.5 h-2 w-14 rounded-full bg-white/25" />
          </div>
        </div>
        <div className="mt-5">
          <div className="text-xs font-medium text-white/60">
            Interest Rate (p.a.)
          </div>
          <div className="mt-1 font-mono text-4xl font-bold text-white">
            3.48%
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <div className="rounded-full bg-white/20 px-3 py-1 text-xs text-white/70">
            No fees
          </div>
          <div className="rounded-full bg-white/20 px-3 py-1 text-xs text-white/70">
            Same-day
          </div>
        </div>
      </motion.div>

      {/* Floating rate badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          delay: 1,
          type: "spring",
          stiffness: 200,
        }}
        className="absolute left-0 top-4 z-10 rounded-xl border border-white/20 bg-white/20 px-4 py-3 backdrop-blur-md sm:left-4"
      >
        <div className="text-xs font-medium text-white/70">
          Lowest rate found
        </div>
        <div className="font-mono text-2xl font-bold text-white">
          2.0% <span className="text-sm font-normal text-white/60">p.a.</span>
        </div>
      </motion.div>

      {/* Floating approval badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          delay: 1.3,
          type: "spring",
          stiffness: 200,
        }}
        className="absolute bottom-6 left-4 z-10 rounded-xl border border-white/20 bg-white/20 px-4 py-3 backdrop-blur-md sm:left-8"
      >
        <div className="text-xs font-medium text-white/70">Avg. approval</div>
        <div className="font-mono text-2xl font-bold text-white">
          &lt;24h
        </div>
      </motion.div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero-gradient relative overflow-hidden pt-16">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 pb-16 pt-20 sm:pb-24 sm:pt-28 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:pt-32">
          {/* Left: Text content */}
          <div>
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            >
              The{" "}
              <span className="hero-highlight relative inline-block rounded-lg bg-white/20 px-3 py-0.5 backdrop-blur-sm">
                fastest
              </span>
              <br />
              loan platform for
              <br />
              <RotatingText />
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg"
            >
              Compare 50+ licensed lenders. One application.
              No credit score impact.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4"
            >
              <motion.a
                href="#apply"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-7 text-sm font-semibold text-primary shadow-lg shadow-black/10 transition-colors hover:bg-white/90"
              >
                Get My Best Rates
                <ArrowRight className="h-4 w-4" />
              </motion.a>
              <motion.a
                href="#how-it-works"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex h-12 items-center justify-center rounded-lg border border-white/30 px-7 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                See How It Works
              </motion.a>
            </motion.div>

            {/* Announcement banner */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="mt-8 inline-flex max-w-md items-start gap-3 rounded-xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/20">
                <Fingerprint className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Singpass integration coming soon.
                </p>
                <p className="mt-0.5 text-xs text-white/60">
                  Auto-fill your details instantly.{" "}
                  <a
                    href="#apply"
                    className="font-medium text-white/80 underline underline-offset-2 transition-colors hover:text-white"
                  >
                    Learn more &rarr;
                  </a>
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right: Visual element */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
          >
            <HeroCards />
          </motion.div>
        </div>
      </div>

      {/* Bottom fade to white */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
