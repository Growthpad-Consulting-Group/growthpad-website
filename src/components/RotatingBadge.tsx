"use client";

import { useEffect, useId, useRef } from "react";
import gsap from "gsap";
import { Arrow } from "@/components/ArrowGroup";

export default function RotatingBadge({
  text,
  size = "h-64 w-64",
  textClassName = "text-xl font-semibold tracking-wide",
  textFill = "var(--theme-fg)",
  arrowClassName = "theme-fg h-20 w-20",
  arrowRotate = 0,
  bgClassName = "",
  duration = 14,
  className = "",
}: {
  text: string;
  size?: string;
  textClassName?: string;
  textFill?: string;
  arrowClassName?: string;
  arrowRotate?: number;
  bgClassName?: string;
  duration?: number;
  className?: string;
}) {
  const ringRef = useRef<SVGSVGElement>(null);
  const pathId = useId();

  useEffect(() => {
    if (!ringRef.current) return;
    const anim = gsap.to(ringRef.current, {
      rotate: 360,
      duration,
      repeat: -1,
      ease: "none",
      transformOrigin: "50% 50%",
    });
    return () => {
      anim.kill();
    };
  }, [duration]);

  // repeat(4) guarantees more raw text than the circle needs; textLength
  // + lengthAdjust then compresses it to exactly match the circumference,
  // so the loop always meets seamlessly regardless of font metrics
  // (repeat-count-by-trial-and-error was never going to be reliable —
  // actual rendered text width varies by font/browser, but a forced
  // textLength can't drift).
  const repeatedText = `${text} . `.repeat(4);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className={`relative flex items-center justify-center rounded-full ${size} ${bgClassName} ${className}`}
    >
      <svg ref={ringRef} viewBox="0 0 240 240" className="absolute inset-0">
        <defs>
          <path
            id={pathId}
            d={`M 120, 120 m -${radius}, 0 a ${radius},${radius} 0 1,1 ${
              radius * 2
            },0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
          />
        </defs>
        <text style={{ fill: textFill }} className={textClassName}>
          <textPath
            href={`#${pathId}`}
            startOffset="0%"
            textLength={circumference}
            lengthAdjust="spacingAndGlyphs"
          >
            {repeatedText}
          </textPath>
        </text>
      </svg>
      <Arrow
        className={arrowClassName}
        style={{ transform: `rotate(${arrowRotate}deg)` }}
      />
    </div>
  );
}
