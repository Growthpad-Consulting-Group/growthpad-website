import InsightsGrid from "@/features/insights/components/InsightsGrid";
import { getInsights } from "@/sanity/queries";

export default async function InsightsSection() {
  const insights = await getInsights();

  return (
    <section
      data-theme-section="light"
      className="theme-bg relative w-full py-20 lg:py-28"
    >
      <div className="container-fluid flex flex-col gap-12">
        <InsightsGrid insights={insights} />
      </div>
    </section>
  );
}
