"use client";

import React from "react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetFooter, SheetTitle } from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const loanLinks = [
  { href: "/personal-loans", label: "Personal Loans" },
  { href: "/business-loans", label: "Business Loans" },
  { href: "/bridging-loans", label: "Bridging Loans" },
  { href: "/debt-consolidation", label: "Debt Consolidation" },
];

const navLinks = [
  { href: "#how-it-works", label: "How It Works" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
            <div className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors bg-[#3673ae]">
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

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 lg:flex">
            {/* Loan Types dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "gap-1",
                  isScrolled
                    ? "text-muted-foreground hover:bg-primary hover:text-white"
                    : "text-slate-900/80 hover:bg-white/10 hover:text-slate-900"
                )}
              >
                Loan Types
                <ChevronDown
                  className={cn("h-3.5 w-3.5 transition-transform duration-200", dropdownOpen && "rotate-180")}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 top-full mt-1 w-52 rounded-xl border border-border bg-white/95 py-1.5 shadow-lg backdrop-blur-md">
                  {loanLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm text-foreground/70 transition-colors hover:bg-primary/5 hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Other nav links */}
            {navLinks.map((link) =>
              link.href.startsWith("/") ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    isScrolled
                      ? "text-muted-foreground hover:bg-primary hover:text-white"
                      : "text-slate-900/80 hover:bg-white/10 hover:text-slate-900"
                  )}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    isScrolled
                      ? "text-muted-foreground hover:bg-primary hover:text-white"
                      : "text-slate-900/80 hover:bg-white/10 hover:text-slate-900"
                  )}
                >
                  {link.label}
                </a>
              )
            )}

            <Button
              asChild
              variant={isScrolled ? "default" : "outline"}
              className={cn(
                "ml-1",
                isScrolled && "hover:bg-primary hover:text-white",
                !isScrolled &&
                  "border-primary bg-primary text-white hover:bg-white hover:border-white hover:text-primary"
              )}
            >
              <a href="#apply">Compare Rates Now</a>
            </Button>
          </div>

          {/* Spacer */}
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
              className={cn('size-6 transition-transform duration-600 ease-out', open && '-rotate-45')}
            >
              <path
                className={cn(
                  'transition-all duration-600 ease-out',
                  open ? '[stroke-dasharray:20_300] [stroke-dashoffset:-32.42px]' : '[stroke-dasharray:12_63]',
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
          <div className="overflow-y-auto px-4 pt-12 pb-5">
            {/* Loan Types section */}
            <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Loan Types
            </p>
            <div className="mb-3 grid gap-y-1">
              {loanLinks.map((link) => (
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
              ))}
            </div>

            {/* Other links */}
            <div className="grid gap-y-1">
              {navLinks.map((link) =>
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
          <SheetFooter>
            <Button asChild className="w-full hover:bg-primary" onClick={() => setOpen(false)}>
              <a href="#apply">Compare Rates Now</a>
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
