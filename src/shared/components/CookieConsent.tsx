"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Icon } from "@iconify/react";

const CONSENT_KEY = "gcg_cookie_consent";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function enableAnalytics() {
  if (typeof window === "undefined") return;
  // Un-deny the GA config so tracking fires
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: "granted",
    });
  }
}

function denyAnalytics() {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: "denied",
    });
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      // Small delay so the page renders first
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
    if (stored === "granted") enableAnalytics();
  }, []);

  // Auto-accept on scroll — continued browsing implies consent
  useEffect(() => {
    if (!visible) return;
    const onScroll = () => {
      if (window.scrollY > 80) handleAccept();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  function handleAccept() {
    localStorage.setItem(CONSENT_KEY, "granted");
    enableAnalytics();
    setVisible(false);
  }

  function handleDecline() {
    localStorage.setItem(CONSENT_KEY, "denied");
    denyAnalytics();
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cookie-banner"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-live="polite"
          aria-label="Cookie consent"
          className="fixed bottom-4 left-4 right-4 z-[9999] mx-auto max-w-2xl"
        >
          <div className="relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-[#1a1008]/90 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl sm:flex-row sm:items-center sm:gap-6">
            {/* Accent glow */}
            <div className="pointer-events-none absolute -left-10 -top-10 h-36 w-36 rounded-full bg-primary/20 blur-2xl" />

            {/* Icon */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Icon icon="solar:shield-check-broken" width={22} height={22} />
            </div>

            {/* Copy */}
            <div className="flex-1 text-sm leading-relaxed text-white/70">
              <span className="font-semibold text-white">We use cookies</span> to
              analyze site traffic via Google Analytics and improve your
              experience. Read our{" "}
              <Link
                href="/privacy-policy"
                className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={handleDecline}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-white/60 transition-colors hover:border-white/20 hover:text-white"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 hover:shadow-primary/40"
              >
                Accept all
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
