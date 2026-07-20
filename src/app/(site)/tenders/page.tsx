import TendersSection from "@/features/tenders/components/TendersSection";
import TendersHero from "@/features/tenders/components/TendersHero";
import ScrollColorTransition from "@/shared/components/ScrollColorTransition";

export const metadata = {
  title: "Tenders | Growthpad Consulting Group",
  description:
    "Open tenders and procurement opportunities from Growthpad Consulting Group.",
};

export default function TendersPage() {
  return (
    <div className="flex flex-1 flex-col">
      <ScrollColorTransition />
      <TendersHero />
      <TendersSection />
    </div>
  );
}
