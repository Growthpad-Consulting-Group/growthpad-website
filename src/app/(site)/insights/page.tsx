import type { Metadata } from "next";
import InsightsSection from "@/features/insights/components/InsightsSection";
import InsightsHero from "@/features/insights/components/InsightsHero";
import ScrollColorTransition from "@/shared/components/ScrollColorTransition";

export const metadata: Metadata = {
  title: "Insights | Growthpad Consulting Group",
  description: "Access curated research reports, white papers, and industry insights from Growthpad's experts. Explore data-driven analysis on digital transformation, communication for development, and business growth in Africa.",
  keywords: [
    "digital insights Africa",
    "research reports Kenya",
    "white papers digital marketing",
    "business intelligence Africa",
    "communication for development insights",
    "digital transformation reports",
    "Growthpad research",
  ],
  alternates: {
    canonical: "https://www.growthpad.co.ke/insights",
  },
  openGraph: {
    title: "Insights | Growthpad Consulting Group",
    description: "Access curated research reports, white papers, and industry insights from Growthpad's experts. Explore data-driven analysis on digital transformation, communication for development, and business growth in Africa.",
    url: "https://www.growthpad.co.ke/insights",
    images: [
      {
        url: "/assets/images/seo/opengraph.png",
        alt: "Growthpad Insights",
      },
    ],
  },
  twitter: {
    title: "Insights | Growthpad Consulting Group",
    description: "Access curated research reports, white papers, and industry insights from Growthpad's experts. Explore data-driven analysis on digital transformation, communication for development, and business growth in Africa.",
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
