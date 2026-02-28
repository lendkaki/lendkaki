import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Bridging Loans Singapore | Compare Rates | LendKaki",
  description:
    "Compare bridging loan rates from 20+ licensed lenders and banks in Singapore. Fast disbursement, same-day approval. 100% free, no hidden fees.",
  robots: { index: true, follow: true },
};

export default function BridgingLoansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
