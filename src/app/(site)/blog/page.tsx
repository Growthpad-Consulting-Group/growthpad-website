import type { Metadata } from "next";
import BlogHero from "@/features/blog/components/BlogHero";
import BlogSection from "@/features/blog/components/BlogSection";
import ScrollColorTransition from "@/shared/components/ScrollColorTransition";

export const metadata: Metadata = {
  title: "Growthpad Business Insights",
  description: "Discover a selection of well curated insights on digital marketing in Kenya from our experts. Our blog provides latest digital marketing trends. | Insights",
  alternates: {
    types: {
      "application/rss+xml": "/blog/rss.xml",
    },
  },
  openGraph: {
    title: "Growthpad Business Insights",
    description: "Discover a selection of well curated insights on digital marketing in Kenya from our experts. Our blog provides latest digital marketing trends. | Insights",
    url: "https://growthpad.co.ke/blog",
    images: [
      {
        url: "/assets/images/seo/opengraph.png",
        alt: "Insights",
      },
    ],
  },
  twitter: {
    title: "Growthpad Business Insights",
    description: "Discover a selection of well curated insights on digital marketing in Kenya from our experts. Our blog provides latest digital marketing trends. | Insights",
    images: ["/assets/images/seo/opengraph.png"],
  },
};

export default function BlogPage() {
  return (
    <div className="flex flex-1 flex-col">
      <ScrollColorTransition />
      <BlogHero />
      <BlogSection />
    </div>
  );
}
