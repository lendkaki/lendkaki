import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Vampiro_One } from "next/font/google";
import Script from "next/script";
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

const vampiroOne = Vampiro_One({
  variable: "--font-vampiro",
  subsets: ["latin"],
  weight: "400",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "LendKaki — Find Singapore's Best Loan Rates | Loan Aggregator SG",
  description:
    "Compare personal loans, business loans & bridging loans from 20+ licensed Singapore lenders. Find the lowest rates in 60 seconds. No credit score impact.",
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
      "Compare 20+ licensed lenders. One application. No impact on your credit score.",
    url: "https://lendkaki.sg",
    siteName: "LendKaki",
    locale: "en_SG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LendKaki — Find Singapore's Best Loan Rates",
    description:
      "Compare 20+ licensed lenders. One application. No impact on your credit score.",
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
      <head>
        {/* Meta Pixel Code */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '920834750339516');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=920834750339516&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${vampiroOne.variable} font-sans antialiased overflow-x-hidden`}
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
