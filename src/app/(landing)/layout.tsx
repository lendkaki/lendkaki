import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Your Best Loan Rates — LendKaki",
  description:
    "Compare loan rates from 20+ licensed Singapore lenders in 60 seconds. Free, no credit score impact. Apply now.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
