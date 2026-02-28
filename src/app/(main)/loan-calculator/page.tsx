"use client";

import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { calculateMonthlyInstallment } from "@/lib/loan-data";
import { LeadForm } from "@/components/forms/lead-form";
import { DollarSign, Calendar, Percent } from "lucide-react";

const fmt = new Intl.NumberFormat("en-SG", {
  style: "currency",
  currency: "SGD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const fmtWhole = new Intl.NumberFormat("en-SG", {
  style: "currency",
  currency: "SGD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function SliderField({
  icon: Icon,
  label,
  value,
  displayValue,
  min,
  max,
  step,
  minLabel,
  maxLabel,
  onChange,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  displayValue: string;
  min: number;
  max: number;
  step: number;
  minLabel: string;
  maxLabel: string;
  onChange: (val: number) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-medium text-slate-700">{label}</span>
        </div>
        <span className="text-lg font-bold text-foreground tabular-nums sm:text-xl">
          {displayValue}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
        className="[&_[data-slot=slider-thumb]]:h-10 [&_[data-slot=slider-thumb]]:w-10 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-track]]:h-2.5"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

export default function LoanCalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(10000);
  const [tenure, setTenure] = useState(12);
  const [interestRate, setInterestRate] = useState(6);

  const results = useMemo(() => {
    const monthly = calculateMonthlyInstallment(loanAmount, interestRate, tenure);
    const totalPayable = monthly * tenure;
    const totalInterest = totalPayable - loanAmount;
    return { monthly, totalPayable, totalInterest };
  }, [loanAmount, interestRate, tenure]);

  const interestPct = loanAmount > 0 ? (results.totalInterest / results.totalPayable) * 100 : 0;

  return (
    <>
      {/* Calculator Section */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center sm:mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Loan Calculator
            </h1>
            <p className="mt-2 text-base text-muted-foreground sm:text-lg">
              Estimate your monthly repayments, total interest, and more.
            </p>
          </div>

          {/* Calculator Card */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-xl sm:p-8">
            <div className="space-y-8">
              <SliderField
                icon={DollarSign}
                label="Loan Amount"
                value={loanAmount}
                displayValue={fmtWhole.format(loanAmount)}
                min={1000}
                max={100000}
                step={1000}
                minLabel="$1,000"
                maxLabel="$100,000"
                onChange={setLoanAmount}
              />

              <SliderField
                icon={Calendar}
                label="Tenure"
                value={tenure}
                displayValue={`${tenure} month${tenure === 1 ? "" : "s"}`}
                min={1}
                max={24}
                step={1}
                minLabel="1 month"
                maxLabel="24 months"
                onChange={setTenure}
              />

              <SliderField
                icon={Percent}
                label="Interest Rate (p.a.)"
                value={interestRate}
                displayValue={`${interestRate.toFixed(1)}%`}
                min={1}
                max={48}
                step={0.1}
                minLabel="1%"
                maxLabel="48%"
                onChange={setInterestRate}
              />
            </div>

            {/* Divider */}
            <div className="my-8 border-t border-border" />

            {/* Results */}
            <div className="space-y-6">
              {/* Hero number — monthly instalment */}
              <div className="rounded-xl bg-primary/5 p-5 text-center sm:p-6">
                <p className="text-sm font-medium text-muted-foreground">
                  Monthly Instalment
                </p>
                <p className="mt-1 text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                  {fmt.format(results.monthly)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">per month</p>
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-slate-50 p-4 text-center">
                  <p className="text-xs font-medium text-muted-foreground">
                    Principal
                  </p>
                  <p className="mt-1 text-lg font-bold text-foreground tabular-nums">
                    {fmt.format(loanAmount)}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-slate-50 p-4 text-center">
                  <p className="text-xs font-medium text-muted-foreground">
                    Total Interest
                  </p>
                  <p className="mt-1 text-lg font-bold text-foreground tabular-nums">
                    {fmt.format(results.totalInterest)}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-slate-50 p-4 text-center">
                  <p className="text-xs font-medium text-muted-foreground">
                    Total Payable
                  </p>
                  <p className="mt-1 text-lg font-bold text-foreground tabular-nums">
                    {fmt.format(results.totalPayable)}
                  </p>
                </div>
              </div>

              {/* Visual bar */}
              <div className="space-y-2">
                <div className="flex h-4 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-primary transition-all duration-300"
                    style={{ width: `${100 - interestPct}%` }}
                  />
                  <div
                    className="bg-primary/30 transition-all duration-300"
                    style={{ width: `${interestPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary" />
                    Principal ({(100 - interestPct).toFixed(1)}%)
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary/30" />
                    Interest ({interestPct.toFixed(1)}%)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimers */}
          <div className="mt-6 space-y-2 text-center text-[10px] leading-relaxed text-muted-foreground sm:text-xs">
            <p>
              This calculator provides indicative estimates only and does not
              constitute a loan offer. Actual loan terms, interest rates, and
              monthly instalments may vary depending on the lender, your credit
              profile, and other factors.
            </p>
            <p>
              LendKaki is managed and operated by Lendkaki Pay Pte. Ltd. (UEN:
              202607335C). We are not a lender. All loan products are offered by
              licensed banks and financial institutions regulated by MAS and/or
              MinLaw.
            </p>
          </div>
        </div>
      </section>

      {/* CTA — LeadForm */}
      <LeadForm />
    </>
  );
}
