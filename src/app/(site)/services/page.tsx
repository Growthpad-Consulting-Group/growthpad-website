import type { Metadata } from "next";
import ServicesHero from "@/features/services/components/ServicesHero";
import OurSpecialties from "@/features/services/components/OurSpecialties";
import ContactForm from "@/shared/components/ContactForm";
import Partners from "@/shared/components/Partners";
import ScrollColorTransition from "@/shared/components/ScrollColorTransition";
import SectionAnimate from "@/shared/components/SectionAnimate";

export const metadata: Metadata = {
  title: "Expert Digital Services For Your Organization | Growthpad Consulting",
  description: "Explore our wide range of innovative digital services at Growthpad Consulting. From Communication for Development to IT Project Management, we deliver solutions for your organization's success",
  keywords: [
    "digital services Kenya",
    "communication for development",
    "IT project management Africa",
    "digital strategy consulting",
    "content production Kenya",
    "media consulting Nairobi",
    "Growthpad services",
    "digital transformation services",
  ],
  alternates: {
    canonical: "https://www.growthpad.co.ke/services",
  },
  openGraph: {
    title: "Expert Digital Services For Your Organization | Growthpad Consulting",
    description: "Explore our wide range of innovative digital services at Growthpad Consulting. From Communication for Development to IT Project Management, we deliver solutions for your organization's success",
    url: "https://www.growthpad.co.ke/services",
    images: [
      {
        url: "/assets/images/specialties-bg.png",
        alt: "digital services",
      },
    ],
  },
  twitter: {
    title: "Expert Digital Services For Your Organization | Growthpad Consulting",
    description: "Explore our wide range of innovative digital services at Growthpad Consulting. From Communication for Development to IT Project Management, we deliver solutions for your organization's success",
    images: ["/assets/images/specialties-bg.png"],
  },
};

export default function ServicesPage() {
  return (
    <div className="flex flex-1 flex-col">
      <ScrollColorTransition />
      <ServicesHero />
      <SectionAnimate variant="fade-up">
        <OurSpecialties showHeader={false} />
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
