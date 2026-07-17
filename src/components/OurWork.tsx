"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArrowGroup, { Arrow } from "@/components/ArrowGroup";
import { ourWork, type CaseStudy, type MediaItem } from "@/data/ourWork";

const CARD_TOP_OFFSET_PX = 16;

function MediaTile({ item }: { item: MediaItem }) {
  const defaultAspect = item.fullRow ? "aspect-2/1" : "aspect-square";

  return (
    <div
      className={`group relative ${item.fullRow ? "col-span-2" : ""} ${item.rowSpan ? "row-span-2 h-full" : (item.aspectClassName ?? defaultAspect)}`}
    >
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes={
          item.fullRow
            ? "(min-width: 1024px) 45vw, 90vw"
            : "(min-width: 1024px) 22vw, 45vw"
        }
        className=" object-contain transition-transform duration-500 ease-out group-hover:scale-105"
      />
    </div>
  );
}

function WorkCardBody({
  project,
  mediaExtra,
}: {
  project: CaseStudy;
  mediaExtra?: React.ReactNode;
}) {
  return (
    <>
      {project.bgImage && (
        <Image
          src={project.bgImage}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      )}

      <div className="relative flex flex-col gap-8">
        <Image
          src={project.logoSrc}
          alt={project.brand}
          width={project.logoWidth}
          height={project.logoHeight}
          className={`h-auto object-contain ${project.logoClassName ?? "w-44"}`}
        />

        <p className="text-lg font-semibold text-white sm:text-xl">
          {project.tagline}
        </p>

        <div>
          <span className="text-lg font-bold text-yellow-400">Role</span>
          <p className="mt-3 text-base leading-7 whitespace-pre-line text-white/80 sm:text-lg sm:leading-8">
            {project.role}
          </p>
        </div>

        <div>
          <span className="text-lg font-bold text-yellow-400 ">Impact</span>
          <p className="mt-3 text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
            {project.impact}
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {project.media.map((item, i) => (
            <MediaTile key={i} item={item} />
          ))}
        </div>

        {mediaExtra}
      </div>
    </>
  );
}

export default function OurWork() {
  const gridRef = useRef<HTMLDivElement>(null);
  const wrappersRef = useRef<(HTMLDivElement | null)[]>([]);
  const contentsRef = useRef<(HTMLDivElement | null)[]>([]);
  const mobileScrollerRef = useRef<HTMLDivElement>(null);

  const goTo = (index: number) => {
    const current = wrappersRef.current[index];
    const next = wrappersRef.current[index + 1];
    if (!current) return;

    if (!next) {
      current.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    // Land one viewport-height before the next card's entrance transition
    // starts, since sticky cards always report rect.top as 0 (breaks scrollIntoView).
    const targetY =
      next.getBoundingClientRect().top + window.scrollY - window.innerHeight;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  const advanceMobile = (direction: 1 | -1) => {
    const el = mobileScrollerRef.current;
    const tile = el?.firstElementChild as HTMLElement | null;
    if (!el || !tile) return;
    const step = tile.getBoundingClientRect().width + 16; // tile + gap-4
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const grid = gridRef.current;
    const contents = contentsRef.current.filter(Boolean) as HTMLDivElement[];
    const wrappers = wrappersRef.current.filter(Boolean) as HTMLDivElement[];
    if (!grid || contents.length === 0) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
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

        contents.forEach((content, index) => {
          gsap.set(content, { zIndex: 10 + index });
          if (index === wrappers.length - 1) return;

          const nextWrapper = wrappers[index + 1];
          const toScale = 1 - (wrappers.length - 1 - index) * 0.03;
          const toBrightness = 1 - (wrappers.length - 1 - index) * 0.12;

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
    <section className="relative w-full bg-white overflow-visible">
      <div className="container-fluid">
        <h2 className="font-display text-secondary text-4xl font-bold sm:text-5xl">
          Some of our work
        </h2>
      </div>

      {/* Mobile/tablet: a swipeable horizontal row, one case study per
          view — the desktop sticky-stack cards are a very tall list once
          unstuck on a narrow screen. Mirrors PickACard/Testimonials. */}
      <div className="mt-10 lg:hidden">
        <div
          ref={mobileScrollerRef}
          className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:px-6"
        >
          {ourWork.map((project) => (
            // No data-theme-section here: this row is display:none above
            // lg, and a hidden element's getBoundingClientRect() is all
            // zeros, which ScrollColorTransition would misread as "always
            // in view" and use to corrupt the header theme everywhere else
            // on the page. The always-visible desktop cards below carry it.
            <div
              key={project.brand}
              className={`relative grid w-[88%] shrink-0 snap-start gap-8 overflow-hidden rounded-3xl p-8 sm:p-12 ${project.className}`}
            >
              <WorkCardBody project={project} />
            </div>
          ))}
        </div>

        <div className="container-fluid mt-4 flex items-center justify-between">
          <ArrowGroup count={5} />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => advanceMobile(-1)}
              aria-label="Previous project"
              className="text-secondary flex h-11 w-11 items-center justify-center rounded-full bg-black/5 transition-opacity"
            >
              <Arrow className="h-4 w-4 -rotate-90" />
            </button>
            <button
              type="button"
              onClick={() => advanceMobile(1)}
              aria-label="Next project"
              className="bg-primary flex h-11 w-11 items-center justify-center rounded-full text-white transition-opacity"
            >
              <Arrow className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 hidden w-full px-4 sm:px-6 lg:block">
        <div
          ref={gridRef}
          style={{
            gridTemplateRows: `repeat(${ourWork.length}, var(--card-height, auto))`,
            gap: "calc(1rem + var(--card-height, 0px) / 20)",
            paddingBottom: `${ourWork.length * CARD_TOP_OFFSET_PX}px`,
          }}
          className="grid"
        >
          {ourWork.map((project, index) => (
            <div
              key={project.brand}
              ref={(el) => {
                wrappersRef.current[index] = el;
              }}
              data-theme-section={project.theme ?? "dark"}
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
                className={`relative grid gap-10 overflow-hidden rounded-3xl p-8 will-change-transform sm:p-12 lg:grid-cols-2 lg:items-center lg:p-16 ${project.className}`}
              >
                <WorkCardBody
                  project={project}
                  mediaExtra={
                    <div className="mt-6 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => goTo(index - 1)}
                        disabled={index === 0}
                        aria-label="Previous project"
                        className="text-secondary flex h-11 w-11 items-center justify-center rounded-full bg-white transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Arrow className="h-4 w-4 -rotate-90" />
                      </button>
                      <button
                        type="button"
                        onClick={() => goTo(index + 1)}
                        disabled={index === ourWork.length - 1}
                        aria-label="Next project"
                        className="bg-primary flex h-11 w-11 items-center justify-center rounded-full text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Arrow className="h-4 w-4" />
                      </button>
                    </div>
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
