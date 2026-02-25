import { Metadata } from "next";
import { BackButton } from "@/components/ui/back-button";

export const metadata: Metadata = {
  title: "PDPA Compliance | LendKaki",
  description:
    "LendKaki's Personal Data Protection Act (PDPA) compliance notice in accordance with Singapore law.",
};

export default function PdpaPage() {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <BackButton />

        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          PDPA Compliance
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: February 2026
        </p>

        <div className="mt-10 space-y-0 text-sm leading-relaxed text-foreground/80 sm:text-base [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul>li]:mb-1">

          <p>
            <strong>Lendkaki Pay Pte. Ltd.</strong> (UEN: 202607335C) (&ldquo;LendKaki&rdquo;, &ldquo;we&rdquo;,
            &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to protecting your personal data in accordance with the
            Personal Data Protection Act 2012 (&ldquo;PDPA&rdquo;) of Singapore and its subsidiary legislation,
            including the Personal Data Protection (Enforcement) Regulations 2021 and the Personal Data Protection
            (Notification of Data Breaches) Regulations 2021.
          </p>

          <h2>1. Our Commitment</h2>
          <p>
            LendKaki recognises the importance of the personal data you have entrusted to us. We are committed to
            administering and managing your personal data in accordance with the PDPA and the Advisory Guidelines
            issued by the Personal Data Protection Commission (&ldquo;PDPC&rdquo;) of Singapore.
          </p>

          <h2>2. Data Protection Officer</h2>
          <p>
            We have appointed a Data Protection Officer (&ldquo;DPO&rdquo;) to oversee our data protection practices
            and ensure compliance with the PDPA. You may contact our DPO for any personal data-related queries or
            concerns:
          </p>
          <ul>
            <li><strong>Organisation:</strong> Lendkaki Pay Pte. Ltd.</li>
            <li><strong>Email:</strong> <a href="mailto:support@lendkaki.sg" className="text-primary hover:underline">support@lendkaki.sg</a></li>
            <li><strong>Address:</strong> 2 Venture Drive, #19-21, Vision Exchange, Singapore 608526</li>
          </ul>

          <h2>3. Personal Data We Collect</h2>
          <p>
            In the course of providing our loan comparison services, we collect the following categories of personal
            data:
          </p>
          <ul>
            <li>Identification data: full name, NRIC/FIN number (where applicable)</li>
            <li>Contact data: mobile phone number, email address</li>
            <li>Financial data: desired loan amount, loan purpose, employment and income information</li>
            <li>Residency data: nationality or residential status</li>
            <li>Technical data: IP address, browser type, device identifiers, and usage data collected via cookies</li>
          </ul>

          <h2>4. Purposes of Collection, Use and Disclosure</h2>
          <p>We collect, use, and disclose your personal data for the following purposes:</p>
          <ul>
            <li>To match you with suitable licensed lenders and financial institutions</li>
            <li>To facilitate loan enquiries and applications on your behalf</li>
            <li>To communicate with you via phone, WhatsApp, SMS, or email regarding your loan enquiry</li>
            <li>To send marketing communications about our services (only with your consent)</li>
            <li>To conduct internal analytics and improve our platform</li>
            <li>To comply with applicable laws, regulations, and regulatory requirements</li>
            <li>To prevent, detect, and investigate fraud or other criminal activity</li>
          </ul>

          <h2>5. Disclosure to Third Parties</h2>
          <p>
            We may disclose your personal data to the following categories of third parties for the purposes
            described above:
          </p>
          <ul>
            <li>
              <strong>Partner lenders:</strong> MAS-regulated banks and MinLaw-licensed moneylenders in our network,
              for the purpose of evaluating your loan eligibility and presenting loan offers
            </li>
            <li>
              <strong>Service providers:</strong> third-party vendors who assist us in operating our platform,
              including cloud hosting, analytics, and communication services
            </li>
            <li>
              <strong>Regulatory authorities:</strong> government bodies or law enforcement agencies where required
              by law
            </li>
          </ul>
          <p>
            We require all third parties to respect the security of your personal data and to treat it in accordance
            with the PDPA. We do not sell your personal data to any third party.
          </p>

          <h2>6. Consent</h2>
          <p>
            By submitting your personal data through our platform, you consent to the collection, use, and disclosure
            of your personal data for the purposes set out in this notice. Where we rely on your consent, you have
            the right to withdraw it at any time by contacting our DPO. Please note that withdrawal of consent may
            affect our ability to provide services to you.
          </p>
          <p>
            For marketing communications, you may opt out at any time by contacting us at{" "}
            <a href="mailto:support@lendkaki.sg" className="text-primary hover:underline">
              support@lendkaki.sg
            </a>.
          </p>

          <h2>7. Access and Correction</h2>
          <p>
            You have the right under the PDPA to:
          </p>
          <ul>
            <li>Request access to your personal data held by us</li>
            <li>Request correction of any inaccurate or incomplete personal data</li>
            <li>Request information on how your personal data has been used or disclosed in the past year</li>
          </ul>
          <p>
            To submit an access or correction request, please contact our DPO at{" "}
            <a href="mailto:support@lendkaki.sg" className="text-primary hover:underline">
              support@lendkaki.sg
            </a>
            . We will respond to your request within 30 days of receipt. A reasonable fee may be charged for
            access requests.
          </p>

          <h2>8. Data Portability</h2>
          <p>
            In accordance with Part VIA of the PDPA, you may request the transmission of your personal data that
            is in our possession or under our control to another organisation, where it is technically feasible
            to do so. Please contact our DPO to submit a data portability request.
          </p>

          <h2>9. Retention of Personal Data</h2>
          <p>
            We retain your personal data for as long as necessary to fulfil the purposes for which it was collected,
            or as required or permitted by law. When your personal data is no longer required, we will destroy or
            anonymise it in a secure manner.
          </p>

          <h2>10. Protection of Personal Data</h2>
          <p>
            We implement appropriate technical and organisational measures to protect your personal data against
            unauthorised access, collection, use, disclosure, copying, modification, or disposal, including:
          </p>
          <ul>
            <li>SSL/TLS encryption for all data transmitted over the internet</li>
            <li>Access controls limiting data access to authorised personnel only</li>
            <li>Regular security reviews and assessments</li>
            <li>Staff training on data protection obligations</li>
          </ul>

          <h2>11. Data Breach Notification</h2>
          <p>
            In the event of a data breach that is likely to result in significant harm to affected individuals,
            we will notify the PDPC and affected individuals as required under the Personal Data Protection
            (Notification of Data Breaches) Regulations 2021, within 3 calendar days of assessing that the breach
            is notifiable.
          </p>

          <h2>12. Transfers Outside Singapore</h2>
          <p>
            Where we transfer personal data outside of Singapore, we ensure that the receiving organisation
            provides a standard of protection comparable to the PDPA, in accordance with the requirements set
            out in the Third Schedule of the PDPA.
          </p>

          <h2>13. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies on our website. For more information on how we use
            cookies, please refer to our{" "}
            <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
            You may manage your cookie preferences through your browser settings.
          </p>

          <h2>14. Do Not Call Registry</h2>
          <p>
            We comply with the Do Not Call (DNC) Registry provisions under the PDPA. We will not send
            unsolicited marketing messages to Singapore telephone numbers registered with the DNC Registry,
            unless we have your clear and unambiguous consent to do so.
          </p>

          <h2>15. Updates to This Notice</h2>
          <p>
            We may update this PDPA Compliance Notice from time to time to reflect changes in our practices or
            applicable laws. The updated notice will be posted on this page with a revised date. We encourage
            you to review this notice periodically.
          </p>

          <h2>16. Contact Us</h2>
          <p>
            For any questions, feedback, or complaints regarding our personal data protection practices, or to
            exercise your rights under the PDPA, please contact our Data Protection Officer:
          </p>
          <p className="rounded-lg border border-border bg-muted/40 p-4 text-sm">
            <strong>Lendkaki Pay Pte. Ltd.</strong><br />
            UEN: 202607335C<br />
            2 Venture Drive, #19-21, Vision Exchange, Singapore 608526<br />
            Email:{" "}
            <a href="mailto:support@lendkaki.sg" className="text-primary hover:underline">
              support@lendkaki.sg
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            If you are not satisfied with our response, you may lodge a complaint with the Personal Data
            Protection Commission (PDPC) at{" "}
            <a
              href="https://www.pdpc.gov.sg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              www.pdpc.gov.sg
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
