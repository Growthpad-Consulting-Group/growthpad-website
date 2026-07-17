"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArrowGroup from "@/components/ArrowGroup";
import { howWeDoIt } from "@/data/howWeDoIt";

const CARD_TOP_OFFSET_PX = 20;
const STICK_TOP_PX = 96;

export default function SpecialtiesTimeline() {
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

        const updateNumber = (index: number) => {
          if (!progressNum) return;
          const num = Math.max(0, index) + 1;
          progressNum.innerText = num < 10 ? `0${num}` : `${num}`;
        };
        updateNumber(0);

        if (progressFill) {
          gsap.to(progressFill, {
            height: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: grid,
              start: `top ${STICK_TOP_PX}px`,
              end: "bottom bottom",
              scrub: true,
              // Same progress value driving the fill line, so the number
              // can't drift out of sync with it.
              onUpdate: (self) => {
                const index = Math.min(
                  wrappers.length - 1,
                  Math.floor(self.progress * wrappers.length),
                );
                updateNumber(index);
              },
            },
          });
        }

        contents.forEach((content, index) => {
          gsap.set(content, { zIndex: 10 + index });

          if (index === wrappers.length - 1) return;

          const nextWrapper = wrappers[index + 1];
          const toScale = 1 - (wrappers.length - 1 - index) * 0.03;
          const toBrightness = 1 - (wrappers.length - 1 - index) * 0.08;

          gsap.set(content, { transformOrigin: "50% 0%" });
          gsap.fromTo(
            content,
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
              Our Specialties
            </h2>
            <p className="mt-4 max-w-md text-lg leading-8 opacity-60">
              We make bold moves to disrupt the present and build the future
              for your organization.
            </p>
          </div>

          <div className="hidden flex-col items-center gap-8 sm:flex">
            <Image
              src="/assets/images/who-resized.gif"
              alt=""
              width={121}
              height={234}
              unoptimized
              className="h-60 w-auto object-contain"
            />
            <ArrowGroup count={5} />
          </div>
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
              gap: "calc(0.5rem + var(--card-height, 0px) / 14)",
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
                  className={`bg-secondary grid items-center gap-8 rounded-3xl border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] will-change-transform md:p-8 lg:grid-cols-2 ${
                    index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div className="notch-image relative aspect-16/10 w-full overflow-hidden rounded-2xl">
                    <span className="bg-primary absolute -top-4 -left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white shadow-lg md:hidden">
                      {index + 1}
                    </span>
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-contain"
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
