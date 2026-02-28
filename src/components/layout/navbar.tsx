"use client";

import React from "react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetFooter, SheetTitle } from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const navCategories = [
  {
    label: "Loan Types",
    links: [
      { href: "/personal-loans", label: "Personal Loans" },
      { href: "/business-loans", label: "Business Loans" },
      { href: "/bridging-loans", label: "Bridging Loans" },
      { href: "/debt-consolidation", label: "Debt Consolidation" },
    ],
  },
  {
    label: "Company",
    links: [
      { href: "#about", label: "About Us" },
      { href: "#how-it-works", label: "How It Works" },
    ],
  },
  {
    label: "Resources",
    links: [
      { href: "/#faq", label: "FAQs" },
      { href: "/loan-calculator", label: "Loan Calculator" },
      { href: "/pdpa", label: "PDPA Compliance" },
    ],
  },
];

function DropdownMenu({
  label,
  links,
  isScrolled,
}: {
  label: string;
  links: { href: string; label: string }[];
  isScrolled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "gap-1",
          isScrolled
            ? "text-muted-foreground hover:bg-primary hover:text-white"
            : "text-slate-900/80 hover:bg-white/10 hover:text-slate-900"
        )}
      >
        {label}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-52 rounded-xl border border-border bg-white/95 py-1.5 shadow-lg backdrop-blur-md">
          {links.map((link) =>
            link.href.startsWith("/") || link.href.startsWith("#") ? (
              link.href.startsWith("/") ? (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-sm text-foreground/70 transition-colors hover:bg-primary/5 hover:text-primary"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-sm text-foreground/70 transition-colors hover:bg-primary/5 hover:text-primary"
                >
                  {link.label}
                </a>
              )
            ) : null
          )}
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "border-b border-border/50 bg-white/80 backdrop-blur-lg"
            : "bg-transparent"
        )}
      >
        <nav className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3673ae] transition-colors">
              <span className="font-[family-name:var(--font-vampiro)] text-sm text-white">LK</span>
            </div>
            <span
              className={cn(
                "font-[family-name:var(--font-vampiro)] text-xl tracking-tight transition-colors",
                isScrolled ? "text-[#3673ae]" : "text-slate-900"
              )}
            >
              LendKaki
            </span>
          </Link>

          {/* Desktop Nav — dropdowns */}
          <div className="hidden items-center gap-1 lg:flex">
            {navCategories.map((cat) => (
              <DropdownMenu
                key={cat.label}
                label={cat.label}
                links={cat.links}
                isScrolled={isScrolled}
              />
            ))}
            <Button
              asChild
              variant={isScrolled ? "default" : "outline"}
              className={cn(
                "ml-2",
                isScrolled && "hover:bg-primary hover:text-white",
                !isScrolled &&
                  "border-primary bg-primary text-white hover:bg-white hover:border-white hover:text-primary"
              )}
            >
              <a href="#apply">Apply Now</a>
            </Button>
          </div>

          {/* Spacer for mobile */}
          <div className="size-9 lg:hidden" />
        </nav>
      </header>

      {/* Mobile toggle */}
      <div className="pointer-events-none fixed top-0 left-0 right-0 z-[60] lg:hidden">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-end px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            aria-label="Toggle menu"
            className={cn(
              "pointer-events-auto flex items-center justify-center size-9 rounded-md transition-colors",
              open
                ? "text-slate-900 hover:bg-slate-200"
                : isScrolled
                  ? "hover:bg-primary hover:text-white"
                  : "text-slate-900 hover:bg-primary hover:text-white"
            )}
            onClick={() => setOpen(!open)}
          >
            <svg
              strokeWidth={2.5}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 32 32"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn("size-6 transition-transform duration-600 ease-out", open && "-rotate-45")}
            >
              <path
                className={cn(
                  "transition-all duration-600 ease-out",
                  open
                    ? "[stroke-dasharray:20_300] [stroke-dashoffset:-32.42px]"
                    : "[stroke-dasharray:12_63]"
                )}
                d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
              />
              <path d="M7 16 27 16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          className="bg-white/95 supports-[backdrop-filter]:bg-white/80 gap-0 backdrop-blur-lg"
          showClose={false}
          side="left"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <div className="overflow-y-auto px-4 pt-12 pb-5 space-y-5">
            {navCategories.map((cat) => (
              <div key={cat.label}>
                <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {cat.label}
                </p>
                <div className="grid gap-y-0.5">
                  {cat.links.map((link) =>
                    link.href.startsWith("/") ? (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          buttonVariants({
                            variant: "ghost",
                            className: "justify-start hover:bg-primary hover:text-white",
                          })
                        )}
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          buttonVariants({
                            variant: "ghost",
                            className: "justify-start hover:bg-primary hover:text-white",
                          })
                        )}
                      >
                        {link.label}
                      </a>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
          <SheetFooter>
            <Button asChild className="w-full hover:bg-primary" onClick={() => setOpen(false)}>
              <a href="#apply">Apply Now</a>
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
