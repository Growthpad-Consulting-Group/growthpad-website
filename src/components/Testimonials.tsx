"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArrowGroup, { Arrow } from "@/components/ArrowGroup";
import Modal from "@/components/Modal";
import { testimonials, type Testimonial } from "@/data/testimonials";

const CARD_TOP_OFFSET_PX = 16;

function chunk<T>(items: T[], size: number): T[][] {
  const groups: T[][] = [];
  for (let i = 0; i < items.length; i += size) groups.push(items.slice(i, i + size));
  return groups;
}

const pairs = chunk(testimonials, 2);

function PlayButton() {
  return (
    <span className="bg-primary flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
      <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-5 w-5">
        <path d="M6 4.5v15l13-7.5-13-7.5Z" />
      </svg>
    </span>
  );
}

function VideoTile({
  testimonial,
  className,
  onPlay,
}: {
  testimonial: Testimonial;
  className: string;
  onPlay: (testimonial: Testimonial) => void;
}) {
  return (
    <div
      className={`group aspect-video overflow-hidden rounded-2xl shadow-[0_10px_25px_rgba(35,24,18,0.1)] transition-shadow duration-300 ease-out hover:shadow-[0_20px_45px_rgba(240,93,35,0.35)] ${className}`}
    >
      <button
        type="button"
        onClick={() => onPlay(testimonial)}
        aria-label={`Play testimonial from ${testimonial.name}`}
        className="absolute inset-0 h-full w-full"
      >
        <Image
          src={`https://i.ytimg.com/vi/${testimonial.youtubeId}/hqdefault.jpg`}
          alt={testimonial.name}
          fill
          unoptimized
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/25 transition-colors duration-300 group-hover:bg-black/35" />
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayButton />
        </div>
        <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black/70 to-transparent p-4 text-left sm:p-5">
          <p className="font-display text-base font-bold text-white sm:text-lg">
            {testimonial.name}
          </p>
          <p className="text-sm text-white/80">{testimonial.title}</p>
        </div>
      </button>
    </div>
  );
}

export default function Testimonials() {
  const [activeVideo, setActiveVideo] = useState<Testimonial | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const wrappersRef = useRef<(HTMLDivElement | null)[]>([]);
  const contentsRef = useRef<(HTMLDivElement | null)[]>([]);

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

        const blurEase = gsap.parseEase("power2.in");

        contents.forEach((content, index) => {
          gsap.set(content, { zIndex: 10 + index, transformOrigin: "50% 0%" });
          if (index === wrappers.length - 1) return;

          const nextWrapper = wrappers[index + 1];
          const toScale = 1 - (wrappers.length - 1 - index) * 0.03;
          const toBrightness = 1 - (wrappers.length - 1 - index) * 0.12;
          const toBlur = (wrappers.length - 1 - index) * 10;

          gsap.fromTo(
            content,
            { scale: 1, filter: "brightness(1) blur(0px)" },
            {
              scale: toScale,
              filter: `brightness(${toBrightness}) blur(0px)`,
              ease: "none",
              scrollTrigger: {
                trigger: nextWrapper,
                start: "top bottom",
                end: "top top",
                scrub: true,
                onUpdate: (self) => {
                  const p = self.progress;
                  // Blur uses its own eased curve — stays sharp early on
                  // and only kicks in as the next card actually arrives on
                  // top. Runs after the tween's own render this frame, so
                  // it wins the last write on `filter`.
                  const blur = toBlur * blurEase(p);
                  const brightness = 1 + (toBrightness - 1) * p;
                  content.style.filter = `brightness(${brightness}) blur(${blur}px)`;

                  // Flip which card "owns" the shared nav buttons at the
                  // halfway point of this card's transition into the next.
                  setActiveIndex(p > 0.5 ? index + 1 : index);
                },
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
      data-theme-section="light"
      className="relative w-full bg-white py-20 lg:py-28"
    >
      <div className="container-fluid">
        <div className="flex items-start justify-between gap-6">
          <h2 className="font-display text-secondary text-4xl font-bold sm:text-5xl">
            What do clients say
            <br />
            about us?
          </h2>
          <ArrowGroup count={5} className="hidden sm:flex" />
        </div>
      </div>

      <div className="container-fluid mt-16">
        <div
          ref={gridRef}
          style={{
            gridTemplateRows: `repeat(${pairs.length}, var(--card-height, auto))`,
            gap: "calc(2rem + var(--card-height, 0px) / 14)",
            paddingBottom: `${pairs.length * CARD_TOP_OFFSET_PX}px`,
          }}
          className="grid"
        >
          {pairs.map((pair, index) => (
            <div
              key={index}
              ref={(el) => {
                wrappersRef.current[index] = el;
              }}
              style={{
                top: 0,
                paddingTop: `${(index + 1) * CARD_TOP_OFFSET_PX}px`,
              }}
              className="static lg:sticky"
            >
              <div
                ref={(el) => {
                  contentsRef.current[index] = el;
                }}
                className="relative aspect-16/13 w-full will-change-transform sm:aspect-video"
              >
                {pair[0] && (
                  <VideoTile
                    testimonial={pair[0]}
                    className="absolute top-0 left-0 w-[54%]"
                    onPlay={setActiveVideo}
                  />
                )}
                {pair[1] && (
                  <VideoTile
                    testimonial={pair[1]}
                    className="absolute right-0 bottom-0 w-[54%]"
                    onPlay={setActiveVideo}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-8 z-20 mt-8 hidden justify-end gap-3 lg:flex">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous testimonials"
            className="text-secondary flex h-11 w-11 items-center justify-center rounded-full bg-black/5 transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Arrow className="h-4 w-4 -rotate-90" />
          </button>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex === pairs.length - 1}
            aria-label="Next testimonials"
            className="bg-primary flex h-11 w-11 items-center justify-center rounded-full text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Arrow className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Modal open={!!activeVideo} onClose={() => setActiveVideo(null)}>
        {activeVideo && (
          <div className="aspect-video w-full overflow-hidden rounded-2xl">
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
              title={activeVideo.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        )}
      </Modal>
    </section>
  );
}
