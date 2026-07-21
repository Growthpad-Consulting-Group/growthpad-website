import type { Metadata } from "next";
import TendersSection from "@/features/tenders/components/TendersSection";
import TendersHero from "@/features/tenders/components/TendersHero";
import ScrollColorTransition from "@/shared/components/ScrollColorTransition";

export const metadata: Metadata = {
  title: "Tenders | Growthpad Consulting Group",
  description: "Active Registration of Suppliers 2024-2025",
  openGraph: {
    title: "Tenders | Growthpad Consulting Group",
    description: "Active Registration of Suppliers 2024-2025",
    url: "https://growthpad.co.ke/tenders",
    images: [
      {
        url: "/assets/images/tender-bg.jpg",
        alt: "Tenders",
      },
    ],
  },
  twitter: {
    title: "Tenders | Growthpad Consulting Group",
    description: "Active Registration of Suppliers 2024-2025",
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
