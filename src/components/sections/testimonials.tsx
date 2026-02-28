"use client";

import {
  TestimonialsColumn,
  type Testimonial,
} from "@/components/ui/testimonials-columns-1";
import { motion } from "motion/react";

const testimonials: Testimonial[] = [
  {
    text: "I was dreading applying to multiple banks. LendKaki matched me with 5 offers in under a minute. I saved over $2,000 in interest compared to my bank's rate.",
    image: "/testimonials/tan wei ming.webp",
    name: "Tan Wei Ming",
    role: "Personal Loan",
  },
  {
    text: "Finally consolidated all my credit card debts into one manageable loan. The whole process was transparent with no surprise fees, no hard credit checks.",
    image: "/testimonials/priya nair.webp",
    name: "Priya Nair",
    role: "Debt Consolidation",
  },
  {
    text: "As an SME owner, getting a business loan used to take weeks. Through LendKaki I got approved within 24 hours and funds were in my account the next day.",
    image: "/testimonials/ahmad rizal.webp",
    name: "Ahmad Rizal",
    role: "Business Loan",
  },
  {
    text: "We needed funds for our wedding quickly. The multi-step form was super easy and took less than 2 minutes. Got a great rate from a lender I wouldn't have found on my own.",
    image: "/testimonials/rachel lim.webp",
    name: "Rachel Lim",
    role: "Wedding Loan",
  },
  {
    text: "The comparison tool is brilliant. I could see all my options side by side with real numbers. Ended up saving $150/month on my personal loan repayment.",
    image: "/testimonials/david ong.webp",
    name: "David Ong",
    role: "Personal Loan",
  },
  {
    text: "I was skeptical at first, but the process was genuinely free. No hidden charges, no spam calls. Just real offers from licensed lenders. Very impressed.",
    image: "/testimonials/nurul aisyah.webp",
    name: "Nurul Aisyah",
    role: "Personal Loan",
  },
  {
    text: "Needed a bridging loan urgently for my property purchase. LendKaki connected me with a lender who disbursed the funds the same day. Lifesaver.",
    image: "/testimonials/kenneth teo.webp",
    name: "Kenneth Teo",
    role: "Bridging Loan",
  },
  {
    text: "Coming from overseas, I didn't know where to start with Singapore banks. LendKaki simplified everything and found me options that accept foreigners.",
    image: "/testimonials/sarah chen.webp",
    name: "Sarah Chen",
    role: "Foreigner Loan",
  },
  {
    text: "After my renovation went over budget, I needed extra funds fast. Applied on LendKaki at night, had three offers by morning. Incredible turnaround.",
    image: "/testimonials/ravi chandran.webp",
    name: "Ravi Chandran",
    role: "Renovation Loan",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export function Testimonials() {
  return (
    <section className="relative bg-white pb-24 pt-8 sm:pb-32 sm:pt-12">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center">
            <div className="circulating-border border border-primary py-1 px-4 rounded-lg text-sm text-foreground bg-white font-medium">
              Testimonials
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-5 text-center">
            What our borrowers say
          </h2>
          <p className="text-center mt-4 text-lg text-muted-foreground">
            Real experiences from Singaporeans who found better rates with us.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-14 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
}
