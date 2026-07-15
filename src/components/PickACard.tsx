"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import { Arrow } from "@/components/ArrowGroup";
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

function PickBadge() {
  const ringRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ringRef.current) return;
    const anim = gsap.to(ringRef.current, {
      rotate: 360,
      duration: 14,
      repeat: -1,
      ease: "none",
      transformOrigin: "50% 50%",
    });
    return () => {
      anim.kill();
    };
  }, []);

  const text = "Pick a Card . ".repeat(5);
  const radius = 80;

  return (
    <div className="relative flex h-64 w-64 items-center justify-center">
      <svg ref={ringRef} viewBox="0 0 240 240" className="absolute inset-0">
        <defs>
          <path
            id="pick-a-card-circle"
            d={`M 120, 120 m -${radius}, 0 a ${radius},${radius} 0 1,1 ${
              radius * 2
            },0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
          />
        </defs>
        <text className="fill-secondary text-xl font-semibold tracking-wide">
          <textPath href="#pick-a-card-circle" startOffset="0%">
            {text}
          </textPath>
        </text>
      </svg>
      <Arrow className="text-secondary h-20 w-20" />
    </div>
  );
}

export default function PickACard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const active = pickACard[activeIndex];

  return (
    <section className="relative w-full bg-[#EDEBE8] py-20 lg:py-28">
      <div className="container-fluid">
        <h2 className="font-display text-secondary text-4xl font-bold sm:text-5xl">
          How we do it
        </h2>

        <div className="mt-16 grid gap-16 pt-16 lg:grid-cols-[auto_1fr] lg:items-end lg:gap-10">
          <div className="lg:translate-y-12">
            <PickBadge />
          </div>

          <div className="relative h-72 sm:h-80">
            {pickACard.map((card, index) => {
              const offset = index - (pickACard.length - 1) / 2;
              const isActive = index === activeIndex;
              const isHovered = index === hoveredIndex && !isActive;
              const fanTransform = `translateX(calc(-50% + ${offset * FAN_OFFSET_X}px)) rotate(${offset * FAN_ROTATE_DEG}deg)`;

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
                  className={`bg-secondary absolute left-1/2 h-64 w-44 shrink-0 overflow-hidden rounded-3xl text-left transition-transform duration-300 ease-out sm:h-72 sm:w-52 ${
                    isActive
                      ? "shadow-[0_35px_60px_rgba(0,0,0,0.45)] ring-primary ring-1"
                      : isHovered
                        ? "shadow-[0_25px_50px_rgba(240,93,35,0.35)]"
                        : "shadow-[0_20px_45px_rgba(0,0,0,0.35)]"
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

        <div className="mt-12 ml-auto max-w-md rounded-3xl bg-white p-8 shadow-[0_1px_30px_rgba(35,24,18,0.08)] ]">
          <p className="text-secondary/80 text-lg leading-8">
            {active.description}
          </p>

          <Link href="#contact" className="group mt-6 inline-flex items-center gap-4">
            <span className="bg-primary group-hover:bg-primary/90 inline-flex h-11 items-center rounded-full px-7 text-base font-semibold text-white transition-colors">
              Get Started
            </span>
            <span className="bg-secondary inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition-opacity group-hover:opacity-90">
              <Arrow className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
