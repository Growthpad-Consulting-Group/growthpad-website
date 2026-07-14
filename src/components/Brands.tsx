"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Arrow } from "@/components/ArrowGroup";
import { brands } from "@/data/brands";

export default function Brands() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const container = containerRef.current;
      if (!track || !container) return;

      const scrollDistance = () => track.scrollWidth - container.offsetWidth;

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
    <section data-brands-section className=" relative w-full">
      <div
        ref={containerRef}
        className="relative min-h-[70vh] w-full overflow-hidden"
      >
        <div className="container-fluid flex h-full flex-col justify-center gap-10 py-16">
          <div
            data-brands-text
            className="text-secondary flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          >
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
                className="border-secondary/10 flex h-80 w-[300px] shrink-0 flex-col justify-between rounded-2xl border bg-white p-8 shadow-[0_1px_30px_rgba(35,24,18,0.06)] sm:w-[340px]"
              >
                <div className="flex h-12 items-start">
                  <Image
                    src={`/assets/images/brands/${brand.logo}`}
                    alt={brand.name}
                    width={160}
                    height={48}
                    className="h-full w-auto object-contain"
                  />
                </div>

                <p className="text-secondary/70 leading-7">
                  {brand.description}
                </p>

                <Link
                  href={brand.href}
                  className="text-secondary group inline-flex items-center gap-2 text-sm font-semibold"
                >
                  Visit site
                  <span className="bg-secondary group-hover:bg-primary inline-flex h-7 w-7 items-center justify-center rounded-full text-white transition-colors">
                    <Arrow className="h-3 w-3" />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
