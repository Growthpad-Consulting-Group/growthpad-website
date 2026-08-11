import type { Metadata } from "next";
import MediaHero from "@/shared/components/MediaHero";
import DnaIntro from "@/features/our-dna/components/DnaIntro";
import OurHeritage from "@/features/our-dna/components/OurHeritage";
import CoreValues from "@/shared/components/CoreValues";
import PurposeAndPromise from "@/features/our-dna/components/PurposeAndPromise";
import WhyUs from "@/features/our-dna/components/WhyUs";
import ContactForm from "@/shared/components/ContactForm";
import Partners from "@/shared/components/Partners";
import ScrollColorTransition from "@/shared/components/ScrollColorTransition";
import SectionAnimate from "@/shared/components/SectionAnimate";

export const metadata: Metadata = {
  title: "About Growthpad Digital Consulting | Innovative Tech Solutions In Nairobi, Kenya",
  description: "Discover our story and commitment at Growthpad Digital Consulting. We're a top digital media and tech consulting firm in Nairobi, Kenya, driving innovation and business growth. Learn how we deliver outstanding results for clients with data-driven solutions. Join us in realizing your full potential through innovation and technology. | Innovative Tech Solutions",
  keywords: [
    "about Growthpad",
    "digital consulting Nairobi",
    "tech firm Kenya",
    "digital media company Africa",
    "innovative tech solutions Kenya",
    "Growthpad story",
    "data-driven consulting",
    "business growth Kenya",
  ],
  alternates: {
    canonical: "https://growthpad.co.ke/our-dna",
  },
  openGraph: {
    title: "About Growthpad Digital Consulting | Innovative Tech Solutions In Nairobi, Kenya",
    description: "Discover our story and commitment at Growthpad Digital Consulting. We're a top digital media and tech consulting firm in Nairobi, Kenya, driving innovation and business growth. Learn how we deliver outstanding results for clients with data-driven solutions. Join us in realizing your full potential through innovation and technology. | Innovative Tech Solutions",
    url: "https://growthpad.co.ke/our-dna",
    images: [
      {
        url: "/assets/images/dna-hero.png",
        alt: "innovative tech solutions",
      },
    ],
  },
  twitter: {
    title: "About Growthpad Digital Consulting | Innovative Tech Solutions In Nairobi, Kenya",
    description: "Discover our story and commitment at Growthpad Digital Consulting. We're a top digital media and tech consulting firm in Nairobi, Kenya, driving innovation and business growth. Learn how we deliver outstanding results for clients with data-driven solutions. Join us in realizing your full potential through innovation and technology. | Innovative Tech Solutions",
    images: ["/assets/images/dna-hero.png"],
  },
};

export default function OurDnaPage() {
  return (
    <div className="flex flex-1 flex-col">
      <ScrollColorTransition />
      <MediaHero />
      <SectionAnimate variant="fade-up">
        <DnaIntro />
      </SectionAnimate>
      <OurHeritage />
      <SectionAnimate variant="fade-up">
        <CoreValues />
      </SectionAnimate>
      <SectionAnimate variant="fade-up">
        <PurposeAndPromise />
      </SectionAnimate>
      <SectionAnimate variant="fade-up">
        <WhyUs />
      </SectionAnimate>
      <SectionAnimate variant="fade-up">
        <ContactForm theme="cream" variant="wide-form" />
      </SectionAnimate>
      <SectionAnimate variant="fade-up">
        <Partners showHeading={false} theme="light" />
      </SectionAnimate>
    </div>
  );
}
