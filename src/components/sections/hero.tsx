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
      {/* Invisible spacer sized to the longest word — prevents layout shift */}
      <span className="invisible" aria-hidden="true">business growth</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={rotatingWords[index]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-end justify-center text-foreground lg:justify-start"
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
    <div className="relative mx-auto flex items-end justify-center pt-12 sm:pt-14">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-[280px] sm:w-[320px] lg:w-[400px] xl:w-[460px]"
      >
        <Image
          src="/mascot-otter.webp"
          alt="LendKaki otter mascot"
          width={480}
          height={480}
          className="h-auto w-full drop-shadow-xl"
          priority
        />

        {/* Floating rate badge — bottom edge aligns with left finger tip (~22% down image) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1, type: "spring", stiffness: 200 }}
          className="absolute z-10 rounded-xl px-3 py-2 sm:px-4 sm:py-3"
          style={{
            bottom: "78%",
            left: "-15%",
            background: "oklch(0.2 0.06 240)",
            border: "1.5px solid #E5FF00",
            boxShadow: "0 0 12px 2px #E5FF0066, 0 4px 16px rgba(0,0,0,0.3)",
          }}
        >
          <div className="text-[10px] font-medium text-[#E5FF00]/70 sm:text-xs">
            Lowest rate found
          </div>
          <div className="font-mono text-lg font-bold text-[#E5FF00] sm:text-2xl">
            2.0% <span className="text-[10px] font-normal text-[#E5FF00]/60 sm:text-sm">p.a.</span>
          </div>
        </motion.div>

        {/* Floating approval badge — bottom edge aligns with right finger tip (~22% down image) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.3, type: "spring", stiffness: 200 }}
          className="absolute z-10 rounded-xl px-3 py-2 sm:px-4 sm:py-3"
          style={{
            bottom: "78%",
            right: "-5%",
            background: "oklch(0.2 0.06 240)",
            border: "1.5px solid #E5FF00",
            boxShadow: "0 0 12px 2px #E5FF0066, 0 4px 16px rgba(0,0,0,0.3)",
          }}
        >
          <div className="text-[10px] font-medium text-[#E5FF00]/70 sm:text-xs">Avg. approval</div>
          <div className="font-mono text-lg font-bold text-[#E5FF00] sm:text-2xl">
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
        <div className="grid items-center gap-6 pb-4 pt-8 sm:gap-8 sm:pb-6 sm:pt-12 lg:grid-cols-[1.2fr_1fr] lg:gap-12 lg:pb-8 lg:pt-16">
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
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-7 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90 sm:w-auto"
              >
                Compare Rates Now
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
          className="flex flex-col items-center gap-0 pb-16 sm:pb-20 lg:hidden"
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
