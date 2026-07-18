import DnaHero from "@/components/DnaHero";
import DnaIntro from "@/components/DnaIntro";
import OurHeritage from "@/components/OurHeritage";
import ScrollColorTransition from "@/components/ScrollColorTransition";
import SectionAnimate from "@/components/SectionAnimate";

export default function OurDnaPage() {
  return (
    <div className="flex flex-1 flex-col">
      <ScrollColorTransition />
      <DnaHero />
      <SectionAnimate variant="fade-up">
        <DnaIntro />
      </SectionAnimate>
      <OurHeritage />
    </div>
  );
}
