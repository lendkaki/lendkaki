import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LendKaki — Find Singapore's Best Loan Rates | Loan Aggregator SG",
  description:
    "Compare personal loans, business loans & bridging loans from 50+ licensed Singapore lenders. Find the lowest rates in 60 seconds. No credit score impact.",
  keywords: [
    "Best Personal Loans Singapore",
    "Loan Aggregator SG",
    "Singapore Loan Comparison",
    "Personal Loan Singapore",
    "Business Loan Singapore",
    "Bridging Loan Singapore",
    "Debt Consolidation Singapore",
    "Compare Loan Rates Singapore",
    "Licensed Moneylender Singapore",
    "Low Interest Loan SG",
  ],
  openGraph: {
    title: "LendKaki — Find Singapore's Best Loan Rates",
    description:
      "Compare 50+ licensed lenders. One application. No impact on your credit score.",
    url: "https://lendkaki.sg",
    siteName: "LendKaki",
    locale: "en_SG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LendKaki — Find Singapore's Best Loan Rates",
    description:
      "Compare 50+ licensed lenders. One application. No impact on your credit score.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
