import type { Metadata } from "next";
import InsightsSection from "@/features/insights/components/InsightsSection";
import InsightsHero from "@/features/insights/components/InsightsHero";
import ScrollColorTransition from "@/shared/components/ScrollColorTransition";

export const metadata: Metadata = {
  title: "Insights | Growthpad Consulting Group",
  description: "Stay updated with the latest insights, trends, and strategies from Growthpad Consulting Group.",
  openGraph: {
    title: "Insights | Growthpad Consulting Group",
    description: "Stay updated with the latest insights, trends, and strategies from Growthpad Consulting Group.",
    url: "https://growthpad.co.ke/insights",
    images: [
      {
        url: "/assets/images/seo/opengraph.png",
        alt: "Insights",
      },
    ],
  },
  twitter: {
    title: "Insights | Growthpad Consulting Group",
    description: "Stay updated with the latest insights, trends, and strategies from Growthpad Consulting Group.",
    images: ["/assets/images/seo/opengraph.png"],
  },
};

export default function InsightsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <ScrollColorTransition />
      <InsightsHero />
      <InsightsSection />
    </div>
  );
}
