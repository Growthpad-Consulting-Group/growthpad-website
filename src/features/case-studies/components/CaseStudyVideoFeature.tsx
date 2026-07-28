"use client";

import { useState } from "react";
import Image from "next/image";
import Modal from "@/shared/components/Modal";
import { isSanityUrl } from "@/sanity/image";
import { Icon } from "@iconify/react";

function PlayButton() {
  return (
    <span className="bg-primary flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-white shadow-lg transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20">
      <Icon icon="solar:play-bold" className="h-8 w-8 sm:h-10 sm:w-10" />
    </span>
  );
}

export default function CaseStudyVideoFeature({
  title,
  thumbnail,
  youtubeId,
  videoSrc,
}: {
  title: string;
  thumbnail: string;
  youtubeId?: string;
  videoSrc?: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <section data-theme-section="dark" className="theme-bg w-full py-20 lg:py-28">
      <div className="container-fluid">
        <div className="relative mx-auto w-[75%] lg:w-[70%]">
          <div
            aria-hidden
            className="absolute -top-10 -bottom-10 -left-8 z-0 hidden w-16 rounded-2xl bg-repeat-y opacity-30 sm:block lg:-left-10 lg:w-20 lg:-top-16 lg:-bottom-16"
            style={{ backgroundImage: "url(/assets/images/footer-bg.png)" }}
          />

          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${title}`}
            className="group relative z-10 block aspect-16/9 w-full overflow-hidden rounded-3xl sm:aspect-2/1 shadow-2xl shadow-secondary/10 transition-all duration-600 ease-out hover:shadow-2xl hover:shadow-primary/10"
          >
            <Image
              src={thumbnail}
              alt={title}
              fill
              unoptimized={isSanityUrl(thumbnail)}
              sizes="100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/35" />

            <div className="relative flex h-full items-center justify-center">
              <PlayButton />
            </div>
          </button>
        </div>
      </div>

      <Modal open={playing} onClose={() => setPlaying(false)}>
        <div className="aspect-video w-full overflow-hidden">
          {youtubeId ? (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              className="h-full w-full"
            />
          ) : videoSrc ? (
            <video
              src={videoSrc}
              autoPlay
              controls
              playsInline
              className="h-full w-full object-contain"
            />
          ) : null}
        </div>
      </Modal>
    </section>
  );
}
