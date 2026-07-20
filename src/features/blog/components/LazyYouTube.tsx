"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";

export default function LazyYouTube({ videoId }: { videoId: string }) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <div className="my-8 aspect-video w-full overflow-hidden rounded-2xl border border-primary/5 shadow-xl">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full border-0"
          title="YouTube Video Player"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      aria-label="Play video"
      className="group relative my-8 aspect-video w-full overflow-hidden rounded-2xl border border-primary/5 shadow-xl"
    >
      <Image
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt="Video thumbnail"
        fill
        unoptimized
        sizes="(max-width: 768px) 100vw, 800px"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/40" />
      <span className="bg-primary absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
        <Icon icon="solar:play-bold" width={28} height={28} />
      </span>
    </button>
  );
}
