import ArrowGroup from "@/shared/components/ArrowGroup";
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
        <div className="relative">
          <h1 className="font-display text-secondary text-center text-4xl font-bold sm:text-5xl">
            Insights
          </h1>
          <ArrowGroup
            count={4}
            className="absolute top-1/2 right-0 hidden -translate-y-1/2 sm:flex"
          />
        </div>

        <InsightsGrid insights={insights} />
      </div>
    </section>
  );
}
