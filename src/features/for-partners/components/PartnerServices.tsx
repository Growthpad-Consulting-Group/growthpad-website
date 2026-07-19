import Image from "next/image";
import CtaButton from "@/shared/components/CtaButton";

export default function PartnerServices() {
  return (
    <section
      data-theme-section="light"
      className="theme-bg relative w-full py-20 lg:py-28"
    >
      <div className="container-fluid grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-6">
          <h2 className="text-secondary text-4xl leading-tight font-light sm:text-5xl">
            Let&apos;s team up to support the growth of businesses in{" "}
            Africa through digital.
          </h2>

          <p className="text-secondary/80 max-w-md text-lg leading-8">
            What services can you recommend? We have a wide variety of
            professional services and you can recommend any of them.
          </p>

          <CtaButton
            href="/services"
            circleClassName="bg-secondary text-white"
            className="mt-2 self-start"
          >
            See Services
          </CtaButton>
        </div>

        <div className="relative aspect-681/554 w-full overflow-hidden rounded-3xl">
          <Image
            src="/assets/images/business-support.png"
            alt="Two business partners shaking hands over a city skyline"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
