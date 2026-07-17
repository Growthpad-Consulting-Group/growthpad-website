import DnaHero from "@/components/DnaHero";
import DnaIntro from "@/components/DnaIntro";
import SectionAnimate from "@/components/SectionAnimate";

export default function OurDnaPage() {
  return (
    <div className="flex flex-1 flex-col">
      <DnaHero />
      <SectionAnimate variant="fade-up">
        <DnaIntro />
      </SectionAnimate>
    </div>
  );
}
