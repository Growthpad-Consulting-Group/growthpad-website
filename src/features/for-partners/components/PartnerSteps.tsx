"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArrowGroup from "@/shared/components/ArrowGroup";

const steps = [
  "Recommend our services to other companies/businesses – as many as you'd like, there's no limit!",
  "We'll discuss with them to see if Growthpad is the right fit for their needs.",
  "Receive a partner package when your partner signs up. For larger projects, we'll offer you an enhanced incentive package.",
];

// Design canvas is 1120x759 (from Figma); every position below is that
// pixel value expressed as a percentage of the canvas, so the whole
// layout scales fluidly instead of breaking at arbitrary widths.
const CANVAS = { width: 1120, height: 759 };
const pct = (value: number, axis: "x" | "y") =>
  `${(value / CANVAS[axis === "x" ? "width" : "height"]) * 100}%`;

const cards = [
  { left: 25, top: 0, width: 455, height: 199 },
  { left: 380, top: 280, width: 455, height: 199 },
  { left: 665, top: 560, width: 455, height: 199 },
];

const badges = [
  { left: 0, top: 75 },
  { left: 360, top: 355 },
  { left: 640, top: 635 },
];

// Pre-drawn dotted elbow connectors (uploaded assets) — each SVG already
// has the right shape and dash pattern baked in, positioned here to meet
// the card/badge edges they connect.
const brackets = [
  { src: "/assets/images/border-2.svg", left: 480, top: 98, width: 155, height: 182 }, // right side of card 1
  { src: "/assets/images/border-1.svg", left: 250, top: 199, width: 173, height: 182 }, // below card 1
  { src: "/assets/images/border-3.svg", left: 605, top: 479, width: 129, height: 181 }, // below card 2
];

export default function PartnerSteps() {
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
      data-theme-section="light"
      className="theme-bg relative w-full overflow-hidden py-20 lg:py-28"
    >
      <div className="container-fluid">
        <div className="relative mb-16 lg:mb-24">
          <h2 className="font-display theme-fg text-center text-4xl font-bold sm:text-5xl">
            How Does it Work?
          </h2>
          <ArrowGroup
            count={4}
            className="absolute top-1/2 right-0 hidden -translate-y-1/2 sm:flex"
          />
        </div>

        {/* Mobile/tablet: plain stacked cards — the absolute canvas below
            is a fixed composition tuned for wide layouts only. */}
        <div className="flex flex-col gap-6 lg:hidden">
          {steps.map((text, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="bg-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white">
                {i + 1}
              </div>
              <div className="bg-secondary w-full rounded-2xl p-6 transition-all duration-700 ease-out hover:-translate-y-2 hover:scale-[0.98] hover:shadow-[0_25px_45px_rgba(240,93,35,0.28)]">
                <p className="text-base leading-7 text-white">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          ref={canvasRef}
          className="relative hidden lg:block"
          style={{ aspectRatio: `${CANVAS.width} / ${CANVAS.height}` }}
        >
          {brackets.map((b, i) => (
            <div
              key={i}
              ref={(el) => {
                bracketRefs.current[i] = el;
              }}
              className="absolute opacity-0"
              style={{
                left: pct(b.left, "x"),
                top: pct(b.top, "y"),
                width: pct(b.width, "x"),
                height: pct(b.height, "y"),
              }}
            >
              <Image src={b.src} alt="" fill />
            </div>
          ))}

          {cards.map((card, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: pct(card.left, "x"),
                top: pct(card.top, "y"),
                width: pct(card.width, "x"),
                height: pct(card.height, "y"),
              }}
            >
              <div
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="bg-secondary relative h-full w-full rounded-3xl p-8 opacity-0 transition-[transform,box-shadow] duration-700 ease-out hover:-translate-y-2 hover:scale-[0.98] hover:shadow-[0_25px_45px_rgba(240,93,35,0.28)]"
              >
                <p className="text-base leading-7 text-white xl:text-lg">
                  {steps[i]}
                </p>
              </div>
            </div>
          ))}

          {badges.map((badge, i) => (
            <div
              key={i}
              className="bg-primary absolute z-10 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white xl:h-14 xl:w-14 xl:text-xl"
              style={{ left: pct(badge.left, "x"), top: pct(badge.top, "y") }}
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
