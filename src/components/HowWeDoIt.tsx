"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArrowGroup from "@/components/ArrowGroup";
import { howWeDoIt } from "@/data/howWeDoIt";

// Adapted from the CodyHouse "stacking cards" pattern: a CSS Grid with
// uniform row height + a LARGE gap between rows is what actually gives
// earlier cards room to stay visible, peeking above the newer ones as
// they land — not the row height itself. Each card is `position: sticky;
// top: 0` with an increasing `padding-top` per index (the fan stagger),
// so successive cards rest at progressively lower on-screen positions
// instead of all piling up at the exact same spot.
const CARD_TOP_OFFSET_PX = 28;
const STICK_TOP_PX = 96;

export default function HowWeDoIt() {
  const gridRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const progressNumRef = useRef<HTMLDivElement>(null);
  const wrappersRef = useRef<(HTMLDivElement | null)[]>([]);
  const contentsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const grid = gridRef.current;
    const progressFill = progressLineRef.current;
    const progressNum = progressNumRef.current;
    const wrappers = wrappersRef.current.filter(Boolean) as HTMLDivElement[];
    const contents = contentsRef.current.filter(Boolean) as HTMLDivElement[];
    if (!grid || contents.length === 0) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const setCardHeight = () => {
          const tallest = Math.max(...contents.map((c) => c.offsetHeight));
          grid.style.setProperty("--card-height", `${tallest}px`);
          ScrollTrigger.refresh();
        };

        setCardHeight();

        let prevWidth = window.innerWidth;
        const handleResize = () => {
          if (window.innerWidth !== prevWidth) {
            prevWidth = window.innerWidth;
            setCardHeight();
          }
        };
        window.addEventListener("resize", handleResize);

        if (progressFill) {
          gsap.to(progressFill, {
            height: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: grid,
              start: `top ${STICK_TOP_PX}px`,
              end: "bottom bottom",
              scrub: true,
            },
          });
        }

        const updateNumber = (index: number) => {
          if (!progressNum) return;
          const num = Math.max(0, index) + 1;
          progressNum.innerText = num < 10 ? `0${num}` : `${num}`;
        };
        updateNumber(0);

        wrappers.forEach((wrapper, index) => {
          gsap.set(contents[index], { zIndex: 10 + index });

          ScrollTrigger.create({
            trigger: wrapper,
            // "top top" (matching the sticky mechanics) fires too late —
            // thanks to the large gap between rows, a card already reads
            // as the prominent one on screen well before it's technically
            // locked into its sticky point. "center center" tracks visual
            // prominence better, but is unreachable for the LAST card
            // specifically (nothing pushes behind it, so the page can run
            // out of scroll room before its center ever reaches viewport
            // middle). "top 60%" needs less scroll to satisfy and still
            // reads as "this card is now the prominent one."
            start: "top 60%",
            onEnter: () => updateNumber(index),
            onLeaveBack: () => updateNumber(index - 1),
          });

          if (index === wrappers.length - 1) return;

          const nextWrapper = wrappers[index + 1];
          // A subtle per-card recede as the next one lands on top — cards
          // stay visible in the cascade (this isn't a full swap), just a
          // gentle depth cue so the newest card clearly reads as "on top."
          const toScale = 1 - (wrappers.length - 1 - index) * 0.03;
          const toBrightness = 1 - (wrappers.length - 1 - index) * 0.08;

          gsap.set(contents[index], { transformOrigin: "50% 0%" });
          gsap.fromTo(
            contents[index],
            { scale: 1, filter: "brightness(1)" },
            {
              scale: toScale,
              filter: `brightness(${toBrightness})`,
              ease: "none",
              scrollTrigger: {
                trigger: nextWrapper,
                start: "top bottom",
                end: "top top",
                scrub: true,
              },
            },
          );
        });

        return () => {
          window.removeEventListener("resize", handleResize);
        };
      });
    }, grid);

    return () => ctx.revert();
  }, []);

  return (
    <section
      data-theme-section="dark"
      className="theme-bg relative w-full py-20 lg:py-28"
    >
      <div className="container-fluid">
        <div className="theme-fg flex items-start justify-between gap-6">
          <div>
            <h2 className="font-display text-4xl font-bold sm:text-5xl">
              How we do it
            </h2>
            <p className="mt-4 max-w-md text-lg leading-8 opacity-60">
              We make bold moves to disrupt the present and build the future
              for your organization.
            </p>
          </div>

          <ArrowGroup count={5} className="hidden sm:flex" />
        </div>

        <div className="mx-auto mt-16 flex max-w-5xl items-start gap-12 lg:gap-24">
          <div
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--theme-fg) 10%, transparent)",
              top: `${STICK_TOP_PX}px`,
              height: `calc(100vh - ${STICK_TOP_PX * 2}px)`,
            }}
            className="relative hidden w-0.5 self-stretch md:sticky md:block"
          >
            <div
              ref={progressLineRef}
              className="bg-primary absolute top-0 left-0 w-full origin-top"
              style={{ height: "0%" }}
            >
              <div
                ref={progressNumRef}
                className="font-display text-primary pointer-events-none absolute bottom-0 left-6 translate-y-1/2 text-4xl font-black select-none"
              >
                01
              </div>
            </div>
          </div>

          <div
            ref={gridRef}
            style={{
              gridTemplateRows: `repeat(${howWeDoIt.length}, var(--card-height, auto))`,
              gap: "calc(3rem + var(--card-height, 0px) / 3)",
              paddingBottom: `${howWeDoIt.length * CARD_TOP_OFFSET_PX}px`,
            }}
            className="grid flex-1"
          >
            {howWeDoIt.map((step, index) => (
              <div
                key={step.title}
                ref={(el) => {
                  wrappersRef.current[index] = el;
                }}
                style={{
                  top: 0,
                  paddingTop: `${(index + 1) * CARD_TOP_OFFSET_PX}px`,
                }}
                className="sticky"
              >
                <div
                  ref={(el) => {
                    contentsRef.current[index] = el;
                  }}
                  className={`bg-secondary grid items-center gap-10 rounded-3xl border border-white/10 p-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] will-change-transform md:p-10 lg:grid-cols-2 ${
                    index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div className="notch-image relative aspect-4/3 w-full overflow-hidden rounded-2xl">
                    <span className="bg-primary absolute -top-4 -left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white shadow-lg md:hidden">
                      {index + 1}
                    </span>
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="font-display text-3xl leading-tight font-bold text-white sm:text-4xl">
                      {step.title}
                    </h3>
                    <p className="mt-5 max-w-md text-lg leading-8 text-white/60">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
