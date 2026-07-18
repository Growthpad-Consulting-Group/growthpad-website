"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Arrow } from "@/components/ArrowGroup";

const captions = [
  "In 2017, our founder took a leap of faith to establish a people and technology-driven start-up that would seek to help businesses build their next phase of growth through digital media.",
  "Back then, the internet had seen a steady rise and adoption in the country, but businesses weren’t making full use of these newfound channels.",
  "Over the years, our founder and the growing team would turn this tiny idea into one of the most sought-after professional services firms.",
];

export default function OurHeritage() {
  const pinRef = useRef<HTMLDivElement>(null);
  const captionRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const activeIndexRef = useRef(0);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const ctx = gsap.context(() => {
      const pinEl = pinRef.current;
      if (!pinEl) return;

      const captionEls = captionRefs.current.filter(Boolean) as HTMLParagraphElement[];
      gsap.set(captionEls, { opacity: 0 });
      gsap.set(captionEls[0], { opacity: 1 });

      const trigger = ScrollTrigger.create({
        trigger: pinEl,
        start: "top top",
        end: () => `+=${captions.length * window.innerHeight}`,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const index = Math.min(
            captions.length - 1,
            Math.floor(self.progress * captions.length),
          );
          if (index !== activeIndexRef.current) {
            gsap.to(captionEls[activeIndexRef.current], {
              opacity: 0,
              duration: 0.3,
            });
            gsap.to(captionEls[index], { opacity: 1, duration: 0.3 });
            activeIndexRef.current = index;
            setActiveIndex(index);
          }
        },
      });

      triggerRef.current = trigger;

      return () => trigger.kill();
    }, pinRef);

    return () => ctx.revert();
  }, []);

  // Nav buttons jump by scrolling: the caption swap itself is entirely
  // scroll-position-driven (via the ScrollTrigger above), so "going to"
  // a caption just means scrolling to the point in its pinned range where
  // that caption's index becomes active.
  const goTo = (index: number) => {
    const trigger = triggerRef.current;
    if (!trigger || index < 0 || index >= captions.length) return;

    const progress = (index + 0.5) / captions.length;
    const targetY = trigger.start + progress * (trigger.end - trigger.start);

    gsap.to(window, {
      scrollTo: { y: targetY },
      duration: 1,
      ease: "power2.inOut",
    });
  };

  return (
    <section data-theme-section="dark" className="theme-bg relative w-full">
      <div
        ref={pinRef}
        className="theme-bg relative flex h-screen w-full items-center justify-center overflow-hidden"
      >
        <video
          src="/assets/images/hour-glass.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="pointer-events-none mix-blend-screen h-128 w-auto object-contain opacity-40 select-none"
        />

        <div className="container-fluid absolute inset-0">
          <div className="flex h-full flex-col justify-between py-10 lg:py-14">
            <h2 className="font-display theme-fg text-4xl font-bold sm:text-5xl">
              Our Heritage &amp; Story
            </h2>

            <div className="relative flex-1">
              {captions.map((text, i) => (
                <p
                  key={i}
                  ref={(el) => {
                    captionRefs.current[i] = el;
                  }}
                  className="theme-fg absolute inset-0 flex items-center justify-center text-center text-2xl leading-relaxed sm:text-3xl"
                >
                  <span className="max-w-3xl">{text}</span>
                </p>
              ))}
            </div>

            <div className="flex items-center justify-end gap-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => goTo(activeIndex - 1)}
                  disabled={activeIndex === 0}
                  aria-label="Previous"
                  className="theme-fg flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Arrow className="h-4 w-4 -rotate-90" />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(activeIndex + 1)}
                  disabled={activeIndex === captions.length - 1}
                  aria-label="Next"
                  className="bg-primary flex h-11 w-11 items-center justify-center rounded-full text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Arrow className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
