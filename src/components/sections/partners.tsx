"use client";

import { cn } from "@/lib/utils";
import { LogoCloud } from "@/components/ui/logo-cloud-3";

const logos = [
  { src: "/logos/dbs.png", alt: "DBS Bank" },
  { src: "/logos/ocbc.png", alt: "OCBC Bank" },
  { src: "/logos/uob.png", alt: "UOB Bank" },
  { src: "/logos/standard-chartered.png", alt: "Standard Chartered" },
  { src: "/logos/hsbc.png", alt: "HSBC" },
  { src: "/logos/citibank.png", alt: "Citibank" },
  { src: "/logos/maybank.png", alt: "Maybank" },
  { src: "/logos/cimb.png", alt: "CIMB Bank" },
];

export function PartnersScroller() {
  return (
    <section className="relative py-16 sm:py-20">
      <div
        aria-hidden="true"
        className={cn(
          "-z-10 -top-1/2 -translate-x-1/2 pointer-events-none absolute left-1/2 h-[120vmin] w-[120vmin] rounded-b-full",
          "bg-[radial-gradient(ellipse_at_center,--theme(--color-foreground/.04),transparent_50%)]",
          "blur-[30px]"
        )}
      />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-base font-medium tracking-tight text-muted-foreground md:text-lg">
          Our trusted partners
        </h2>

        <div className="mx-auto my-5 h-px max-w-sm bg-border [mask-image:linear-gradient(to_right,transparent,black,transparent)]" />

        <LogoCloud logos={logos} />

        <div className="mt-5 h-px bg-border [mask-image:linear-gradient(to_right,transparent,black,transparent)]" />
      </div>
    </section>
  );
}
