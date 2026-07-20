import ProjectInquiry from "@/features/contact/components/ProjectInquiry";
import ImpactSection from "@/features/contact/components/ImpactSection";
import FaqSection from "@/features/contact/components/FaqSection";
import ScrollColorTransition from "@/shared/components/ScrollColorTransition";
import SectionAnimate from "@/shared/components/SectionAnimate";

export default function ContactPage() {
  return (
    <div className="flex flex-1 flex-col">
      <ScrollColorTransition />
      <ProjectInquiry />
      <SectionAnimate variant="fade-up">
        <ImpactSection />
      </SectionAnimate>
      <SectionAnimate variant="fade-up">
        <FaqSection />
      </SectionAnimate>
    </div>
  );
}
