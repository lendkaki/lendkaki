"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Tan Wei Ming",
    context: "Personal Loan",
    quote:
      "I was dreading the idea of applying to multiple banks. LendKaki matched me with 5 offers in under a minute — I saved over $2,000 in interest compared to my bank's rate.",
    rating: 5,
  },
  {
    name: "Priya Nair",
    context: "Debt Consolidation",
    quote:
      "Finally consolidated all my credit card debts into one manageable loan. The whole process was transparent — no surprise fees, no hard credit checks. Exactly what they promised.",
    rating: 5,
  },
  {
    name: "Ahmad Rizal",
    context: "Business Loan",
    quote:
      "As an SME owner, getting a business loan used to take weeks. Through LendKaki I got approved within 24 hours and funds were in my account the next day. Game changer.",
    rating: 5,
  },
  {
    name: "Rachel Lim",
    context: "Wedding Loan",
    quote:
      "We needed funds for our wedding quickly. The multi-step form was super easy — took less than 2 minutes. Got a great rate from a lender I wouldn't have found on my own.",
    rating: 5,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className="h-4 w-4 fill-amber-400 text-amber-400"
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            What Borrowers Say
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Real experiences from Singaporeans who found better rates with us.
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              className="relative flex flex-col rounded-2xl border border-border bg-card p-7"
            >
              {/* Decorative quote */}
              <Quote className="absolute right-5 top-5 h-8 w-8 text-muted/60" />

              {/* Stars */}
              <StarRating count={item.rating} />

              {/* Quote */}
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{item.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {item.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.context}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
