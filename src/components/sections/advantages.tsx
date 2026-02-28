"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, ShieldCheck, Zap, BadgeDollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TabContent {
  badge: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

interface Tab {
  value: string;
  icon: React.ReactNode;
  label: string;
  content: TabContent;
}

const advantageTabs: Tab[] = [
  {
    value: "tab-1",
    icon: <Zap className="h-auto w-4 shrink-0" />,
    label: "Same-Day Approval",
    content: {
      badge: "Fast Processing",
      title: "Get approved in minutes, not days.",
      description:
        "75% of our applicants receive approval within 24 hours. Some lenders can disburse funds the same day you apply. No more waiting weeks for a loan decision.",
      imageSrc:
        "/images/lendkaki - same day approval.webp",
      imageAlt: "Fast loan approval dashboard",
    },
  },
  {
    value: "tab-2",
    icon: <Building2 className="h-auto w-4 shrink-0" />,
    label: "20+ Licensed Lenders",
    content: {
      badge: "Widest Network",
      title: "Access Singapore's largest lending network.",
      description:
        "We partner with 20+ MAS-regulated banks and MinLaw-licensed moneylenders. Compare rates from OCBC, DBS, UOB, and specialised lenders all in one place.",
      imageSrc: "/images/lendkaki - multiple lenders one platform.webp",
      imageAlt: "LendKaki — multiple lenders, one platform",
    },
  },
  {
    value: "tab-3",
    icon: <ShieldCheck className="h-auto w-4 shrink-0" />,
    label: "Zero Credit Impact",
    content: {
      badge: "Protected Credit",
      title: "Check rates without affecting your score.",
      description:
        "We use soft credit checks only, so your credit score stays protected. Compare as many offers as you want with zero impact on your credit report.",
      imageSrc: "/images/lendkaki - zero credit impact.webp",
      imageAlt: "LendKaki — zero credit impact",
    },
  },
  {
    value: "tab-4",
    icon: <BadgeDollarSign className="h-auto w-4 shrink-0" />,
    label: "100% Free",
    content: {
      badge: "No Hidden Fees",
      title: "Our service is completely free.",
      description:
        "Zero charges for borrowers. We earn from lenders, not from you. No application fees, no comparison fees, no hidden costs. Ever.",
      imageSrc: "/images/lendkaki - zero fees.webp",
      imageAlt: "LendKaki — zero fees, 100% free",
    },
  },
];

export function Advantages() {
  return (
    <section className="bg-gradient-to-b from-background via-muted/20 to-white pb-12 pt-12 sm:pb-16 sm:pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <Badge variant="outline" className="circulating-border border-primary bg-white font-medium px-4 py-1.5 rounded-lg">Why LendKaki</Badge>
          <h2 className="max-w-2xl text-3xl font-semibold text-foreground sm:text-4xl">
            The LendKaki Advantage
          </h2>
          <p className="text-muted-foreground">
            Why thousands of Singaporeans choose us to find their best loan rates.
          </p>
        </div>
        <Tabs defaultValue={advantageTabs[0].value} className="mt-8">
          <TabsList className="mx-auto grid w-full grid-cols-2 gap-2 bg-transparent sm:flex sm:items-center sm:justify-center sm:gap-4 md:gap-10">
            {advantageTabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold bg-white text-foreground hover:bg-slate-50 sm:gap-2 sm:px-4 sm:py-3 sm:text-sm data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                {tab.icon} <span className="whitespace-nowrap">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="mx-auto mt-6 max-w-screen-xl rounded-2xl bg-gradient-to-br from-primary/25 via-primary/15 to-primary/5 p-6 shadow-lg ring-1 ring-primary/20 sm:mt-8 sm:p-8 lg:p-16">
            {advantageTabs.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="grid place-items-center gap-8 lg:grid-cols-2 lg:gap-10"
              >
                <div className="flex flex-col gap-4 sm:gap-5">
                  <Badge variant="outline" className="w-fit rounded-lg bg-background">
                    {tab.content.badge}
                  </Badge>
                  <h3 className="text-2xl font-semibold sm:text-3xl lg:text-5xl">
                    {tab.content.title}
                  </h3>
                  <p className="text-sm text-muted-foreground sm:text-base lg:text-lg">
                    {tab.content.description}
                  </p>
                </div>
                <img
                  src={tab.content.imageSrc}
                  alt={tab.content.imageAlt}
                  className="order-first w-full rounded-xl shadow-lg lg:order-last"
                />
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
}
