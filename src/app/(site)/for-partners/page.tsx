import PartnersHero from "@/features/for-partners/components/PartnersHero";
import PartnerProgram from "@/features/for-partners/components/PartnerProgram";
import PartnerSteps from "@/features/for-partners/components/PartnerSteps";
import PartnerServices from "@/features/for-partners/components/PartnerServices";
import ReferralBanner from "@/features/for-partners/components/ReferralBanner";
import ContactForm from "@/shared/components/ContactForm";
import ScrollColorTransition from "@/shared/components/ScrollColorTransition";
import SectionAnimate from "@/shared/components/SectionAnimate";

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
        <ContactForm theme="cream" showLogos={false} />
      </SectionAnimate>
    </div>
  );
}
