"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { LoanCard } from "@/components/cards/loan-card";
import { loanProducts, loanCategories } from "@/lib/loan-data";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
  exit: {},
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

export function LoanMarketplace() {
  const [activeCategory, setActiveCategory] = useState("all");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const filteredLoans =
    activeCategory === "all"
      ? loanProducts
      : loanProducts.filter((loan) => loan.category === activeCategory);

  return (
    <section id="loans" className="bg-muted/20 py-20 sm:py-28" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Top Loan Picks
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Curated loan products from Singapore&apos;s top banks and licensed
            lenders.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 flex flex-wrap justify-center gap-2"
        >
          {loanCategories.map((category) => (
            <button
              key={category.value}
              onClick={() => setActiveCategory(category.value)}
              className={cn(
                "relative rounded-full px-5 py-2 text-sm font-medium transition-all",
                activeCategory === category.value
                  ? "text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              {activeCategory === category.value && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 rounded-full bg-primary shadow-md shadow-primary/20"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}
              <span className="relative z-10">{category.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Loan Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredLoans.map((loan, index) => (
              <motion.div key={loan.id} variants={cardVariants}>
                <LoanCard loan={loan} index={index} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty state */}
        {filteredLoans.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-10 text-center text-muted-foreground"
          >
            <p>No loans found in this category. Try a different filter.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
