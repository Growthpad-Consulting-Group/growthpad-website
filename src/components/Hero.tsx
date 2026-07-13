 import Image from "next/image";
import Link from "next/link";
import LogoShowcase from "@/components/LogoShowcase";

export default function Hero() {
  return (
    <section className="relative flex h-[calc(100svh-6rem)] w-full flex-col overflow-hidden">
      <div className="container-fluid relative z-10 flex flex-1 flex-col items-start justify-center gap-6">
        <p className="text-base text-secondary/60">
          A Cross-Africa Communication &amp; Technology Firm
        </p>

        <h1 className="font-display max-w-2xl leading-[1.1] text-secondary">
          <span className="block text-4xl font-light sm:text-5xl lg:text-6xl">
            Transforming Ideas
          </span>
          <span className="block text-4xl font-bold text-primary sm:text-5xl lg:text-6xl">
            Into Impact.
          </span>
        </h1>

        <p className="max-w-md text-xl font-medium text-secondary/90">
          We are obsessed with exceeding potential.
        </p>

        <p className="max-w-md text-lg leading-8 text-secondary/70">
          Tailored solutions in communication, technology and market
          intelligence—built for growth across Africa.
        </p>

        <div className="mt-2 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Link
            href="#contact"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-base font-medium text-white transition-colors hover:bg-primary/90"
          >
            Get in Touch
            <Image
              src="/assets/icons/arrow-white.svg"
              alt=""
              width={14}
              height={14}
            />
          </Link>
          <Link
            href="#work"
            className="inline-flex h-12 items-center text-base font-medium text-secondary underline decoration-2 decoration-primary underline-offset-4"
          >
            See our Work
          </Link>
        </div>
      </div>

      <div className="pointer-events-none absolute top-1/2 right-0 hidden w-[40%] max-w-xl -translate-y-1/2 lg:block">
        <Image
          src="/assets/images/hero_img.svg"
          alt=""
          width={577}
          height={435}
          priority
          className="h-auto w-full"
        />
      </div>

      <div className="hero-marquee relative z-10 w-full pb-8">
        <LogoShowcase />
      </div>
    </section>
  );
}
