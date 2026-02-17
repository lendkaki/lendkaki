"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import Image from "next/image";

const rotatingWords = [
  "personal needs",
  "business growth",
  "debt freedom",
  "renovation",
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
    <span className="relative inline-flex h-[1.15em] items-end overflow-hidden whitespace-nowrap">
      <AnimatePresence mode="wait">
        <motion.span
          key={rotatingWords[index]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block text-foreground"
        >
          {rotatingWords[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function SingpassBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="flex items-center gap-2"
    >
      <span className="text-xs font-medium text-slate-500 sm:text-sm">
        Apply securely with
      </span>
      <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur-sm">
        <span className="text-xs font-bold tracking-tight text-[#C4353A] sm:text-sm">
          Singpass
        </span>
        <span className="text-slate-300">|</span>
        <span className="text-xs font-bold tracking-tight text-[#6038D1] sm:text-sm">
          Myinfo
        </span>
      </div>
    </motion.div>
  );
}

function HeroMascot() {
  return (
    <div className="relative mx-auto flex items-end justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div
          className="relative h-auto w-[280px] sm:w-[320px] lg:w-[400px] xl:w-[460px]"
          style={{
            WebkitMaskImage: "radial-gradient(ellipse 80% 85% at 50% 50%, black 55%, transparent 95%)",
            maskImage: "radial-gradient(ellipse 80% 85% at 50% 50%, black 55%, transparent 95%)",
          }}
        >
          <Image
            src="/mascot-otter.png"
            alt="LendKaki otter mascot"
            width={480}
            height={480}
            className="h-auto w-full"
            priority
          />
        </div>

        {/* Floating rate badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1, type: "spring", stiffness: 200 }}
          className="absolute -left-2 top-8 z-10 rounded-xl border border-white/40 bg-white/70 px-3 py-2 shadow-lg backdrop-blur-md sm:-left-6 sm:top-12 sm:px-4 sm:py-3"
        >
          <div className="text-[10px] font-medium text-slate-600 sm:text-xs">
            Lowest rate found
          </div>
          <div className="font-mono text-lg font-bold text-slate-900 sm:text-2xl">
            2.0% <span className="text-[10px] font-normal text-slate-500 sm:text-sm">p.a.</span>
          </div>
        </motion.div>

        {/* Floating approval badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.3, type: "spring", stiffness: 200 }}
          className="absolute -right-2 bottom-16 z-10 rounded-xl border border-white/40 bg-white/70 px-3 py-2 shadow-lg backdrop-blur-md sm:-right-6 sm:bottom-24 sm:px-4 sm:py-3"
        >
          <div className="text-[10px] font-medium text-slate-600 sm:text-xs">Avg. approval</div>
          <div className="font-mono text-lg font-bold text-slate-900 sm:text-2xl">
            &lt;24h
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero-gradient relative overflow-hidden pt-16">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-6 pb-4 pt-16 sm:gap-8 sm:pb-6 sm:pt-24 lg:grid-cols-[1.2fr_1fr] lg:gap-12 lg:pb-8 lg:pt-28">
          {/* Left: Text content */}
          <div className="text-center lg:text-left">
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl font-bold leading-[1.2] tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
            >
              The{" "}
              <span className="hero-highlight relative inline-flex items-center gap-1.5 -rotate-2 rounded-lg bg-[#E5FF00] px-3 py-0.5 text-slate-900 sm:gap-2 sm:px-4 sm:py-1">
                <motion.span
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, -10, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 0.5, 
                    repeat: Infinity, 
                    repeatDelay: 2
                  }}
                  className="inline-flex"
                >
                  <Zap className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 xl:h-14 xl:w-14 fill-yellow-400 text-yellow-600" />
                </motion.span>
                fastest
              </span>{" "}
              loan platform for{" "}
              <RotatingText />
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-foreground/70 sm:mt-6 sm:text-lg lg:mx-0"
            >
              Compare 50+ licensed lenders. One application.
              No credit score impact.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4 lg:justify-start"
            >
              <motion.a
                href="#apply"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-7 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition-colors hover:bg-slate-800 sm:w-auto"
              >
                Get My Best Rates
                <ArrowRight className="h-4 w-4" />
              </motion.a>
              <motion.a
                href="#how-it-works"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex h-12 w-full items-center justify-center rounded-lg border border-foreground/30 px-7 text-sm font-semibold text-foreground transition-colors hover:bg-white/10 sm:w-auto"
              >
                See How It Works
              </motion.a>
            </motion.div>
          </div>

          {/* Right: Mascot — desktop only in grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex lg:flex-col lg:items-center lg:gap-6"
          >
            <HeroMascot />
            <SingpassBadge />
          </motion.div>
        </div>

        {/* Mobile: Mascot + Singpass badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center gap-4 pb-16 sm:gap-6 sm:pb-20 lg:hidden"
        >
          <HeroMascot />
          <SingpassBadge />
        </motion.div>
      </div>

      {/* Bottom fade to white */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white/80 to-transparent" />
    </section>
  );
}
