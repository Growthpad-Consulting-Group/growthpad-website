"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Arrow } from "@/shared/components/ArrowGroup";

export default function Modal({
  open,
  onClose,
  onPrev,
  onNext,
  prevDisabled = false,
  nextDisabled = false,
  children,
}: {
  open: boolean;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!open) return;

    setMounted(true);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev && !prevDisabled) onPrev();
      if (e.key === "ArrowRight" && onNext && !nextDisabled) onNext();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => setVisible(true));
    });

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
      cancelAnimationFrame(raf);
      setVisible(false);
    };
  }, [open, onClose, onPrev, onNext, prevDisabled, nextDisabled]);

  useEffect(() => {
    if (open || !mounted) return;

    const timeout = setTimeout(() => setMounted(false), 780);
    return () => clearTimeout(timeout);
  }, [open, mounted]);

  if (!mounted) return null;

  const ease = "cubic-bezier(0.22, 1, 0.36, 1)";

  return createPortal(
    <div
      style={{ transitionTimingFunction: ease }}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md transition-opacity duration-500 sm:p-8 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            d="M6 6l12 12M18 6L6 18"
          />
        </svg>
      </button>

      {onPrev && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          disabled={prevDisabled}
          aria-label="Previous"
          className="absolute top-1/2 left-3 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30 sm:left-6"
        >
          <Arrow className="h-4 w-4 -rotate-90" />
        </button>
      )}

      {onNext && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          disabled={nextDisabled}
          aria-label="Next"
          className="bg-primary hover:bg-primary/90 absolute top-1/2 right-3 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white transition-colors disabled:cursor-not-allowed disabled:opacity-30 sm:right-6"
        >
          <Arrow className="h-4 w-4" />
        </button>
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        style={{ transitionTimingFunction: ease }}
        className={`w-full max-w-4xl rounded-4xl bg-linear-to-b from-white/15 to-white/0 p-px shadow-2xl shadow-black/60 transition-all duration-500 ${
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="relative overflow-hidden rounded-4xl bg-black">
          {children}

          {/* Curtain panels: slide apart from center to reveal the content. */}
          <div
            style={{ transitionTimingFunction: ease, transitionDelay: "80ms" }}
            className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-1/2 bg-black transition-transform duration-700 ${
              visible ? "-translate-x-full" : "translate-x-0"
            }`}
          />
          <div
            style={{ transitionTimingFunction: ease, transitionDelay: "80ms" }}
            className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-1/2 bg-black transition-transform duration-700 ${
              visible ? "translate-x-full" : "translate-x-0"
            }`}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
