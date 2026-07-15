"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Carousel from "@/components/Carousel";
import { clients, type Client } from "@/data/clients";

function LogoTile({ client }: { client: Client }) {
  return (
    <div className="border-secondary/10 group flex aspect-square items-center justify-center border p-6 sm:p-8">
      <Image
        src={`/assets/images/clients/${client.logo}`}
        alt={client.name}
        width={120}
        height={120}
        className="h-auto max-h-24 w-full object-contain grayscale transition-all duration-300 ease-out group-hover:scale-110 group-hover:grayscale-0"
      />
    </div>
  );
}

export default function Clients() {
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
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.03,
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
    <section className="relative w-full bg-white py-20 lg:py-28">
      <div className="container-fluid flex flex-col items-center text-center">
        <h2 className="font-display text-secondary text-4xl font-bold sm:text-5xl">
          You&apos;re in good hands.
        </h2>
        <p className="text-secondary/70 mt-4 text-lg leading-8">
          Growthpad is trusted by industry leaders
        </p>
      </div>

      {/* Mobile/tablet: a carousel (2 logos per view + nav buttons) instead
          of the full grid — a 6-column grid of small logo tiles doesn't
          leave room to actually see each logo on a narrow screen. */}
      <div className="mt-16 lg:hidden">
        <Carousel itemsPerView={2} className="container-fluid">
          {clients.map((client) => (
            <LogoTile key={client.name} client={client} />
          ))}
        </Carousel>
      </div>

      <div
        ref={gridRef}
        className="border-secondary/10 mx-auto mt-16 hidden max-w-6xl border-t border-l lg:grid lg:grid-cols-6"
      >
        {clients.map((client) => (
          <div
            key={client.name}
            className="border-secondary/10 group flex aspect-square items-center justify-center border-r border-b p-6 sm:p-8"
          >
            <Image
              src={`/assets/images/clients/${client.logo}`}
              alt={client.name}
              width={120}
              height={120}
              className="h-auto max-h-24 w-full object-contain grayscale transition-all duration-300 ease-out group-hover:scale-110 group-hover:grayscale-0"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
