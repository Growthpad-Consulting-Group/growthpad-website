"use client";

import { useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import ArrowGroup, { Arrow } from "@/shared/components/ArrowGroup";
import Modal from "@/shared/components/Modal";
import { useStickyStackScroll } from "@/shared/hooks/useStickyStackScroll";

export type VideoStory = {
  name: string;
  title: string;
  youtubeId: string;
};

const CARD_TOP_OFFSET_PX = 16;

function chunk<T>(items: T[], size: number): T[][] {
  const groups: T[][] = [];
  for (let i = 0; i < items.length; i += size) groups.push(items.slice(i, i + size));
  return groups;
}

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
  story,
  className,
  onPlay,
}: {
  story: VideoStory;
  className: string;
  onPlay: (story: VideoStory) => void;
}) {
  return (
    <div
      className={`group aspect-video overflow-hidden rounded-2xl shadow-lg shadow-secondary/10 transition-shadow duration-300 ease-out hover:shadow-xl hover:shadow-primary/35 ${className}`}
    >
      <button
        type="button"
        onClick={() => onPlay(story)}
        aria-label={`Play video from ${story.name}`}
        className="absolute inset-0 h-full w-full"
      >
        <Image
          src={`https://i.ytimg.com/vi/${story.youtubeId}/hqdefault.jpg`}
          alt={story.name}
          fill
          unoptimized
          sizes="(min-width: 1024px) 33vw, 100vw"
          loading="eager"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/25 transition-colors duration-300 group-hover:bg-black/35" />
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayButton />
        </div>
        <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black/70 to-transparent p-4 text-left sm:p-5">
          <p className="font-display text-base font-bold text-white sm:text-lg">
            {story.name}
          </p>
          <p className="text-sm text-white/80">{story.title}</p>
        </div>
      </button>
    </div>
  );
}

export default function VideoStoryGrid({
  theme = "light",
  heading,
  videos,
  navLabel = "videos",
}: {
  theme?: "light" | "dark" | "gray" | "cream";
  heading: ReactNode;
  videos: VideoStory[];
  navLabel?: string;
}) {
  const pairs = useMemo(() => chunk(videos, 2), [videos]);

  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);
  const activeVideo = activeVideoIndex !== null ? videos[activeVideoIndex] : null;
  const playVideo = (story: VideoStory) => setActiveVideoIndex(videos.indexOf(story));

  const {
    sectionRef,
    gridRef,
    wrappersRef,
    contentsRef,
    mobileScrollerRef,
    activeIndex,
    goTo,
    advanceMobile,
  } = useStickyStackScroll({ itemCount: pairs.length, blur: true });

  return (
    <section
      ref={sectionRef}
      data-theme-section={theme}
      className="theme-bg relative w-full py-20 lg:py-28"
    >
      <div className="container-fluid grid grid-cols-[1fr_auto_1fr] items-center gap-6">
        <div />
        <h2 className="font-display theme-fg text-center text-4xl font-bold sm:text-5xl">
          {heading}
        </h2>
        <ArrowGroup count={5} className="hidden justify-self-end sm:flex" />
      </div>

      {/* Mobile/tablet: a swipeable horizontal row, one video per view —
          the desktop sticky-stack pairs are too cramped as 54%-wide tiles
          on a narrow screen. Mirrors PickACard's mobile treatment. */}
      <div className="container-fluid mt-10 lg:hidden">
        <div
          ref={mobileScrollerRef}
          className="hide-scrollbar -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4"
        >
          {videos.map((story) => (
            <VideoTile
              key={story.name}
              story={story}
              className="relative aspect-video w-[85%] shrink-0 snap-start sm:w-[60%]"
              onPlay={playVideo}
            />
          ))}
        </div>

        <div className="mt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => advanceMobile(-1)}
            aria-label={`Previous ${navLabel}`}
            className="theme-fg flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-opacity"
          >
            <Arrow className="h-4 w-4 -rotate-90" />
          </button>
          <button
            type="button"
            onClick={() => advanceMobile(1)}
            aria-label={`Next ${navLabel}`}
            className="bg-primary flex h-11 w-11 items-center justify-center rounded-full text-white transition-opacity"
          >
            <Arrow className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="container-fluid mt-16 hidden lg:block">
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
                    story={pair[0]}
                    className="absolute top-0 left-0 w-[54%]"
                    onPlay={playVideo}
                  />
                )}
                {pair[1] && (
                  <VideoTile
                    story={pair[1]}
                    className="absolute right-0 bottom-0 w-[54%]"
                    onPlay={playVideo}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-8 z-20 mt-8 hidden items-center justify-between gap-3 lg:flex">
          <ArrowGroup count={5} />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label={`Previous ${navLabel}`}
              className="theme-fg flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Arrow className="h-4 w-4 -rotate-90" />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              disabled={activeIndex === pairs.length - 1}
              aria-label={`Next ${navLabel}`}
              className="bg-primary flex h-11 w-11 items-center justify-center rounded-full text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Arrow className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <Modal
        open={!!activeVideo}
        onClose={() => setActiveVideoIndex(null)}
        onPrev={() => setActiveVideoIndex((i) => (i === null ? null : i - 1))}
        onNext={() => setActiveVideoIndex((i) => (i === null ? null : i + 1))}
        prevDisabled={activeVideoIndex === 0}
        nextDisabled={activeVideoIndex === videos.length - 1}
      >
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
