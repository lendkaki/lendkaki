"use client";

import { FaqSection } from "@/components/ui/faq-section";

const FAQ_ITEMS = [
  {
    question: "How does LendKaki work?",
    answer:
      "LendKaki is a free loan comparison platform. Simply fill out one application form with your loan requirements, and we'll match you with offers from 50+ licensed lenders in Singapore. You'll receive personalized rates without any credit score impact, allowing you to compare and choose the best option for your needs.",
  },
  {
    question: "Is LendKaki's service really free?",
    answer:
      "Yes, absolutely! LendKaki is 100% free for borrowers. We earn a commission from lenders when you successfully take up a loan, so there are no hidden fees or charges for using our platform. You pay nothing to compare rates and apply.",
  },
  {
    question: "Will checking rates affect my credit score?",
    answer:
      "No, checking your rates on LendKaki will not affect your credit score. We use a soft credit inquiry that doesn't impact your credit report. Only when you proceed to accept a loan offer and the lender performs a hard credit check will it affect your score.",
  },
  {
    question: "How quickly can I get approved?",
    answer:
      "Most applications are processed within minutes, and you'll typically receive loan offers within 24 hours. Once you accept an offer, funds can be disbursed as quickly as the same day, depending on the lender and your documentation. Some lenders offer instant approval for amounts up to $30,000.",
  },
  {
    question: "What types of loans can I apply for?",
    answer:
      "LendKaki helps you find personal loans, business loans, bridging loans, debt consolidation loans, renovation loans, and more. Loan amounts range from $1,000 to $300,000 with flexible repayment terms from 3 to 72 months.",
  },
  {
    question: "Who are the lenders on your platform?",
    answer:
      "We partner with 50+ licensed moneylenders and financial institutions in Singapore, including major banks like DBS, OCBC, UOB, and reputable licensed moneylenders. All our partners are licensed by the Ministry of Law and follow strict lending regulations.",
  },
  {
    question: "What are the eligibility requirements?",
    answer:
      "Generally, you must be at least 21 years old, a Singapore Citizen or PR (some lenders accept foreigners), and have a minimum monthly income. Specific requirements vary by lender and loan type. Self-employed individuals and those with past credit issues may still qualify with certain lenders.",
  },
  {
    question: "What documents do I need to prepare?",
    answer:
      "Typically, you'll need your NRIC, proof of income (latest payslips or bank statements), and proof of address. For business loans, additional documents like business registration and financial statements may be required. With Singpass integration (coming soon), many documents can be auto-filled.",
  },
  {
    question: "Can I apply if I have bad credit or existing loans?",
    answer:
      "Yes! We work with lenders who specialize in various credit profiles. Even if you have existing loans, bad credit history, or have been rejected by banks, some of our partner lenders may still be able to help you. Rates and terms will vary based on your credit situation.",
  },
  {
    question: "Is my personal information secure?",
    answer:
      "Absolutely. We use bank-level 256-bit SSL encryption to protect your data. Your information is only shared with lenders you choose to proceed with, and we never sell your data to third parties. We comply with Singapore's Personal Data Protection Act (PDPA).",
  },
];

export function Faq() {
  return (
    <FaqSection
      title="Frequently Asked Questions"
      description="Everything you need to know about finding your perfect loan"
      items={FAQ_ITEMS}
      contactInfo={{
        title: "Still have questions?",
        description: "Our team is here to help you make the right decision",
        buttonText: "Contact Support",
        onContact: () => {
          window.location.href = "mailto:support@lendkaki.sg";
        },
      }}
    />
  );
}
