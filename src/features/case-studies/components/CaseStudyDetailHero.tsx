"use client";

import { useEffect, useRef, ViewTransition } from "react";
import Image from "next/image";
import Breadcrumb from "@/shared/components/Breadcrumb";
import { isSanityUrl } from "@/sanity/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function CaseStudyDetailHero({
  title,
  brand,
  slug,
  image,
  imageAlt,
  videoUrl,
}: {
  title: string;
  brand: string;
  slug: string;
  image?: string;
  imageAlt: string;
  videoUrl?: string | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!containerRef.current || !mediaRef.current) return;

      gsap.fromTo(
        mediaRef.current,
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-[70vh] min-h-125 w-full overflow-hidden">
      {/* Background Media with Parallax Effect */}
      <div ref={mediaRef} className="absolute inset-0 scale-125">
        {videoUrl ? (
          <ViewTransition name={`case-study-image-${slug}`} share="morph">
            <video
              src={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          </ViewTransition>
        ) : image ? (
          <ViewTransition name={`case-study-image-${slug}`} share="morph">
            <Image
              src={image}
              alt={imageAlt}
              fill
              priority
              unoptimized={isSanityUrl(image)}
              sizes="100vw"
              className="object-cover"
            />
          </ViewTransition>
        ) : null}
      </div>

      {/* Left-to-right scrim so white text stays legible regardless of
          what's behind it in the photo. */}
      <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />

      <div className="container-fluid relative flex h-full items-center">
        <div className="flex flex-col items-start gap-4">
          <Breadcrumb
            items={[
              { label: "Case Studies", href: "/case-studies#case-studies-grid" },
              { label: brand },
            ]}
            variant="light"
          />
          <h1 className="font-display max-w-xl text-3xl leading-tight font-light text-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}
