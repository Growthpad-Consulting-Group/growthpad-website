import type { Metadata } from "next";
import PartnersHero from "@/features/for-partners/components/PartnersHero";
import PartnerProgram from "@/features/for-partners/components/PartnerProgram";
import PartnerSteps from "@/features/for-partners/components/PartnerSteps";
import PartnerServices from "@/features/for-partners/components/PartnerServices";
import ReferralBanner from "@/features/for-partners/components/ReferralBanner";
import ContactForm from "@/shared/components/ContactForm";
import ScrollColorTransition from "@/shared/components/ScrollColorTransition";
import SectionAnimate from "@/shared/components/SectionAnimate";

export const metadata: Metadata = {
  title: "Growthpad Partner Program: Boost African Business Growth - Partner With Us",
  description: "Join Growthpad's Partner Program to drive African business growth. Connect clients with our professional services. Partner with us for success.",
  keywords: [
    "Growthpad partner program",
    "business partnership Kenya",
    "referral program Africa",
    "digital consulting partners",
    "agency partnership Nairobi",
    "reseller program Kenya",
    "collaborate with Growthpad",
  ],
  alternates: {
    canonical: "https://www.growthpad.co.ke/for-partners",
  },
  openGraph: {
    title: "Growthpad Partner Program: Boost African Business Growth - Partner With Us",
    description: "Join Growthpad's Partner Program to drive African business growth. Connect clients with our professional services. Partner with us for success.",
    url: "https://www.growthpad.co.ke/for-partners",
    images: [
      {
        url: "/assets/images/seo/opengraph.png",
        alt: "Partner Program",
      },
    ],
  },
  twitter: {
    title: "Growthpad Partner Program: Boost African Business Growth - Partner With Us",
    description: "Join Growthpad's Partner Program to drive African business growth. Connect clients with our professional services. Partner with us for success.",
    images: ["/assets/images/seo/opengraph.png"],
  },
};

export default function ForPartnersPage() {
  return (
    <div className="flex flex-1 flex-col">
      <ScrollColorTransition />
      <PartnersHero />
      <SectionAnimate variant="fade-up">
        <PartnerProgram />
      </SectionAnimate>
      <PartnerSteps />
      <SectionAnimate variant="fade-up">
        <PartnerServices />
      </SectionAnimate>
      <ReferralBanner />
      <SectionAnimate variant="fade-up">
        <ContactForm theme="cream" showLogos={false} variant="wide-form" />
      </SectionAnimate>
    </div>
  );
}
