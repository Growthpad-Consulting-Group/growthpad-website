"use client";

import { useRef, useState } from "react";
import PracticeAreasAccordion from "@/features/practice-areas/components/PracticeAreasAccordion";
import ContactForm from "@/shared/components/ContactForm";
import { practiceAreasAccordion } from "@/features/practice-areas/data/practiceAreasAccordion";

export type SelectedPracticeArea = {
  title: string;
  cta: string;
} | null;

export default function PracticeAreasWithForm() {
  const [selectedPracticeArea, setSelectedPracticeArea] = useState<SelectedPracticeArea>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const handleCTAClick = (title: string, cta: string) => {
    setSelectedPracticeArea({ title, cta });
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const practiceAreaTitles = practiceAreasAccordion.map((area) => area.title);

  return (
    <>
      <PracticeAreasAccordion onCTAClick={handleCTAClick} />
      <div ref={formRef}>
        <ContactForm
          theme="cream"
          variant="wide-form"
          description=""
          serviceOptions={practiceAreaTitles}
          selectedService={selectedPracticeArea?.title}
        />
      </div>
    </>
  );
}
