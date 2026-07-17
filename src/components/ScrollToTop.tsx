"use client";

import { useEffect, useState } from "react";
import { Arrow } from "@/components/ArrowGroup";

const SHOW_AFTER_PX = 800;
const SIZE = 56;
const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const scrollY = window.scrollY;
      setVisible(scrollY > SHOW_AFTER_PX);

      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(1, scrollY / scrollable) : 0);
    };

    // rAF-throttled so the ring updates at most once per frame — in sync
    // with real scroll position, not a stepped/delayed readout of it.
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll back to top"
      tabIndex={visible ? 0 : -1}
      style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
      className={`group fixed right-6 bottom-6 z-40 flex h-14 w-14 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-500 sm:right-10 sm:bottom-10 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="absolute inset-0 h-full w-full -rotate-90"
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth="2"
          stroke="currentColor"
          className="text-white/25"
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          stroke="currentColor"
          className="text-primary"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          style={{ transition: "stroke-dashoffset 80ms linear" }}
        />
      </svg>

      <span className="bg-primary group-hover:bg-primary/90 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg shadow-black/20 transition-colors">
        <Arrow className="h-4 w-4 -rotate-45" />
      </span>
    </button>
  );
}
