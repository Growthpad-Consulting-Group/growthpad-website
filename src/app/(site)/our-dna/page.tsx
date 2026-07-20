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
        <ContactForm theme="cream" />
      </SectionAnimate>
      <SectionAnimate variant="fade-up">
        <Partners showHeading={false} theme="light" />
      </SectionAnimate>
    </div>
  );
}
