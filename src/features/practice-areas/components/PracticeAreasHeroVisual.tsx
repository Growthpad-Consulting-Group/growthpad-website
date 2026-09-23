"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Arrow } from "@/shared/components/ArrowGroup";

function ArrowTile({ className = "" }: { className?: string }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center sm:h-16 sm:w-16 lg:h-20 lg:w-20">
      <Arrow className={`h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 ${className}`} />
    </div>
  );
}

function PhotoTile({
  src,
  alt,
  speed = 1,
}: {
  src: string;
  alt: string;
  speed?: number;
}) {
  const imgWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = imgWrapRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scale: 1, xPercent: -3, yPercent: -3 },
        {
          scale: 1.18,
          xPercent: 3,
          yPercent: 3,
          duration: 22 / speed,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        },
      );
    });

    return () => ctx.revert();
  }, [speed]);

  return (
    <div className="flex-1 overflow-hidden rounded-full">
      <div ref={imgWrapRef}>
        <Image
          src={src}
          alt={alt}
          width={600}
          height={400}
          sizes="(min-width: 1024px) 28vw, 100vw"
          className="w-full h-auto block"
        />
      </div>
    </div>
  );
}

const topGrid = [
  "theme-fg opacity-15",
  "text-primary",
  "theme-fg opacity-15",
  "text-primary opacity-15",
  "theme-fg opacity-15",
  "text-primary opacity-15",
];

export default function PracticeAreasHeroVisual() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-6 lg:gap-8">
        <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 shrink-0">
          {topGrid.map((color, i) => (
            <ArrowTile key={i} className={color} />
          ))}
        </div>

        <PhotoTile
          src="/assets/images/practice-img-1-v2.png"
          alt="Growthpad team collaborating in a strategy session"
          speed={1}
        />
      </div>

      <div className="flex items-center gap-6 lg:gap-8">
        <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6 shrink-0">
          <ArrowTile className="theme-fg" />
          <ArrowTile className="text-primary opacity-15" />
          <ArrowTile className="theme-fg" />
        </div>

        <PhotoTile
          src="/assets/images/practice-img-2-v2.png"
          alt="Growthpad practice team reviewing research and delivery plans"
          speed={1.4}
        />
      </div>
    </div>
  );
}
