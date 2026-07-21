"use client";

import { useEffect, useId, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const ARROW_PATH =
  "M359.869 331L359.869 97.6809C359.869 43.7638 316.154 -6.10352e-05 262.228 -6.10352e-05L-3.05176e-05 -6.10352e-05L-3.05176e-05 40.8696L262.228 40.8696C264.184 40.8696 266.118 40.9563 268.027 41.1291C270.773 41.3883 273.122 43.2454 274.055 45.8375C274.987 48.4297 274.34 51.3252 272.388 53.2693C223.276 102.434 42.3693 283.284 42.3693 283.284C56.1478 291.967 67.8193 303.675 76.4249 317.5L306.59 87.3991C308.551 85.455 311.461 84.8063 314.069 85.7136C316.677 86.664 318.512 88.9966 318.784 91.7616C318.944 93.7057 319.047 95.6935 319.047 97.6809L319.047 331L359.869 331Z";

export default function BigArrow({
  className,
  loop = false,
  onClick,
}: {
  className?: string;
  /** Replays the draw-in animation on a continuous loop instead of drawing
   * in once per scroll-into-view. */
  loop?: boolean;
  /** If provided, renders as a button instead of a plain decorative SVG. */
  onClick?: () => void;
}) {
  const gradId = useId();
  const maskId = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const edgeStopRef = useRef<SVGStopElement>(null);
  const edgeStop2Ref = useRef<SVGStopElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const svg = svgRef.current;
    const path = pathRef.current;
    const edgeStop = edgeStopRef.current;
    const edgeStop2 = edgeStop2Ref.current;
    if (!svg || !path || !edgeStop || !edgeStop2) return;

    const length = path.getTotalLength();

    gsap.set(path, {
      stroke: "currentColor",
      strokeWidth: 2,
      strokeDasharray: length,
      strokeDashoffset: length,
    });
    gsap.set([edgeStop, edgeStop2], { attr: { offset: 0 } });

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        repeat: loop ? -1 : 0,
        yoyo: loop,
        repeatDelay: loop ? 0.6 : 0,
        scrollTrigger: {
          trigger: svg,
          start: "top 80%",
          // Looping arrows just play once into view and then repeat on their
          // own; non-looping ones redraw every time they scroll back into view.
          toggleActions: loop ? "play none none none" : "play none restart reverse",
        },
      });

      // Draw the outline, then paint the fill via a diagonal gradient mask.
      timeline
        .to(path, {
          strokeDashoffset: 0,
          duration: 2.2,
          ease: "sine.inOut",
        })
        .to(
          [edgeStop, edgeStop2],
          { attr: { offset: 1 }, duration: 2.0, ease: "power1.inOut" },
          "-=0.4",
        );
    });

    return () => ctx.revert();
  }, [loop]);

  const svg = (
    <svg
      ref={svgRef}
      viewBox="0 0 360 331"
      fill="none"
      className={onClick ? "h-full w-full" : className}
    >
      <defs>
        <linearGradient
          id={gradId}
          gradientUnits="objectBoundingBox"
          x1="0"
          y1="1"
          x2="1"
          y2="0"
        >
          <stop offset="0" stopColor="white" />
          <stop ref={edgeStopRef} offset="0" stopColor="white" />
          <stop ref={edgeStop2Ref} offset="0" stopColor="black" />
          <stop offset="1" stopColor="black" />
        </linearGradient>
        <mask id={maskId} maskUnits="objectBoundingBox">
          <rect x="-50%" y="-50%" width="200%" height="200%" fill={`url(#${gradId})`} />
        </mask>
      </defs>

      {/* Stroke outline — draws in via strokeDashoffset. */}
      <path
        ref={pathRef}
        fillRule="evenodd"
        clipRule="evenodd"
        fill="none"
        d={ARROW_PATH}
      />

      {/* Solid fill — revealed progressively by a diagonal gradient mask,
          giving a "painted on" effect instead of a plain opacity fade. */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
        d={ARROW_PATH}
        mask={`url(#${maskId})`}
      />
    </svg>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label="Scroll to next section"
        className={`cursor-pointer transition-transform duration-300 ease-out hover:scale-105 ${className ?? ""}`}
      >
        {svg}
      </button>
    );
  }

  return svg;
}
