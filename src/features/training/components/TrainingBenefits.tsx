import Image from "next/image";
import ArrowGroup from "@/shared/components/ArrowGroup";

export default function TrainingBenefits() {
  return (
    <section data-theme-section="gray" className="theme-bg w-full py-20 lg:py-28">
      <div className="container-fluid flex flex-col gap-16 lg:gap-20">
        <div className="flex items-end justify-between gap-6">
          <ArrowGroup count={5} />

          <h2 className="font-display theme-fg text-3xl font-bold sm:text-4xl lg:text-right">
            Who Can Benefit
            <br />
            from Our Training?
          </h2>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="group w-full transition-all duration-700 ease-out hover:-translate-y-2 hover:scale-[0.98]">
            <div className="relative aspect-591/313 w-full overflow-hidden rounded-2xl transition-all duration-700 ease-out group-hover:drop-shadow-[0_25px_45px_rgba(240,93,35,0.28)]">
              <Image
                src="/assets/images/sme-business-owners.png"
                alt="A presenter walking an SME business owner through sales data"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-display theme-fg text-2xl font-bold sm:text-3xl">
              Small and Medium (SME)
              <br />
              Business Owners
            </h3>
            <p className="theme-fg max-w-md text-lg leading-8 opacity-70">
              Our training equips small business people with the tools to
              make their businesses competitive and adaptable in the modern
              business landscape.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="flex flex-col gap-4">
            <h3 className="font-display theme-fg text-2xl font-bold sm:text-3xl">
              Teams in Small and Medium
              <br />
              Enterprises
            </h3>
            <p className="theme-fg max-w-md text-lg leading-8 opacity-70">
              Your teams drive growth, and our training programs provide
              them with the expertise to stay agile, seize digital business
              opportunities, and connect more effectively with your
              customers.
            </p>
          </div>

          <div className="mt-10 flex lg:mt-0 lg:justify-end">
            <div className="group w-full transition-all duration-700 ease-out hover:-translate-y-2 hover:scale-[0.98]">
              <div className="relative aspect-591/313 w-full overflow-hidden rounded-2xl transition-all duration-700 ease-out group-hover:drop-shadow-[0_25px_45px_rgba(240,93,35,0.28)]">
                <Image
                  src="/assets/images/SMEE-enterprises.png"
                  alt="A trainer presenting to a small team in an SME"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
