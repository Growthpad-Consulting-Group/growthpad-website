"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import LogoShowcase from "@/components/LogoShowcase";
import HeroGrid from "@/components/HeroGrid";
import { Arrow } from "@/components/ArrowGroup";

export default function Hero() {
  const introRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Explicit numeric "to" opacity per element (rather than gsap.from's
      // implicit current-value capture): each element's own opacity-0
      // class already set it to 0 before this runs, so an implicit
      // capture would read 0 as the resting target and elements would
      // never fade back in.
      const els = gsap.utils.toArray<HTMLElement>(".hero-reveal");
      els.forEach((el, i) => {
        const restOpacity = Number(el.dataset.restOpacity ?? 1);
        gsap.fromTo(
          el,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: restOpacity,
            duration: 0.9,
            delay: 0.15 + i * 0.12,
            ease: "power3.out",
          },
        );
      });
    }, introRef);

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

    return () => {
      ctx.revert();
      marqueeCtx.revert();
    };
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

          <Link
            href="#contact"
            className="hero-reveal opacity-0 group mt-2 inline-flex items-center gap-4"
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

      <div
        ref={marqueeRef}
        className="opacity-0 container-fluid relative z-10 w-full pt-4 pb-4 sm:pt-0 sm:pb-8"
      >
        <LogoShowcase />
      </div>
    </section>
  );
}
