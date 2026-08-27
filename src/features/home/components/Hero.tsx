"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import LogoShowcase from "@/shared/components/LogoShowcase";
import HeroGrid from "@/features/home/components/HeroGrid";
import CtaButton from "@/shared/components/CtaButton";
import { useRevealAnimation } from "@/shared/hooks/useRevealAnimation";

export default function Hero() {
  const introRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useRevealAnimation(introRef, ".hero-reveal");

  useEffect(() => {
    // Third wave, after the text (~0.15s) and HeroGrid (~0.4s) reveals.
    const marqueeCtx = gsap.context(() => {
      gsap.fromTo(
        marqueeRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.65,
          ease: "power3.out",
        },
      );
    }, marqueeRef);

    return () => marqueeCtx.revert();
  }, []);

  return (
    <section className="relative flex h-[calc(100svh-6rem)] w-full flex-col overflow-hidden">
      <div className="relative flex-1">
        <div
          ref={introRef}
          className="container-fluid theme-fg relative z-10 flex h-full flex-col items-start justify-center gap-6"
        >
          <p className="hero-reveal opacity-0 text-base" data-rest-opacity="0.6">
            A Cross-Africa Communication &amp; Technology Firm
          </p>

          <h1 className="font-display max-w-2xl leading-[1.1]">
            <span className="hero-reveal opacity-0 block text-4xl font-light sm:text-5xl lg:text-6xl">
              Transforming Ideas
            </span>
            <span className="hero-reveal opacity-0 text-primary block text-4xl font-bold sm:text-5xl lg:text-6xl">
              Into Impact.
            </span>
          </h1>

          <p
            className="hero-reveal opacity-0 max-w-md text-xl font-medium"
            data-rest-opacity="0.9"
          >
            We are obsessed with exceeding potential.
          </p>

          <p
            className="hero-reveal opacity-0 max-w-xl text-lg leading-8"
            data-rest-opacity="0.7"
          >
            Tailored solutions in communication, technology and market
            intelligence - built for growth across Africa.
          </p>

          <CtaButton
            href="/services"
            className="hero-reveal opacity-0 mt-2"
            circleClassName="theme-invert-bg theme-invert-fg"
          >
            See Services
          </CtaButton>
        </div>

        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <div className="container-fluid relative h-full">
            <div className="absolute top-1/2 right-[clamp(1rem,5vw,8rem)] w-[38%] max-w-md -translate-y-1/2 xl:w-[45%] xl:max-w-2xl">
              <HeroGrid />
            </div>
          </div>
        </div>
      </div>

      <div
        ref={marqueeRef}
        className="opacity-0 container-fluid relative z-10 w-full pt-4 pb-4 sm:pt-0 sm:pb-8"
      >
        <LogoShowcase />
      </div>
    </section>
  );
}
