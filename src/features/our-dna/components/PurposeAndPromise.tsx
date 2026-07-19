import Image from "next/image";
import ArrowGroup from "@/components/ArrowGroup";

export default function PurposeAndPromise() {
  return (
    <section
      data-theme-section="light"
      className="theme-bg relative w-full py-20 lg:py-28"
    >
      <div className="container-fluid flex flex-col gap-16 lg:gap-20">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-828/516 w-full max-w-xl overflow-hidden">
            <Image
              src="/assets/images/ourpurpose.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain"
            />
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="font-display text-secondary text-3xl font-bold sm:text-4xl">
              Our Purpose
            </h2>
            <p className="text-secondary/80 max-w-md text-lg leading-8">
              To drive progress in society by enabling people &amp;
              businesses to realize their full potential through innovation
              &amp; technology.
            </p>

            <ArrowGroup count={5} className="mt-4 self-end" />
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-secondary text-3xl font-bold sm:text-4xl">
              Brand Promise
            </h2>
            <p className="text-secondary/80 max-w-md text-lg leading-8">
              To build innovative solutions that drive individual &amp;
              business growth.
            </p>
          </div>

          <div className="mt-10 flex lg:mt-0 lg:justify-end">
            <div className="relative aspect-567/370 w-full max-w-xl overflow-hidden">
              <Image
                src="/assets/images/brandpromise.png"
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
