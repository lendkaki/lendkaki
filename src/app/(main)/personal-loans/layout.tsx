import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Personal Loans Singapore | Compare Rates | LendKaki",
  description:
    "Compare personal loan rates from 20+ licensed lenders and banks in Singapore. One application, personalised offers, same-day approval. 100% free, no hidden fees.",
  robots: { index: true, follow: true },
};

export default function PersonalLoansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
