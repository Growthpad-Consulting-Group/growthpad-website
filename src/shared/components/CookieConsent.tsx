"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

const CONSENT_KEY = "gcg_cookie_consent";
const TRANSITION_MS = 450;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function enableAnalytics() {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", { analytics_storage: "granted" });
  }
}

export default function CookieConsent() {
  const [rendered, setRendered] = useState(false);
  const [entered, setEntered] = useState(false);
  const unmountTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      const t = setTimeout(() => setRendered(true), 1200);
      return () => clearTimeout(t);
    }
    if (stored === "granted") enableAnalytics();
  }, []);

  // Mounting with `entered` already true would skip the CSS transition, so
  // flip it on the next frame once the initial (off-screen) styles have
  // actually painted.
  useEffect(() => {
    if (!rendered) return;
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, [rendered]);

  useEffect(() => {
    if (!rendered) return;
    const onScroll = () => { if (window.scrollY > 80) dismiss(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [rendered]);

  useEffect(() => {
    return () => {
      if (unmountTimeout.current) clearTimeout(unmountTimeout.current);
    };
  }, []);

  function dismiss() {
    localStorage.setItem(CONSENT_KEY, "granted");
    enableAnalytics();
    setEntered(false);
    unmountTimeout.current = setTimeout(() => setRendered(false), TRANSITION_MS);
  }

  if (!rendered) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie notice"
      style={{
        transitionDuration: `${TRANSITION_MS}ms`,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      className={`fixed bottom-4 left-4 right-4 z-9999 mx-auto max-w-2xl transition-[transform,opacity] ${
        entered ? "translate-y-0 opacity-100" : "translate-y-30 opacity-0"
      }`}
    >
      <div className="relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-[#1a1008]/90 px-5 py-4 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <div className="pointer-events-none absolute -left-10 -top-10 h-36 w-36 rounded-full bg-primary/20 blur-2xl" />

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Icon icon="solar:shield-check-broken" width={22} height={22} />
        </div>

        <p className="flex-1 text-sm leading-relaxed text-white/70">
          <span className="font-semibold text-white">We use cookies</span> to analyze site traffic and improve your experience.{" "}
          <Link href="/privacy-policy" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">
            Privacy Policy
          </Link>
        </p>

        <button
          onClick={dismiss}
          aria-label="Dismiss cookie notice"
          className="shrink-0 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
