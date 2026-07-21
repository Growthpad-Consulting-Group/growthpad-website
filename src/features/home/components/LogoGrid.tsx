"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Carousel from "@/features/home/components/Carousel";

export type LogoItem = {
  name: string;
  src: string;
};

function LogoTile({
  item,
  variant = "carousel",
}: {
  item: LogoItem;
  variant?: "grid" | "carousel";
}) {
  return (
    <div
      className={`border-secondary/10 group relative flex aspect-square items-center justify-center border-r border-b p-6 transition-all duration-700 ease-out hover:z-20 hover:scale-[0.96] hover:rounded-2xl hover:border-transparent hover:bg-white hover:shadow-xl hover:shadow-primary/20 sm:p-8 ${
        variant === "carousel" ? "border-t border-l" : ""
      }`}
    >
      <Image
        src={item.src}
        alt={item.name}
        width={160}
        height={160}
        className="h-auto max-h-32 w-full object-contain grayscale transition-all duration-700 ease-out group-hover:grayscale-0"
      />
    </div>
  );
}

export default function LogoGrid({
  theme = "light",
  heading,
  subheading,
  items,
}: {
  theme?: "light" | "gray";
  heading: string;
  subheading?: string;
  items: LogoItem[];
}) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!gridRef.current) return;

      gsap.fromTo(
        gridRef.current.children,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.07,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      data-theme-section={theme}
      className="theme-bg relative w-full py-20 lg:py-28"
    >
      <div className="container-fluid flex flex-col items-center text-center">
        <h2 className="font-display theme-fg text-4xl font-bold sm:text-5xl">
          {heading}
        </h2>
        {subheading && (
          <p className="theme-fg mt-4 text-lg leading-8 opacity-70">
            {subheading}
          </p>
        )}
      </div>

      {/* Mobile/tablet: a carousel (2 logos per view + nav buttons) instead
          of the full grid — a 6-column grid of small logo tiles doesn't
          leave room to actually see each logo on a narrow screen. */}
      <div className="mt-16 lg:hidden">
        <Carousel itemsPerView={2} className="container-fluid">
          {items.map((item) => (
            <LogoTile key={item.name} item={item} variant="carousel" />
          ))}
        </Carousel>
      </div>

      <div
        ref={gridRef}
        className="border-secondary/10 mx-auto mt-16 hidden max-w-6xl border-t border-l lg:grid lg:grid-cols-6"
      >
        {items.map((item) => (
          <LogoTile key={item.name} item={item} variant="grid" />
        ))}
      </div>
    </section>
  );
}
