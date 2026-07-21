"use client";

import { useRef } from "react";
import SectionAnimate from "@/shared/components/SectionAnimate";
import BigArrow from "@/shared/components/BigArrow";
import ArrowGroup from "@/shared/components/ArrowGroup";
import NotchImage from "@/shared/components/NotchImage";

export default function TrainingWhyLearn() {
  const sectionRef = useRef<HTMLElement>(null);

  const handleScrollDown = () => {
    sectionRef.current?.nextElementSibling?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section
      ref={sectionRef}
      data-theme-section="dark"
      className="theme-bg w-full py-20 lg:py-28"
    >
      <div className="container-fluid">
        {/* Heading row */}
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-display theme-fg text-3xl font-bold sm:text-4xl">
            Why Learn With Us?
          </h2>
          <ArrowGroup count={5} />
        </div>

        <div className="mt-14 grid items-center gap-12 lg:mt-20 lg:grid-cols-2 lg:gap-20">
          {/* Image */}
          <SectionAnimate variant="fade-right" className="w-full">
            <div className="group w-full transition-all duration-700 ease-out hover:-translate-y-2 hover:scale-[0.98]">
              <NotchImage
                src="/assets/images/learnwithus.jpg"
                alt="A group of professionals learning together"
                variant="tab"
                showBorder
                fit="slice"
                className="w-full transition-all duration-700 ease-out group-hover:drop-shadow-[0_25px_45px_rgba(240,93,35,0.28)]"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </SectionAnimate>

          {/* Text + BigArrow */}
          <SectionAnimate variant="fade-left" delay={0.15}>
            <p className="theme-fg text-lg leading-8 opacity-80">
              We&apos;re here to simplify your learning journey. With a team of
              industry experts, up-to-date content, and a commitment to your
              success, learning with us makes your business and teams
              future-proof.
            </p>

            <div className="mt-10 flex justify-end">
              <BigArrow
                loop
                onClick={handleScrollDown}
                className="text-primary h-28 w-28 rotate-160 sm:h-36 sm:w-36"
              />
            </div>
          </SectionAnimate>
        </div>
      </div>
    </section>
  );
}
