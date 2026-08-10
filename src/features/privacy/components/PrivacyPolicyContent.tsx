"use client";

import Link from "next/link";

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: (
      <>
        <p className="mt-4 mb-4 text-base leading-8 text-secondary/80">
          Growthpad Consulting Group (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to
          protecting your privacy. This Privacy Policy explains how we collect,
          use, disclose, and safeguard your information when you visit our
          website (<Link href="https://www.growthpad.co.ke" className="text-primary underline hover:text-primary/80 transition-colors">growthpad.co.ke</Link>)
          and engage with our consulting, technology, and communications
          services.
        </p>
        <p className="mt-4 mb-4 text-base leading-8 text-secondary/80">
          Please read this policy carefully. If you do not agree with its terms,
          please do not access the site.
        </p>
      </>
    ),
  },
  {
    id: "information-we-collect",
    title: "2. Information We Collect",
    content: (
      <>
        <p className="mt-4 mb-4 text-base leading-8 text-secondary/80">
          We may collect information about you in a variety of ways, including:
        </p>
        <ul className="mt-4 mb-4 list-disc pl-6 space-y-2 text-secondary/80">
          <li className="text-base leading-7">
            <strong>Personal Data</strong> — Personally identifiable information
            such as your name, email address, and telephone number that you
            voluntarily provide when submitting inquiries or applying for
            careers.
          </li>
          <li className="text-base leading-7">
            <strong>Derivative Data</strong> — Information our servers
            automatically collect when you access the site, such as your IP
            address, browser type, operating system, and the pages you have
            viewed.
          </li>
          <li className="text-base leading-7">
            <strong>Analytics Data</strong> — Aggregated, anonymized usage
            statistics collected via Google Analytics to help us understand how
            visitors interact with our site. Analytics data is only collected
            after you have given your explicit consent via the cookie banner.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "3. How We Use Your Information",
    content: (
      <>
        <p className="mt-4 mb-4 text-base leading-8 text-secondary/80">
          Having accurate information about you permits us to provide a smooth,
          efficient, and customised experience. Specifically, we may use
          information to:
        </p>
        <ul className="mt-4 mb-4 list-disc pl-6 space-y-2 text-secondary/80">
          <li className="text-base leading-7">Respond to customer service requests and business inquiries.</li>
          <li className="text-base leading-7">Process job applications and screen candidate credentials.</li>
          <li className="text-base leading-7">
            Deliver newsletters, marketing materials, and other information
            regarding our consulting and technology offerings.
          </li>
          <li className="text-base leading-7">
            Analyse usage statistics and improve the functionality of our
            website and services.
          </li>
          <li className="text-base leading-7">Prevent fraudulent transactions and monitor against misuse.</li>
        </ul>
      </>
    ),
  },
  {
    id: "disclosure",
    title: "4. Disclosure of Your Information",
    content: (
      <>
        <p className="mt-4 mb-4 text-base leading-8 text-secondary/80">
          We may share information we have collected about you in certain
          situations:
        </p>
        <ul className="mt-4 mb-4 list-disc pl-6 space-y-2 text-secondary/80">
          <li className="text-base leading-7">
            <strong>By Law or to Protect Rights</strong> — If we believe the
            release of information is necessary to respond to legal process or to
            protect the rights, property, and safety of others.
          </li>
          <li className="text-base leading-7">
            <strong>Third-Party Service Providers</strong> — We may share your
            information with third parties that perform services on our behalf,
            including email delivery (Resend) and analytics tools (Google
            Analytics). These providers are contractually obligated to keep your
            data confidential.
          </li>
        </ul>
        <p className="mt-4 mb-4 text-base leading-8 text-secondary/80">
          We do not sell, trade, or otherwise transfer your personal information
          to outside parties for marketing purposes.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "5. Security of Your Information",
    content: (
      <p className="mt-4 mb-4 text-base leading-8 text-secondary/80">
        We use administrative, technical, and physical security measures to help
        protect your personal information. While we have taken reasonable steps
        to secure your data, please be aware that no security measures are
        perfect or impenetrable, and no method of data transmission can be
        guaranteed against interception or misuse.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "6. Your Data Rights",
    content: (
      <>
        <p className="mt-4 mb-4 text-base leading-8 text-secondary/80">
          In accordance with Kenya&apos;s Data Protection Act (2019) and
          applicable international standards, you may have the following rights
          regarding your personal data:
        </p>
        <ul className="mt-4 mb-4 list-disc pl-6 space-y-2 text-secondary/80">
          <li className="text-base leading-7">The right to access and receive a copy of the personal data we hold about you.</li>
          <li className="text-base leading-7">The right to request correction of inaccurate or incomplete personal data.</li>
          <li className="text-base leading-7">The right to request erasure of your personal data under certain conditions.</li>
          <li className="text-base leading-7">The right to object to or restrict our processing of your personal data.</li>
          <li className="text-base leading-7">The right to withdraw consent at any time (e.g., via the cookie preference banner).</li>
        </ul>
        <p className="mt-4 mb-4 text-base leading-8 text-secondary/80">
          To exercise any of these rights, please contact us using the details
          in the section below.
        </p>
      </>
    ),
  },
  {
    id: "contact-us",
    title: "7. Contact Us",
    content: (
      <>
        <p className="mt-4 mb-4 text-base leading-8 text-secondary/80">
          If you have questions or comments about this Privacy Policy, please
          contact us at:
        </p>
        <blockquote className="my-6 border-l-4 border-primary pl-4 italic text-secondary bg-primary/5 p-4 rounded-r-xl">
          <p className="font-semibold not-italic text-secondary">Growthpad Consulting Group</p>
          <p className="text-secondary/80">The Westwood Office, 6th Floor 6A, Comply Guide Advisory, Westlands, Nairobi Kenya</p>
          <p className="text-secondary/80 mt-2">
            Business enquiries:{" "}
            <Link href="mailto:strategic@growthpad.co.ke" className="text-primary underline hover:text-primary/80 transition-colors">
              strategic@growthpad.co.ke
            </Link>
          </p>
          <p className="text-secondary/80">
            Careers:{" "}
            <Link href="mailto:careers@growthpad.co.ke" className="text-primary underline hover:text-primary/80 transition-colors">
              careers@growthpad.co.ke
            </Link>
          </p>
        </blockquote>
      </>
    ),
  },
];

export default function PrivacyPolicyContent() {
  return (
    <article className="prose prose-lg max-w-none text-secondary">
      {sections.map((section) => (
        <div key={section.id} id={section.id} className="scroll-mt-28">
          <h2 className="mt-8 mb-4 text-2xl font-display font-bold text-secondary">
            {section.title}
          </h2>
          {section.content}
        </div>
      ))}
    </article>
  );
}
