import type { Metadata } from "next";
import ProductsHero from "@/features/products/components/ProductsHero";
import ProductShowcase from "@/features/products/components/ProductShowcase";
import ContactForm from "@/shared/components/ContactForm";
import Partners from "@/shared/components/Partners";
import ScrollColorTransition from "@/shared/components/ScrollColorTransition";
import SectionAnimate from "@/shared/components/SectionAnimate";

export const metadata: Metadata = {
  title: "Products | Growthpad Consulting Group",
  description: "Explore Growthpad's suite of digital products built for African businesses — from data intelligence platforms to content management and audience engagement tools that drive measurable impact.",
  keywords: [
    "digital products Kenya",
    "Growthpad products",
    "business software Nairobi",
    "digital tools Africa",
    "data intelligence platform",
    "audience engagement tools",
    "content management Kenya",
  ],
  alternates: {
    canonical: "https://growthpad.co.ke/products",
  },
  openGraph: {
    title: "Products | Growthpad Consulting Group",
    description: "Explore Growthpad's suite of digital products built for African businesses — from data intelligence platforms to content management and audience engagement tools that drive measurable impact.",
    url: "https://growthpad.co.ke/products",
    images: [
      {
        url: "/assets/images/seo/opengraph.png",
        alt: "Growthpad Products",
      },
    ],
  },
  twitter: {
    title: "Products | Growthpad Consulting Group",
    description: "Explore Growthpad's suite of digital products built for African businesses — from data intelligence platforms to content management and audience engagement tools that drive measurable impact.",
    images: ["/assets/images/seo/opengraph.png"],
  },
};

export default function ProductsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <ScrollColorTransition />
      <ProductsHero />
      <ProductShowcase />
      <SectionAnimate variant="fade-up">
        <ContactForm theme="cream" variant="wide-form" />
      </SectionAnimate>
      <SectionAnimate variant="fade-up">
        <Partners showHeading={false} theme="light" />
      </SectionAnimate>
    </div>
  );
}
