"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArrowGroup from "@/shared/components/ArrowGroup";

export type DiagonalStep = {
  title: string;
  body: string;
};

interface DiagonalStepsProps {
  heading?: string;
  steps: DiagonalStep[];
  theme?: "light" | "dark";
}

// Canvas matches the original Figma composition: 1120×759.
// All positions are expressed as percentages of the canvas so the layout
// scales fluidly instead of breaking at arbitrary widths.
const CANVAS = { width: 1120, height: 759 };
const pct = (value: number, axis: "x" | "y") =>
  `${(value / CANVAS[axis === "x" ? "width" : "height"]) * 100}%`;

const cardPositions = [
  { left: 25, top: 0, width: 455, height: 215 },
  { left: 380, top: 272, width: 455, height: 215 },
  { left: 665, top: 544, width: 455, height: 215 },
];

const badgePositions = [
  { left: 0, top: 75 },
  { left: 360, top: 347 },
  { left: 640, top: 619 },
];

// Pre-drawn dotted elbow connectors — same assets used in the original PartnerSteps.
const brackets = [
  { src: "/assets/images/border-2.svg", left: 480, top: 98, width: 155, height: 182 },
  { src: "/assets/images/border-1.svg", left: 250, top: 199, width: 173, height: 182 },
  { src: "/assets/images/border-3.svg", left: 605, top: 479, width: 129, height: 181 },
];

export default function DiagonalSteps({
  heading = "How Does it Work?",
  steps,
  theme = "light",
}: DiagonalStepsProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const bracketRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      bracketRefs.current.forEach((bracket) => {
        if (!bracket) return;
        gsap.fromTo(
          bracket,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.6,
            ease: "power1.out",
            scrollTrigger: {
              trigger: bracket,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      cardRefs.current.forEach((card) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: 40, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, canvasRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      data-theme-section={theme}
      className="theme-bg relative w-full overflow-hidden py-20 lg:py-28"
    >
      <div className="container-fluid">
        {/* Heading */}
        <div className="relative mb-16 lg:mb-24">
          <h2 className="font-display theme-fg text-center text-4xl font-bold sm:text-5xl">
            {heading}
          </h2>
          <ArrowGroup
            count={4}
            className="absolute top-1/2 right-0 hidden -translate-y-1/2 sm:flex"
          />
        </div>

        {/* Mobile: stacked cards */}
        <div className="flex flex-col gap-6 lg:hidden">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="bg-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white">
                {i + 1}
              </div>
              <div className="bg-secondary w-full rounded-2xl p-6 transition-all duration-700 ease-out hover:-translate-y-2 hover:scale-[0.98] hover:shadow-[0_25px_45px_rgba(240,93,35,0.28)]">
                <h3 className="text-primary font-display mb-3 whitespace-pre-line text-xl font-bold leading-tight">
                  {step.title}
                </h3>
                <p className="text-base leading-7 text-white">{step.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: staggered diagonal canvas */}
        <div
          ref={canvasRef}
          className="relative hidden lg:block"
          style={{ aspectRatio: `${CANVAS.width} / ${CANVAS.height}` }}
        >
          {/* Dotted elbow connectors */}
          {brackets.map((b, i) => (
            <div
              key={i}
              ref={(el) => { bracketRefs.current[i] = el; }}
              className="absolute opacity-0"
              style={{
                left: pct(b.left, "x"),
                top: pct(b.top, "y"),
                width: pct(b.width, "x"),
                height: pct(b.height, "y"),
              }}
            >
              <Image src={b.src} alt="" fill unoptimized />
            </div>
          ))}
          {cardPositions.map((pos, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: pct(pos.left, "x"),
                top: pct(pos.top, "y"),
                width: pct(pos.width, "x"),
                height: pct(pos.height, "y"),
              }}
            >
              <div
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="bg-secondary relative h-full w-full rounded-3xl p-8 opacity-0 transition-[transform,box-shadow] duration-700 ease-out hover:-translate-y-2 hover:scale-[0.98] hover:shadow-[0_25px_45px_rgba(240,93,35,0.28)]"
              >
                <h3 className="text-primary font-display mb-3 whitespace-pre-line text-xl font-bold leading-tight xl:text-2xl">
                  {steps[i]?.title}
                </h3>
                <p className="text-base leading-7 text-white xl:text-lg">
                  {steps[i]?.body}
                </p>
              </div>
            </div>
          ))}

          {badgePositions.map((badge, i) => (
            <div
              key={i}
              className="bg-primary absolute z-10 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white xl:h-14 xl:w-14 xl:text-xl"
              style={{
                left: pct(badge.left, "x"),
                top: pct(badge.top, "y"),
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      <ArrowGroup
        count={4}
        className="absolute bottom-8 left-6 lg:bottom-10 lg:left-10"
      />
    </section>
  );
}
