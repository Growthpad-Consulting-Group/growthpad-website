"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArrowGroup from "@/components/ArrowGroup";

export default function About() {
  const imageWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!imageWrapRef.current) return;

      gsap.fromTo(
        imageWrapRef.current,
        { x: -120, filter: "brightness(0.8)" },
        {
          x: 0,
          filter: "brightness(1)",
          ease: "none",
          scrollTrigger: {
            trigger: imageWrapRef.current,
            start: "top 90%",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      data-theme-section="dark"
      className="theme-bg relative flex w-full flex-col justify-center overflow-hidden py-16 lg:h-[calc(100svh-6rem)] lg:py-0"
    >
      <ArrowGroup className="absolute top-8 right-6 lg:top-10 lg:right-10" />

      <div className="container-fluid relative">
        <p className="font-display text-primary mb-10 text-2xl font-bold sm:text-3xl">
          A Little bit about us
        </p>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div ref={imageWrapRef} className="relative">
            <div className="notch-image relative aspect-595/409 w-full max-w-xl overflow-hidden">
              <Image
                src="/assets/images/about.png"
                alt="The Growthpad team collaborating"
                fill
                className="object-cover"
              />
            </div>

            <ArrowGroup count={4} className="mt-8" />
          </div>

          <div className="theme-fg flex flex-col gap-8 text-lg leading-8 opacity-90">
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
        count={5}
        className="absolute right-6 bottom-8 lg:right-10 lg:bottom-10"
      />
    </section>
  );
}
