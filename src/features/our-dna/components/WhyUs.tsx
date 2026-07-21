"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NotchCard from "@/features/our-dna/components/NotchCard";

const items = [
  {
    title: "We are bold",
    description:
      "We thrive in creating solutions that can evolve your business.",
  },
  {
    title: "We are inquisitive",
    description:
      "We are constantly learning, always evolving. The world is changing quickly, but we're not interested in keeping up—we're interested in leading the way.",
  },
  {
    title: "We are result driven",
    description:
      "We deliver exceptional results for our clients ensuring a highly targeted approach to business growth through digital tools.",
  },
  {
    title: "We are relentless",
    description:
      "We are driven by a constant desire to create something new for our clients, something better, something astounding, something groundbreaking.",
  },
];

export default function WhyUs() {
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // On desktop the two columns share a common scroll trigger so cards
    // in both columns animate together in a single staggered sequence:
    // col1[0] → col2[0] → col1[1] → col2[1] — reading order.
    // The interleaved order is achieved by selecting children from both
    // columns together rather than animating each column independently.
    const ctx = gsap.context(() => {
      const col1Cards = col1Ref.current ? Array.from(col1Ref.current.children) : [];
      const col2Cards = col2Ref.current ? Array.from(col2Ref.current.children) : [];

      // Interleave: [col1[0], col2[0], col1[1], col2[1]]
      const interleaved = col1Cards.flatMap((card, i) =>
        col2Cards[i] ? [card, col2Cards[i]] : [card],
      );

      gsap.fromTo(
        interleaved,
        { autoAlpha: 0, y: 32 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.9,
          ease: "power2.out",
          stagger: 0.22,
          scrollTrigger: {
            trigger: col1Ref.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      data-theme-section="gray"
      className="theme-bg relative w-full py-20 lg:py-28"
    >
      <div className="container-fluid">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display theme-fg text-4xl font-bold sm:text-5xl">
            Why us?
          </h2>

          <p className="theme-fg mt-4 text-lg leading-8 opacity-70">
            The most important part of what we do is listen, be empathetic and
            find solutions attuned to the needs of our clients.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-8">
          <div ref={col1Ref} className="flex flex-col gap-8">
            <NotchCard
              title={items[0].title}
              description={items[0].description}
            />
            <NotchCard
              title={items[2].title}
              description={items[2].description}
            />
          </div>

          <div ref={col2Ref} className="flex flex-col gap-8 lg:mt-16">
            <NotchCard
              title={items[1].title}
              description={items[1].description}
            />
            <NotchCard
              title={items[3].title}
              description={items[3].description}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
