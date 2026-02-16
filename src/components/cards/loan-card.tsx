"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Loan } from "@/types";

interface LoanCardProps {
  loan: Loan;
  index: number;
}

export function LoanCard({ loan, index }: LoanCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass group relative flex h-full flex-col rounded-2xl p-6 transition-shadow hover:shadow-xl hover:shadow-primary/5"
    >
      {/* Promoted badge */}
      {loan.isPromoted && (
        <Badge className="absolute -top-2.5 right-4 gap-1 bg-primary text-primary-foreground">
          <Star className="h-3 w-3 fill-current" />
          Featured
        </Badge>
      )}

      {/* Lender header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-sm font-bold text-foreground">
          {loan.lender
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">
            {loan.lender}
          </h4>
          <span className="text-xs capitalize text-muted-foreground">
            {loan.category.replace("-", " ")} Loan
          </span>
        </div>
      </div>

      {/* Interest rate */}
      <div className="mb-5">
        <p className="text-xs font-medium text-muted-foreground">
          Interest Rate (p.a.)
        </p>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="shimmer-on-hover font-mono text-3xl font-bold text-primary">
            {loan.interestRate}%
          </span>
          {loan.maxInterestRate && (
            <span className="text-sm text-muted-foreground">
              – {loan.maxInterestRate}%
            </span>
          )}
        </div>
      </div>

      {/* Details grid */}
      <div className="mb-5 grid grid-cols-2 gap-4 rounded-xl bg-muted/50 p-4">
        <div>
          <p className="text-xs text-muted-foreground">Loan Amount</p>
          <p className="mt-0.5 font-mono text-sm font-semibold text-foreground">
            ${loan.minAmount.toLocaleString()} –{" "}
            ${loan.maxAmount.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Tenure</p>
          <p className="mt-0.5 font-mono text-sm font-semibold text-foreground">
            {loan.minTenure} – {loan.maxTenure} months
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="mb-6 flex flex-wrap gap-1.5">
        {loan.features.map((feature) => (
          <Badge
            key={feature}
            variant="secondary"
            className="text-xs font-normal"
          >
            {feature}
          </Badge>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-auto">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          Apply Now
          <ArrowRight className="h-3.5 w-3.5" />
        </motion.button>
      </div>
    </motion.div>
  );
}
