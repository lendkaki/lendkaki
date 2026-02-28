import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why LendKaki? | Skip the Queue, Get the Best Loan Rate",
  description:
    "Apply once and let 20+ licensed Singapore lenders compete for your loan. Free matching, real rates, same-day disbursement possible.",
  robots: { index: true, follow: true },
};

export default function WhyLendKakiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
