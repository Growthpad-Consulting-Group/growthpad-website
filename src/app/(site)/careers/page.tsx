import type { Metadata } from "next";
import MediaHero from "@/shared/components/MediaHero";
import CoreValues from "@/shared/components/CoreValues";
import CareersCulture from "@/features/careers/components/CareersCulture";
import CareersBenefits from "@/features/careers/components/CareersBenefits";
import CareersOpenings from "@/features/careers/components/CareersOpenings";
import CareersApplication from "@/features/careers/components/CareersApplication";
import TeamStories from "@/shared/components/TeamStories";
import ScrollColorTransition from "@/shared/components/ScrollColorTransition";
import SectionAnimate from "@/shared/components/SectionAnimate";

export const metadata: Metadata = {
  title: "Join Growthpad: Explore Exciting Career Opportunities In Digital Consulting",
  description: "Discover a fulfilling career at Growthpad Digital Consulting. We're constantly seeking talented individuals to join our innovative team. Explore exciting opportunities in digital consulting and be part of our success story | career opportunities",
  openGraph: {
    title: "Join Growthpad: Explore Exciting Career Opportunities In Digital Consulting",
    description: "Discover a fulfilling career at Growthpad Digital Consulting. We're constantly seeking talented individuals to join our innovative team. Explore exciting opportunities in digital consulting and be part of our success story | career opportunities",
    url: "https://growthpad.co.ke/careers",
    images: [
      {
        url: "/assets/images/specialties-bg.png",
        alt: "career opportunities",
      },
    ],
  },
  twitter: {
    title: "Join Growthpad: Explore Exciting Career Opportunities In Digital Consulting",
    description: "Discover a fulfilling career at Growthpad Digital Consulting. We're constantly seeking talented individuals to join our innovative team. Explore exciting opportunities in digital consulting and be part of our success story | career opportunities",
    images: ["/assets/images/specialties-bg.png"],
  },
};

export default function CareersPage() {
  return (
    <div className="flex flex-1 flex-col">
      <ScrollColorTransition />
      <MediaHero
        src="/assets/images/specialties-bg.png"
        aspectRatio="1280/525"
        showBadge={false}
        showHeading={false}
        showArrows={false}
      />
      <SectionAnimate variant="fade-up">
        <CoreValues theme="dark" />
      </SectionAnimate>
      <SectionAnimate variant="fade-up">
        <CareersCulture />
      </SectionAnimate>
      <SectionAnimate variant="fade-up">
        <CareersBenefits />
      </SectionAnimate>
      <SectionAnimate variant="fade-up">
        <CareersOpenings />
      </SectionAnimate>
      <TeamStories />
      <SectionAnimate variant="fade-up">
        <CareersApplication />
      </SectionAnimate>
    </div>
  );
}
