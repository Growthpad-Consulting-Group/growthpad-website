import type { Metadata } from "next";
import MediaHero from "@/shared/components/MediaHero";
import PracticeAreasIntro from "@/features/practice-areas/components/PracticeAreasIntro";
import CoordinatedDelivery from "@/features/practice-areas/components/CoordinatedDelivery";
import PracticeAreasWithForm from "@/features/practice-areas/components/PracticeAreasWithForm";
import Partners from "@/shared/components/Partners";
import ScrollColorTransition from "@/shared/components/ScrollColorTransition";
import SectionAnimate from "@/shared/components/SectionAnimate";

export const metadata: Metadata = {
  title: "Practice Areas | Growthpad Consulting Group",
  description: "Explore our specialized practice areas in communication, digital delivery, learning systems and research organized around real-world progress.",
  keywords: [
    "practice areas",
    "consulting services",
    "digital consulting",
    "communication strategy",
    "learning systems",
    "research",
  ],
  alternates: {
    canonical: "https://growthpad.co.ke/practice-areas",
  },
  openGraph: {
    title: "Practice Areas | Growthpad Consulting Group",
    description: "Explore our specialized practice areas in communication, digital delivery, learning systems and research organized around real-world progress.",
    url: "https://growthpad.co.ke/practice-areas",
    images: [
      {
        url: "/assets/images/dna-hero.png",
        alt: "Practice Areas",
      },
    ],
  },
  twitter: {
    title: "Practice Areas | Growthpad Consulting Group",
    description: "Explore our specialized practice areas in communication, digital delivery, learning systems and research organized around real-world progress.",
    images: ["/assets/images/dna-hero.png"],
  },
};

export default function PracticeAreasPage() {
  return (
    <div className="flex flex-1 flex-col">
      <ScrollColorTransition />
      <MediaHero
        src="/assets/images/dna-hero.png"
        showBadge={false}
        showHeading={false}
        showArrows={false}
      />
      <SectionAnimate variant="fade-up">
        <PracticeAreasIntro />
      </SectionAnimate>
      <SectionAnimate variant="fade-up">
        <CoordinatedDelivery />
      </SectionAnimate>
      <PracticeAreasWithForm />
      <SectionAnimate variant="fade-up">
        <Partners showHeading={false} theme="light" />
      </SectionAnimate>
    </div>
  );
}
