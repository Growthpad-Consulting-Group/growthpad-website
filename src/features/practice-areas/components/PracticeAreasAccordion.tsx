import PracticeAreasAccordionCustom from "@/features/practice-areas/components/PracticeAreasAccordionCustom";
import { practiceAreasAccordion } from "@/features/practice-areas/data/practiceAreasAccordion";

export default function PracticeAreasAccordion({ onCTAClick }: { onCTAClick?: (title: string, cta: string) => void }) {
  return (
    <section className="theme-bg theme-fg w-full pt-0 pb-20 lg:pb-28">
      <div className="container-fluid">
        <PracticeAreasAccordionCustom items={practiceAreasAccordion} onCTAClick={onCTAClick} />
      </div>
    </section>
  );
}
