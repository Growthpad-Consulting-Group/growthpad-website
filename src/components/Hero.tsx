import Link from "next/link";
import LogoShowcase from "@/components/LogoShowcase";
import HeroGrid from "@/components/HeroGrid";
import { Arrow } from "@/components/ArrowGroup";

export default function Hero() {
  return (
    <section className="relative flex h-[calc(100svh-6rem)] w-full flex-col overflow-hidden">
      <div className="relative flex-1">
        <div className="container-fluid theme-fg relative z-10 flex h-full flex-col items-start justify-center gap-6">
          <p className="text-base opacity-60">
            A Cross-Africa Communication &amp; Technology Firm
          </p>

          <h1 className="font-display max-w-2xl leading-[1.1]">
            <span className="block text-4xl font-light sm:text-5xl lg:text-6xl">
              Transforming Ideas
            </span>
            <span className="text-primary block text-4xl font-bold sm:text-5xl lg:text-6xl">
              Into Impact.
            </span>
          </h1>

          <p className="max-w-md text-xl font-medium opacity-90">
            We are obsessed with exceeding potential.
          </p>

          <p className="max-w-xl text-lg leading-8 opacity-70">
            Tailored solutions in communication, technology and market
            intelligence—built for growth across Africa.
          </p>

          <Link
            href="#contact"
            className="group mt-2 inline-flex items-center gap-4"
          >
            <span className="bg-primary group-hover:bg-primary/90 inline-flex h-11 items-center rounded-full px-7 text-base font-semibold text-white transition-colors">
              See Services
            </span>
            <span className="theme-invert-bg theme-invert-fg inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-opacity group-hover:opacity-90">
              <Arrow className="h-4 w-4" />
            </span>
          </Link>
        </div>

        <div className="pointer-events-none absolute top-1/2 right-0 hidden w-[45%] max-w-2xl -translate-y-1/2 lg:block">
          <HeroGrid />
        </div>
      </div>

      <div className="hero-marquee container-fluid relative z-10 pb-8">
        <LogoShowcase />
      </div>
    </section>
  );
}
