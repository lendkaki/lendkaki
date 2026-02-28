import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Debt Consolidation Loans Singapore | Compare Rates | LendKaki",
  description:
    "Consolidate your debts with one simple loan. Compare debt consolidation rates from 20+ licensed lenders and banks in Singapore. 100% free, no hidden fees.",
  robots: { index: true, follow: true },
};

export default function DebtConsolidationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
