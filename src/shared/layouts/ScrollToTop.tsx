"use client";

import { useEffect, useRef, useState } from "react";
import { Arrow } from "@/shared/components/ArrowGroup";

const SHOW_AFTER_PX = 800;
const SIZE = 56;
const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const ringRef = useRef<SVGCircleElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const scrollY = window.scrollY;
      setVisible(scrollY > SHOW_AFTER_PX);

      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, scrollY / scrollable) : 0;
      if (ringRef.current) {
        ringRef.current.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - progress));
      }
      if (percentRef.current) {
        percentRef.current.textContent = `${Math.round(progress * 100)}%`;
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
      setScrolling(true);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setScrolling(false), 1500);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      if (idleTimer.current) clearTimeout(idleTimer.current);
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
          ? "-translate-y-10 opacity-100"
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
          ref={ringRef}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
        />
      </svg>

      <span className="bg-primary group-hover:bg-primary/90 relative flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg shadow-black/20 transition-colors">
        <Arrow className={`h-4 w-4 -rotate-45 absolute transition-[opacity,transform] duration-300 ${scrolling ? "opacity-0 scale-50" : "opacity-100 scale-100"}`} />
        <span ref={percentRef} className={`absolute text-sm font-bold tabular-nums transition-[opacity,transform] duration-300 ${scrolling ? "opacity-100 scale-100" : "opacity-0 scale-50"}`} />
      </span>
    </button>
  );
}
