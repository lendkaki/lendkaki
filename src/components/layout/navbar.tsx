"use client";

import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetFooter } from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { MenuToggle } from "@/components/ui/menu-toggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#apply", label: "Apply Now" },
  { href: "#loans", label: "Loan Picks" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
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
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
              isScrolled ? "bg-primary" : "bg-white"
            )}
          >
            <span
              className={cn(
                "text-sm font-bold transition-colors",
                isScrolled ? "text-primary-foreground" : "text-primary"
              )}
            >
              LK
            </span>
          </div>
          <span
            className={cn(
              "text-lg font-bold tracking-tight transition-colors",
              isScrolled ? "text-foreground" : "text-white"
            )}
          >
            LendKaki
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-2 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                isScrolled
                  ? "text-muted-foreground hover:bg-slate-900 hover:text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              )}
            >
              {link.label}
            </a>
          ))}
          <Button
            asChild
            variant={isScrolled ? "default" : "outline"}
            className={cn(
              isScrolled && "hover:bg-slate-900",
              !isScrolled &&
                "border-white bg-white text-primary hover:bg-slate-900 hover:text-white hover:border-slate-900"
            )}
          >
            <a href="#apply">Get My Best Rates</a>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "lg:hidden",
              isScrolled
                ? "hover:bg-slate-900 hover:text-white"
                : "text-white hover:bg-white/10 hover:text-white"
            )}
            onClick={() => setOpen(!open)}
          >
            <MenuToggle
              strokeWidth={2.5}
              open={open}
              onOpenChange={setOpen}
              className="size-6"
            />
          </Button>
          <SheetContent
            className="bg-white/95 supports-[backdrop-filter]:bg-white/80 gap-0 backdrop-blur-lg"
            showClose={false}
            side="left"
          >
            <div className="grid gap-y-2 overflow-y-auto px-4 pt-12 pb-5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    buttonVariants({
                      variant: "ghost",
                      className: "justify-start hover:bg-slate-900 hover:text-white",
                    })
                  )}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <SheetFooter>
              <Button asChild className="w-full hover:bg-slate-900" onClick={() => setOpen(false)}>
                <a href="#apply">Get My Best Rates</a>
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
