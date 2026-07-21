"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CtaButton from "@/shared/components/CtaButton";
import { brands } from "@/features/home/data/brands";

export default function Brands() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const container = containerRef.current;
      if (!track || !container) return;

      // Measured against the track's own (padded) container-fluid parent, not
      // the outer full-bleed section — otherwise the distance is short by
      // roughly the container-fluid horizontal padding on each side, and the
      // last card never fully scrolls into view before the section unpins.
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
              <span className="block font-light">Our Brands,</span>
              <span className="text-primary block font-bold">
                Your Growth Partners
              </span>
            </h2>
            <p className="max-w-sm text-lg leading-8 opacity-70">
              At Growthpad Consulting Group, our specialized brands provide
              tailored solutions in communication, market intelligence,
              compliance, and more—empowering businesses and organizations
              across Africa to achieve growth and impact.
            </p>
          </div>

          <div ref={trackRef} className="flex gap-6 will-change-transform">
            {brands.map((brand) => (
              <div
                key={brand.name}
                className="border-secondary/10 hover:border-primary/30 flex h-80 w-75 shrink-0 flex-col justify-between rounded-2xl border bg-white hover:bg-primary/2 p-8 shadow-lg shadow-secondary/6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-secondary/12 sm:w-85"
              >
                <div className="relative flex h-12 w-40 items-start">
                  <Image
                    src={`/assets/images/brands/${brand.logo}`}
                    alt={brand.name}
                    fill
                    sizes="160px"
                    className="object-contain object-left"
                  />
                </div>

                <p className="text-secondary/70 leading-7">
                  {brand.description}
                </p>

                <CtaButton
                  href={brand.href}
                  size="sm"
                  className="mt-2"
                  circleClassName="bg-primary group-hover:bg-primary/90 text-white"
                >
                  Visit site
                </CtaButton>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
