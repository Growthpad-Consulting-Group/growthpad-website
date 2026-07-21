import type { Metadata } from "next";
import TendersSection from "@/features/tenders/components/TendersSection";
import TendersHero from "@/features/tenders/components/TendersHero";
import ScrollColorTransition from "@/shared/components/ScrollColorTransition";

export const metadata: Metadata = {
  title: "Tenders | Growthpad Consulting Group",
  description: "View active procurement opportunities and supplier registration at Growthpad Consulting Group. Submit expressions of interest for open tenders across consulting, technology, and digital media categories.",
  keywords: [
    "Growthpad tenders",
    "procurement Kenya",
    "supplier registration Kenya",
    "open tenders Nairobi",
    "consulting tenders Africa",
    "technology procurement Kenya",
  ],
  alternates: {
    canonical: "https://growthpad.co.ke/tenders",
  },
  openGraph: {
    title: "Tenders | Growthpad Consulting Group",
    description: "View active procurement opportunities and supplier registration at Growthpad Consulting Group. Submit expressions of interest for open tenders across consulting, technology, and digital media categories.",
    url: "https://growthpad.co.ke/tenders",
    images: [
      {
        url: "/assets/images/tender-bg.jpg",
        alt: "Growthpad Tenders",
      },
    ],
  },
  twitter: {
    title: "Tenders | Growthpad Consulting Group",
    description: "View active procurement opportunities and supplier registration at Growthpad Consulting Group. Submit expressions of interest for open tenders across consulting, technology, and digital media categories.",
    images: ["/assets/images/tender-bg.jpg"],
  },
};

export default function TendersPage() {
  return (
    <div className="flex flex-1 flex-col">
      <ScrollColorTransition />
      <TendersHero />
      <TendersSection />
    </div>
  );
}
