import Image from "next/image";
import ArrowGroup from "@/shared/components/ArrowGroup";

export default function PracticeAreasHero() {
  return (
    <section className="theme-bg theme-fg w-full py-20 lg:py-28">
      <div className="container-fluid">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div>
            <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-2xl">
              <Image
                src="/assets/images/Innovation.png"
                alt="Practice areas strategy"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            <ArrowGroup count={5} className="mt-8" />
          </div>

          <div className="flex flex-col gap-8 text-lg leading-8 opacity-90">
            <p>
              Our practice areas are built to address the most complex challenges in communication, digital delivery, learning systems and research.
            </p>
            <p>
              We combine strategic expertise with practical execution to deliver real-world progress for organisations across Africa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
