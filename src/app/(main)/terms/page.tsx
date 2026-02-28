import { Metadata } from "next";
import { BackButton } from "@/components/ui/back-button";

export const metadata: Metadata = {
  title: "Terms of Use | LendKaki",
  description: "Terms of Use for LendKaki — Singapore's loan comparison platform.",
};

export default function TermsOfUsePage() {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {/* Back */}
        <BackButton />

        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Terms of Use
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: February 2026
        </p>

        <div className="prose prose-slate mt-10 max-w-none text-sm leading-relaxed text-foreground/80 sm:text-base [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul>li]:mb-1">

          <p>
            These Terms of Use (&ldquo;Terms&rdquo;) govern your access to and use of the LendKaki website and services
            operated by <strong>Lendkaki Pay Pte. Ltd.</strong> (UEN: 202607335C), a company incorporated in Singapore
            (&ldquo;LendKaki&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). By accessing or using
            our platform, you agree to be bound by these Terms.
          </p>

          <h2>1. About LendKaki</h2>
          <p>
            LendKaki is a loan comparison platform. We are not a bank, moneylender, or financial institution. We do
            not lend money. All loan products displayed on our platform are offered by third-party licensed banks and
            financial institutions regulated by the Monetary Authority of Singapore (MAS) and/or licensed moneylenders
            regulated by the Ministry of Law (MinLaw).
          </p>

          <h2>2. Eligibility</h2>
          <p>To use our services, you must:</p>
          <ul>
            <li>Be at least 18 years of age</li>
            <li>Be a Singapore Citizen, Permanent Resident, or foreigner with a valid pass</li>
            <li>Have a valid Singapore phone number and email address</li>
          </ul>

          <h2>3. Our Services</h2>
          <p>
            LendKaki provides a platform that allows users to submit a single application and receive loan comparison
            results from our network of partner lenders. By submitting a form on our platform, you consent to us sharing
            your information with our partner lenders for the purpose of evaluating your loan eligibility.
          </p>
          <p>
            We do not guarantee that any loan offers will be made to you. Loan approval, terms, and interest rates are
            determined solely by the individual lenders.
          </p>

          <h2>4. No Fees to Borrowers</h2>
          <p>
            Our comparison service is completely free for borrowers. LendKaki earns referral fees from lenders, not
            from users. You will never be charged by LendKaki for using our platform.
          </p>

          <h2>5. Accuracy of Information</h2>
          <p>
            Rates and loan information shown on our platform are indicative and subject to change without notice. We
            strive to keep information accurate but make no warranties as to the completeness or accuracy of any
            information on the platform.
          </p>

          <h2>6. User Responsibilities</h2>
          <p>You agree to:</p>
          <ul>
            <li>Provide accurate, truthful, and complete information when submitting any form</li>
            <li>Not use the platform for any unlawful purpose</li>
            <li>Not attempt to gain unauthorised access to any part of our system</li>
            <li>Not submit false or misleading information</li>
          </ul>

          <h2>7. Intellectual Property</h2>
          <p>
            All content on this platform, including but not limited to text, graphics, logos, and software, is the
            property of Lendkaki Pay Pte. Ltd. and is protected by applicable intellectual property laws. You may not
            reproduce, distribute, or create derivative works without our express written consent.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, LendKaki shall not be liable for any direct, indirect, incidental,
            or consequential loss arising from your use of our platform or any loan product obtained through our
            platform.
          </p>

          <h2>9. Third-Party Links</h2>
          <p>
            Our platform may contain links to third-party websites. We are not responsible for the content, privacy
            practices, or terms of any third-party site.
          </p>

          <h2>10. Amendments</h2>
          <p>
            We reserve the right to update these Terms at any time. Continued use of the platform after changes are
            posted constitutes acceptance of the revised Terms.
          </p>

          <h2>11. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of Singapore. Any disputes
            arising shall be subject to the exclusive jurisdiction of the Singapore courts.
          </p>

          <h2>12. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at{" "}
            <a href="mailto:support@lendkaki.sg" className="text-primary hover:underline">
              support@lendkaki.sg
            </a>
            .
          </p>
          <p className="text-xs text-muted-foreground">
            Lendkaki Pay Pte. Ltd. · UEN: 202607335C · 2 Venture Drive, #19-21, Vision Exchange, Singapore 608526
          </p>
        </div>
      </div>
    </div>
  );
}
