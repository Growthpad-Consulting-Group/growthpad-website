import InsightsSection from "@/features/insights/components/InsightsSection";
import InsightsHero from "@/features/insights/components/InsightsHero";
import ScrollColorTransition from "@/shared/components/ScrollColorTransition";

export default function InsightsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <ScrollColorTransition />
      <InsightsHero />
      <InsightsSection />
    </div>
  );
}
