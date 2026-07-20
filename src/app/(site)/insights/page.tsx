import InsightsSection from "@/features/insights/components/InsightsSection";
import ScrollColorTransition from "@/shared/components/ScrollColorTransition";

export default function InsightsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <ScrollColorTransition />
      <InsightsSection />
    </div>
  );
}
