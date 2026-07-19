"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Arrow } from "@/shared/components/ArrowGroup";

// Unlike HeroGrid (each rounded tile has its own separate photo), every
// pill here is a "window" cut into one single shared image via an SVG
// clipPath, so the same continuous photo is visible across all of them —
// panning it (Ken Burns style) moves it in sync everywhere at once,
// because it's genuinely one <Image>, not several.
const PILLS = [
  { x: 0, y: 0, width: 430, height: 84, rx: 42 },
  { x: 0, y: 104, width: 270, height: 84, rx: 42 },
  { x: 300, y: 104, width: 300, height: 84, rx: 42 },
  { x: 190, y: 208, width: 410, height: 84, rx: 42 },
];

export default function PartnersImageGrid() {
  const rootRef = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = imgWrapRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Entrance: fades/scales the whole grid in as one unit, timed to
      // land after the heading's own reveal wave (delay 0.15 + ~2 * 0.12).
      gsap.fromTo(
        rootRef.current,
        { opacity: 0, scale: 0.92 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          delay: 0.4,
          ease: "power3.out",
        },
      );

      // Self-playing Ken Burns pan, independent of the entrance above.
      gsap.fromTo(
        el,
        { scale: 1, xPercent: -3, yPercent: -3 },
        {
          scale: 1.15,
          xPercent: 3,
          yPercent: 3,
          duration: 24,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        },
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative aspect-600/340 w-full opacity-0">
      <svg viewBox="0 0 600 340" className="absolute inset-0 h-full w-full">
        <defs>
          <clipPath id="partners-grid-clip" clipPathUnits="userSpaceOnUse">
            {PILLS.map((pill, i) => (
              <rect key={i} {...pill} />
            ))}
          </clipPath>
        </defs>
        <foreignObject
          width="600"
          height="340"
          clipPath="url(#partners-grid-clip)"
        >
          <div
            {...{ xmlns: "http://www.w3.org/1999/xhtml" }}
            className="relative h-full w-full overflow-hidden"
          >
            <div ref={imgWrapRef} className="absolute inset-0">
              <Image
                src="/assets/images/partners-hero.png"
                alt="Growthpad partner network"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </foreignObject>
      </svg>

      <div
        className="absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:h-20 sm:w-20"
        style={{ left: "85.8%", top: "12.4%" }}
      >
        <Arrow className="text-secondary/15 h-16 w-16 sm:h-20 sm:w-20" />
      </div>

      <div
        className="absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:h-20 sm:w-20"
        style={{ left: "13.3%", top: "73.5%" }}
      >
        <Arrow className="text-primary h-16 w-16 sm:h-20 sm:w-20" />
      </div>
    </div>
  );
}
