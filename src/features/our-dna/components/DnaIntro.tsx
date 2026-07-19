import Image from "next/image";
import ArrowGroup from "@/shared/components/ArrowGroup";

export default function DnaIntro() {
  return (
    <section className="theme-bg theme-fg w-full py-20 lg:py-28">
      <div className="container-fluid">
        <h2 className="font-display text-secondary mb-12 block max-w-xl text-3xl leading-tight sm:text-4xl lg:mb-16 lg:text-5xl">
          A Little bit about us
        </h2>

        <div className="flex flex-col gap-4 lg:gap-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
            <div>
              <div className="relative aspect-square w-full max-w-md overflow-hidden">
                <Image
                  src="/assets/images/dna-about-1.png"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>

              <ArrowGroup count={5} className="mt-8" />
            </div>

            <div className="flex flex-col gap-8 text-lg leading-8 opacity-90">
              <p>
                We are a digital media and{" "}
                tech consulting firm headquartered in Nairobi, Kenya, with operations across East
                Africa.
              </p>
              <p>
                Our suite of digital and Tech services{" "}
                is built upon a foundation of intent - understanding how
                consumers decide - across all paid, owned, and earned media
                touchpoints.
              </p>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="flex flex-col gap-8 text-lg leading-8 opacity-90 lg:order-1">
              <p>
                In today&apos;s digital business world, you need a partner
                who can help you take advantage of marketing opportunities
                across a variety of channels in real time.
              </p>
              <p>
                Growthpad combines a data-driven approach with knowledge
                gained from years in tech and marketing to deliver
                outstanding results for clients.
              </p>
            </div>

            <div className="flex flex-col lg:order-2 lg:items-end">
              <div className="relative aspect-square w-full max-w-md overflow-hidden">
                <Image
                  src="/assets/images/dna-about-2.png"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>

              <ArrowGroup count={5} className="mt-8" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
