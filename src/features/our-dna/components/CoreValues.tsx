import Image from "next/image";
import ArrowGroup from "@/components/ArrowGroup";

const values = [
  {
    description: "A commitment to dependability, consistency & honesty.",
  },
  {
    description:
      "A commitment to doing good for ourselves, for the team, for society, and for the world",
  },
  {
    description: "A commitment to continuous excellence & innovation",
  },
];

export default function CoreValues() {
  return (
    <section
      data-theme-section="light"
      className="theme-bg relative w-full py-20 lg:py-28"
    >
      <div className="container-fluid">
        <ArrowGroup count={5} />

        <h2 className="font-display text-secondary mt-8 text-center text-4xl font-bold sm:text-5xl">
          Our Core Values
        </h2>

        <div className="relative mt-16 flex flex-col gap-6 lg:aspect-1120/422 lg:block lg:w-full lg:gap-0">
          <Image
            src="/assets/images/core-value-card.svg"
            alt=""
            fill
            className="hidden object-contain lg:block"
          />

          <div className="flex flex-col gap-6 lg:absolute lg:inset-0 lg:grid lg:grid-cols-3 lg:gap-10 lg:divide-x lg:divide-white/30 lg:px-20 lg:py-16">
            {values.map((value, i) => (
              <div
                key={i}
                className="bg-primary flex flex-col items-center justify-center gap-6 rounded-2xl px-6 py-10 text-center lg:rounded-none lg:bg-transparent lg:px-4 lg:py-0"
              >
                <span className="text-secondary flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white text-2xl font-bold">
                  {i + 1}
                </span>
                <p className="max-w-xs text-lg leading-8 text-white">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
