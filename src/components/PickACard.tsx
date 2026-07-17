"use client";

import { useRef, useState } from "react";
import { Arrow } from "@/components/ArrowGroup";
import CtaButton from "@/components/CtaButton";
import RotatingBadge from "@/components/RotatingBadge";
import { pickACard } from "@/data/pickACard";

const FAN_ROTATE_DEG = 9;
const FAN_OFFSET_X = 130;

function CardStripe() {
  return (
    <div className="absolute bottom-0 left-0 flex w-full items-center gap-1 overflow-hidden pb-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <Arrow
          key={i}
          className={`h-6 w-6 shrink-0 ${i % 2 === 0 ? "text-primary" : "text-white"}`}
        />
      ))}
    </div>
  );
}

export default function PickACard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const mobileCardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const active = pickACard[activeIndex];

  const pickMobile = (index: number) => {
    setActiveIndex(index);
    mobileCardRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <section
      data-theme-section="gray"
      className="theme-bg relative w-full py-20 lg:py-28"
    >
      <div className="container-fluid">
        <h2 className="font-display theme-fg text-4xl font-bold sm:text-5xl">
          How we do it
        </h2>

        {/* Mobile/tablet: a swipeable horizontal row instead of the fan —
            absolute-positioned overlapping rotated cards don't give touch
            users equal, full-size tap targets, and there isn't room for a
            7-card spread on a narrow screen. */}
        <div className="mt-10 -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 lg:hidden">
          {pickACard.map((card, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={card.title}
                ref={(el) => {
                  mobileCardRefs.current[index] = el;
                }}
                type="button"
                onClick={() => pickMobile(index)}
                className={`bg-secondary relative h-64 w-48 shrink-0 snap-start overflow-hidden rounded-3xl text-left outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isActive ? "ring-2 ring-primary" : ""
                }`}
              >
                <p className="font-display absolute top-0 left-0 p-5 text-base leading-snug font-bold text-white">
                  {card.title}
                </p>
                <CardStripe />
              </button>
            );
          })}
        </div>

        <div className="mt-16 hidden gap-16 pt-16 lg:grid lg:grid-cols-[auto_1fr] lg:items-end lg:gap-10">
          <div className="lg:translate-y-12">
            <RotatingBadge text="Pick a Card" />
          </div>

          <div className="relative h-72 sm:h-80">
            {pickACard.map((card, index) => {
              const offset = index - (pickACard.length - 1) / 2;
              const isActive = index === activeIndex;
              const isHovered = index === hoveredIndex && !isActive;
              const centerGap =
                offset < 0
                  ? -40
                  : offset > 0
                    ? 40
                    : isActive
                      ? 0
                      : -110;
              const fanTransform = `translateX(calc(-50% + ${
                offset * FAN_OFFSET_X + centerGap
              }px)) rotate(${offset * FAN_ROTATE_DEG}deg)`;

              return (
                <button
                  key={card.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    transform: isActive
                      ? "translateX(-50%) translateY(-72px) rotate(0deg) scale(1.05)"
                      : isHovered
                        ? `${fanTransform} translateY(-30px)`
                        : fanTransform,
                    zIndex: isActive ? 50 : isHovered ? 40 : 10 + index,
                  }}
                  className={`bg-secondary absolute left-1/2 h-64 w-44 shrink-0 overflow-hidden rounded-3xl text-left transition-transform duration-300 ease-out outline-none focus:outline-none focus-visible:ring-primary focus-visible:ring-2 sm:h-72 sm:w-52 ${
                    isActive
                      ? "shadow-2xl shadow-black/45 ring-primary ring-1"
                      : isHovered
                        ? "shadow-2xl shadow-primary/35"
                        : "shadow-xl shadow-white/13"
                  }`}
                >
                  <p className="font-display absolute top-0 left-0 p-6 text-lg leading-snug font-bold text-white">
                    {card.title}
                  </p>
                  <CardStripe />
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-white p-8 shadow-lg shadow-secondary/8 transition-shadow duration-700 ease-out hover:shadow-xl hover:shadow-primary/20 lg:ml-auto lg:max-w-md">
          <p className="text-secondary/80 text-lg leading-8">
            {active.description}
          </p>

          <CtaButton href="#contact" className="mt-6" circleClassName="bg-secondary text-white">
            Get Started
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
