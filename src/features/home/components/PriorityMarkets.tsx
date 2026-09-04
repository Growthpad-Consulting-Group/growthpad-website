"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CtaButton from "@/shared/components/CtaButton";
import { priorityMarkets } from "@/features/home/data/priorityMarkets";

export default function PriorityMarkets() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const container = containerRef.current;
      if (!track || !container) return;

      const scrollDistance = () => {
        const trackParent = track.parentElement;
        const availableWidth = trackParent ? trackParent.clientWidth : container.offsetWidth;
        return track.scrollWidth - availableWidth;
      };

      gsap.to(track, {
        x: () => -scrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${scrollDistance()}`,
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section data-theme-section="light" className="relative w-full">
      <div
        ref={containerRef}
        className="relative min-h-[70vh] w-full overflow-hidden"
      >
        <div className="container-fluid flex h-full flex-col justify-center gap-10 py-16">
          <div className="theme-fg flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display max-w-xl text-3xl leading-tight sm:text-4xl lg:text-5xl">
              <span className="font-light">Priority </span>
              <span className="text-primary font-bold">
                Markets
              </span>
            </h2>
            <p className="max-w-sm text-lg leading-8 opacity-70">
              Built for high-stakes work where local context and delivery discipline matter.
            </p>
          </div>

          <div ref={trackRef} className="flex gap-6 will-change-transform pr-[100vw]">
            {priorityMarkets.map((market) => (
              <div
                key={market.name}
                className="group border-secondary/10 hover:border-primary/30 flex h-96 w-75 shrink-0 flex-col justify-between rounded-2xl border bg-white hover:bg-primary/2 p-8 shadow-lg shadow-secondary/6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-secondary/12 sm:w-85"
              >
                <div className="flex h-16 w-16 items-center justify-center">
                  <Image
                    src={`/assets/icons/${market.icon}`}
                    alt={market.name}
                    width={64}
                    height={64}
                    className="object-contain transition-all duration-300 group-hover:brightness-0 group-hover:saturate-200 group-hover:sepia group-hover:hue-rotate-25"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2 theme-fg">
                    {market.name}
                  </h3>
                  <p className="text-secondary/70 leading-7">
                    {market.description}
                  </p>
                </div>

                <CtaButton
                  href={market.href}
                  size="sm"
                  className="mt-4"
                  circleClassName="bg-primary group-hover:bg-primary/90 text-white"
                >
                  Priority Market
                </CtaButton>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
