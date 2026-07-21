import type { Metadata } from "next";
import ProductsHero from "@/features/products/components/ProductsHero";
import ProductShowcase from "@/features/products/components/ProductShowcase";
import ContactForm from "@/shared/components/ContactForm";
import Partners from "@/shared/components/Partners";
import ScrollColorTransition from "@/shared/components/ScrollColorTransition";
import SectionAnimate from "@/shared/components/SectionAnimate";

export const metadata: Metadata = {
  title: "Products | Growthpad Consulting Group",
  description: "The modern fast-paced world, demands a workforce with up-to-date skills & knowledge, and committing to continuous learning is the only way to stay ahead.",
  openGraph: {
    title: "Products | Growthpad Consulting Group",
    description: "The modern fast-paced world, demands a workforce with up-to-date skills & knowledge, and committing to continuous learning is the only way to stay ahead.",
    url: "https://growthpad.co.ke/products",
    images: [
      {
        url: "/assets/images/seo/opengraph.png",
        alt: "Products",
      },
    ],
  },
  twitter: {
    title: "Products | Growthpad Consulting Group",
    description: "The modern fast-paced world, demands a workforce with up-to-date skills & knowledge, and committing to continuous learning is the only way to stay ahead.",
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
        <ContactForm theme="cream" />
      </SectionAnimate>
      <SectionAnimate variant="fade-up">
        <Partners showHeading={false} theme="light" />
      </SectionAnimate>
    </div>
  );
}
