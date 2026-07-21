import type { Metadata } from "next";
import ScrollColorTransition from "@/shared/components/ScrollColorTransition";

export const metadata: Metadata = {
  title: "Privacy Policy | Growthpad Consulting Group",
  description: "Growthpad Consulting Group's commitment to data privacy, transparency, and the protection of your personal information.",
  openGraph: {
    title: "Privacy Policy | Growthpad Consulting Group",
    description: "Growthpad Consulting Group's commitment to data privacy, transparency, and the protection of your personal information.",
    url: "https://growthpad.co.ke/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "1. Introduction",
      content:
        'Growthpad Consulting Group ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website (growthpad.co.ke) and engage with our consulting, technology, and communications services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.',
    },
    {
      title: "2. Information We Collect",
      content:
        "We may collect information about you in a variety of ways. The information we may collect on the Site includes:\n\n• **Personal Data**: Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you choose to submit inquiries through our contact forms or apply for careers.\n\n• **Derivative Data**: Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.",
    },
    {
      title: "3. How We Use Your Information",
      content:
        "Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:\n\n• Respond to customer service requests and business inquiries.\n• Process job applications and screen candidate credentials.\n• Deliver newsletters, marketing materials, and other information regarding our consulting and technology offerings.\n• Analyze usage statistics and improve the functionality of our website and services.\n• Prevent fraudulent transactions and monitor against theft.",
    },
    {
      title: "4. Disclosure of Your Information",
      content:
        "We may share information we have collected about you in certain situations. Your information may be disclosed as follows:\n\n• **By Law or to Protect Rights**: If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.\n\n• **Third-Party Service Providers**: We may share your information with third parties that perform services for us or on our behalf, including email delivery services (such as Resend) and analytics tools (such as Google Analytics).",
    },
    {
      title: "5. Security of Your Information",
      content:
        "We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.",
    },
    {
      title: "6. Your Data Rights",
      content:
        "Depending on your location, you may have the following rights regarding your personal data:\n\n• The right to access and receive a copy of the personal data we hold about you.\n• The right to request correction of any inaccurate or incomplete personal data.\n• The right to request erasure of your personal data under certain conditions.\n• The right to object to or restrict our processing of your personal data.\n\nTo exercise any of these rights, please contact us using the details provided below.",
    },
    {
      title: "7. Contact Us",
      content:
        "If you have questions or comments about this Privacy Policy, please contact us at:\n\n**Growthpad Consulting Group**\n7th Floor, Mitsumi Business Park,\nWestlands – Nairobi, Kenya\nEmail: strategic@growthpad.co.ke / careers@growthpad.co.ke",
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <ScrollColorTransition />

      <main data-theme-section="light" className="theme-bg min-h-screen">
        {/* Simple Page Header */}
        <section className="relative w-full overflow-hidden border-b border-secondary/5 py-20 lg:py-24">
          <div className="container mx-auto max-w-4xl px-6">
            <h1 className="font-display text-secondary text-4xl font-bold sm:text-5xl lg:text-6xl">
              Privacy Policy
            </h1>
            <p className="text-secondary/50 mt-4 text-sm font-semibold uppercase tracking-wider">
              Last updated: July 21, 2026
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto max-w-4xl px-6">
            <article className="prose prose-lg max-w-none text-secondary">
              <p className="text-secondary/80 text-lg leading-8 italic border-l-2 border-primary/30 pl-4 mb-12">
                At Growthpad Consulting Group, we value your privacy and are committed to transparency in how we collect and process your personal data.
              </p>

              <div className="flex flex-col gap-12">
                {sections.map((section) => (
                  <div key={section.title} className="flex flex-col gap-4">
                    <h2 className="font-display text-secondary text-2xl font-bold">
                      {section.title}
                    </h2>
                    <div className="text-secondary/80 text-base leading-8 whitespace-pre-wrap">
                      {section.content}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
