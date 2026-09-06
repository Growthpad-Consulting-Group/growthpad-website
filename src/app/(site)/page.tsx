import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Growthpad Consulting Group | Technology, Digital Media And Communication Firm",
  description: "Elevate your business with Growthpad, a leading digital consulting firm in Nairobi. Our innovative solutions and bold strategies drive success through digital technology.",
  keywords: [
    "digital consulting Kenya",
    "digital marketing Nairobi",
    "technology consulting Africa",
    "digital media firm Kenya",
    "business growth consultancy",
    "Growthpad Consulting Group",
    "communication firm Nairobi",
    "IT consulting Kenya",
  ],
  alternates: {
    canonical: "https://growthpad.co.ke/",
  },
  openGraph: {
    title: "Growthpad Consulting Group | Technology, Digital Media And Communication Firm",
    description: "Elevate your business with Growthpad, a leading digital consulting firm in Nairobi. Our innovative solutions and bold strategies drive success through digital technology.",
    url: "https://growthpad.co.ke/",
    images: [
      {
        url: "/assets/images/seo/opengraph.png",
        width: 1920,
        height: 630,
        alt: "Growthpad Consulting Group",
      },
    ],
  },
  twitter: {
    title: "Growthpad Consulting Group | Technology, Digital Media And Communication Firm",
    description: "Elevate your business with Growthpad, a leading digital consulting firm in Nairobi. Our innovative solutions and bold strategies drive success through digital technology.",
    images: ["/assets/images/seo/opengraph.png"],
  },
};

import Hero from "@/features/home/components/Hero";
import About from "@/features/home/components/About";
import PriorityMarkets from "@/features/home/components/PriorityMarkets";
import Ambition from "@/features/home/components/Ambition";
import SpecialtiesTimeline from "@/features/home/components/SpecialtiesTimeline";
import PickACard from "@/features/home/components/PickACard";
import Clients from "@/features/home/components/Clients";
import OfficeGallery from "@/features/home/components/OfficeGallery";
import OurWork from "@/features/home/components/OurWork";
import Testimonials from "@/features/home/components/Testimonials";
import TeamStories from "@/shared/components/TeamStories";
import Partners from "@/shared/components/Partners";
import Affiliations from "@/features/home/components/Affiliations";
import ContactForm from "@/shared/components/ContactForm";
import ScrollColorTransition from "@/shared/components/ScrollColorTransition";
import SectionAnimate from "@/shared/components/SectionAnimate";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <ScrollColorTransition />
      <Hero />
      <SectionAnimate variant="fade-up">
        <About />
      </SectionAnimate>
      <PriorityMarkets />
      <SectionAnimate variant="fade-up" delay={0.1}>
        <Ambition />
      </SectionAnimate>
      <SectionAnimate variant="fade-up" delay={0.15}>
        <SpecialtiesTimeline />
      </SectionAnimate>
      <SectionAnimate variant="fade-up" delay={0.2}>
        <PickACard />
      </SectionAnimate>
      <SectionAnimate variant="fade-up" delay={0.25}>
        <Clients />
      </SectionAnimate>
      <OurWork />
      <Testimonials />
      <SectionAnimate variant="fade-up" delay={0.05}>
        <Partners />
      </SectionAnimate>
      <SectionAnimate variant="fade-up" delay={0.1}>
        <OfficeGallery />
      </SectionAnimate>
      <SectionAnimate variant="fade-up" delay={0.15}>
        <Affiliations />
      </SectionAnimate>
      <TeamStories />
      <SectionAnimate variant="fade-up" delay={0.1}>
        <div id="contact-form">
          <ContactForm variant="home" />
        </div>
      </SectionAnimate>
    </div>
  );
}
