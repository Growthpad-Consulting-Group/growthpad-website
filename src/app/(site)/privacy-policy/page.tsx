import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@iconify/react";
import ScrollColorTransition from "@/shared/components/ScrollColorTransition";
import PrivacyPolicyContent from "@/features/privacy/components/PrivacyPolicyContent";
import TableOfContents from "@/features/blog/components/TableOfContents";
import type { Heading } from "@/features/blog/lib/toc";

export const metadata: Metadata = {
  title: "Privacy Policy | Growthpad Consulting Group",
  description:
    "Growthpad Consulting Group's commitment to data privacy, transparency, and the protection of your personal information.",
  openGraph: {
    title: "Privacy Policy | Growthpad Consulting Group",
    description:
      "Growthpad Consulting Group's commitment to data privacy, transparency, and the protection of your personal information.",
    url: "https://growthpad.co.ke/privacy-policy",
  },
};

const headings: Heading[] = [
  { id: "introduction", text: "Introduction", level: 2 },
  { id: "information-we-collect", text: "Information We Collect", level: 2 },
  { id: "how-we-use", text: "How We Use Your Information", level: 2 },
  { id: "disclosure", text: "Disclosure of Your Information", level: 2 },
  { id: "security", text: "Security", level: 2 },
  { id: "your-rights", text: "Your Data Rights", level: 2 },
  { id: "contact-us", text: "Contact Us", level: 2 },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-1 flex-col">
      <ScrollColorTransition />

      <main data-theme-section="light" className="theme-bg min-h-screen">
        {/* ── Hero ──────────────────────────────────────────────────── */}
        <div className="relative h-72 w-full overflow-hidden sm:h-88 lg:h-100">
          {/* Background */}
          <div className="absolute inset-0 bg-secondary" />
          {/* Subtle texture */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_80%_50%_at_50%_120%,_#f05d23,_transparent)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Back button */}
          <Link
            href="/"
            aria-label="Back to home"
            className="absolute top-6 left-6 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:top-10 sm:left-10"
          >
            <Icon icon="solar:arrow-left-linear" width={20} height={20} />
          </Link>

          {/* Title block */}
          <div className="absolute inset-x-0 bottom-0 z-10">
            <div className="container-fluid flex flex-col gap-3 pb-8 sm:pb-10">
              <span className="text-primary font-bold uppercase tracking-wider text-sm">
                Legal
              </span>
              <h1 className="font-display max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                Privacy Policy
              </h1>
              <div className="flex items-center gap-3 text-sm text-white/60">
                <span>Growthpad Consulting Group</span>
                <span>•</span>
                <span>Last updated: July 21, 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Article body + Sidebar ─────────────────────────────────── */}
        <div className="container mx-auto max-w-6xl px-6 py-16 sm:py-24 lg:grid lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start lg:gap-16">
          {/* Left: content */}
          <div className="max-w-4xl">
            <p className="text-lg leading-8 text-secondary/70 italic border-l-2 border-primary/30 pl-4 mb-10">
              At Growthpad Consulting Group, we value your privacy and are
              committed to transparency in how we collect and process your
              personal data.
            </p>

            {/* Client component renders the actual sections */}
            <PrivacyPolicyContent />
          </div>

          {/* Right: shared sticky TOC with scroll-tracking */}
          <TableOfContents headings={headings} />
        </div>
      </main>
    </div>
  );
}
