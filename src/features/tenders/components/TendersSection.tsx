import TendersGrid from "@/features/tenders/components/TendersGrid";
import { getTenders } from "@/sanity/queries";

export default async function TendersSection() {
  const tenders = await getTenders();

  return (
    <section
      data-theme-section="light"
      className="theme-bg relative w-full py-20 lg:py-28"
    >
      <div className="container-fluid flex flex-col gap-12">
        <TendersGrid tenders={tenders} />
      </div>
    </section>
  );
}
