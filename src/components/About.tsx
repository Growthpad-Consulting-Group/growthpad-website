import Image from "next/image";
import ArrowGroup from "@/components/ArrowGroup";

export default function About() {
  return (
    <section className="bg-secondary relative w-full py-20 lg:py-28">
      <ArrowGroup
        variant="onDark"
        className="absolute top-8 right-6 lg:top-10 lg:right-10"
      />

      <div className="container-fluid relative">
        <p className="font-display text-primary mb-10 text-2xl font-bold sm:text-3xl">
          A Little bit about us
        </p>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="relative">
            <div className="notch-image relative aspect-595/409 w-full max-w-md overflow-hidden">
              <Image
                src="/assets/images/about.png"
                alt="The Growthpad team collaborating"
                fill
                className="object-cover"
              />
            </div>

            <ArrowGroup variant="onDark" count={4} className="mt-8" />
          </div>

          <div className="flex flex-col gap-8 text-lg leading-8 text-white/90">
            <p className="text-2xl">
              At the heart, we are a company of people who love to help
              people. We love to help organizations win, and when they do, we
              take great pride in that.
            </p>
            <p>
              We are a Nairobi Headquartered – cross-Africa communication,
              technology, and digital services firm that blends strategy,
              creativity, and technology to bring powerful results for
              organizations in the African market.
            </p>
          </div>
        </div>
      </div>

      <ArrowGroup
        variant="onDark"
        count={5}
        className="absolute right-6 bottom-8 lg:right-10 lg:bottom-10"
      />
    </section>
  );
}
