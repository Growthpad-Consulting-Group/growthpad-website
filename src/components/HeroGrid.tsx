"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Arrow } from "@/components/ArrowGroup";

function ArrowTile({ variant }: { variant: "muted" | "primary" | "dark" }) {
  const color =
    variant === "primary"
      ? "text-primary"
      : variant === "dark"
        ? "text-secondary"
        : "text-secondary/15";

  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center sm:h-20 sm:w-20">
      <Arrow className={`h-16 w-16 sm:h-20 sm:w-20 ${color}`} />
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
      // Ken Burns effect: slow, self-playing zoom + gentle pan, looping
      // back and forth. Not tied to scroll.
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
    <div className="relative h-16 flex-1 overflow-hidden rounded-full sm:h-20">
      <div ref={imgWrapRef} className="absolute inset-0">
        <Image src={src} alt={alt} fill className="object-cover" />
      </div>
    </div>
  );
}

export default function HeroGrid() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-x-4">
        <PhotoTile
          src="/assets/images/hero_image_inner_1.png"
          alt=""
          speed={1}
        />
        <ArrowTile variant="muted" />
        <ArrowTile variant="primary" />
      </div>

      <div className="flex items-center gap-x-4">
        <ArrowTile variant="dark" />
        <PhotoTile
          src="/assets/images/hero_image_inner_2.png"
          alt=""
          speed={1.6}
        />
        <ArrowTile variant="muted" />
      </div>

      <div className="flex items-center gap-x-4">
        <PhotoTile
          src="/assets/images/hero_image_inner_3.png"
          alt=""
          speed={0.8}
        />
        <ArrowTile variant="muted" />
        <ArrowTile variant="dark" />
        <ArrowTile variant="muted" />
      </div>

      <div className="flex items-center gap-x-4">
        <ArrowTile variant="muted" />
        <ArrowTile variant="primary" />
        <ArrowTile variant="muted" />
        <PhotoTile
          src="/assets/images/hero_image_inner_4.png"
          alt=""
          speed={1.3}
        />
      </div>
    </div>
  );
}
