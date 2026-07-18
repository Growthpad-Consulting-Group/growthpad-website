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

        <div className="relative mt-16 aspect-1120/422 w-full">
          <Image
            src="/assets/images/core-value-card.svg"
            alt=""
            fill
            className="object-contain"
          />

          <div className="absolute inset-0 grid gap-10 px-12 py-14 sm:px-20 sm:py-16 lg:grid-cols-3 lg:divide-x lg:divide-white/30">
            {values.map((value, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center gap-6 px-4 text-center"
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
