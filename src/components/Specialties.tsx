"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Accordion from "@/components/Accordion";
import ArrowGroup from "@/components/ArrowGroup";
import { specialties } from "@/data/specialties";

export default function Specialties() {
  const headerRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        accordionRef.current,
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: accordionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      data-theme-section="light"
      className="relative w-full py-20 lg:py-28"
    >
      <div className="container-fluid">
        <div ref={headerRef} className="theme-fg">
          <div className="flex items-center justify-between gap-6">
            <h2 className="font-display text-4xl font-bold sm:text-5xl">
              Our Specialties
            </h2>
            <ArrowGroup count={5} className="hidden sm:flex" />
          </div>

          <p className="mt-4 max-w-xl text-lg leading-8 opacity-70">
            We make bold moves to disrupt the present and build the future
            for your organization.
          </p>
        </div>

        <div ref={accordionRef} className="mt-14 ml-auto max-w-6xl">
          <Accordion items={specialties} />
        </div>
      </div>
    </section>
  );
}
