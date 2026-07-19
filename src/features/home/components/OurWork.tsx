"use client";

import Image from "next/image";
import ArrowGroup, { Arrow } from "@/shared/components/ArrowGroup";
import { useStickyStackScroll } from "@/hooks/useStickyStackScroll";
import { ourWork, type CaseStudy, type MediaItem } from "@/features/home/data/ourWork";

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

function WorkCardBody({ project }: { project: CaseStudy }) {
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
      </div>
    </>
  );
}

export default function OurWork() {
  const {
    sectionRef,
    gridRef,
    wrappersRef,
    contentsRef,
    mobileScrollerRef,
    activeIndex,
    goTo,
    advanceMobile,
  } = useStickyStackScroll({ itemCount: ourWork.length });

  return (
    <section
      ref={sectionRef}
      data-theme-section="dark"
      className="theme-bg relative w-full overflow-visible"
    >
      <div className="container-fluid">
        <h2 className="font-display theme-fg text-4xl font-bold sm:text-5xl">
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
              className="theme-fg flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-opacity"
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
                <WorkCardBody project={project} />
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-8 z-20 mt-8 flex items-center justify-end gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Previous project"
              className="theme-fg flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Arrow className="h-4 w-4 -rotate-90" />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              disabled={activeIndex === ourWork.length - 1}
              aria-label="Next project"
              className="bg-primary flex h-11 w-11 items-center justify-center rounded-full text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Arrow className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
