"use client";

import { useEffect } from "react";
import gsap from "gsap";

const DARK = "#231812";
const LIGHT = "#ffffff";
const DURATION = 0.7;
const EASE = "sine.inOut";

// Crossing line = (1 + LOOKAHEAD_VH) viewport-heights from the top.
// -0.5 = vertical middle. Keep this ≤ 0: a positive (look-ahead) value
// breaks the first boundary if that section starts less than one
// viewport height down (e.g. right under a short Hero).
const LOOKAHEAD_VH = -0.5;

export default function ScrollColorTransition() {
  useEffect(() => {
    // Any section can opt into the theme system by adding
    // data-theme-section="dark" or "light" — no changes needed here to
    // register a new boundary.
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-theme-section]"),
    );
    const navLogoLight = document.querySelector<HTMLElement>(
      "[data-nav-logo-light]",
    );

    // Client logo images (dark PNGs/SVGs) can't be recolored via a CSS
    // variable, so they get a filter-invert exception.
    const logos = Array.from(
      document.querySelectorAll<HTMLElement>(".home-logo"),
    );

    const tweenAll = (dark: boolean, instant = false) => {
      const opts = {
        duration: instant ? 0 : DURATION,
        ease: EASE,
        overwrite: "auto" as const,
      };

      // Everything using .theme-bg / .theme-fg / .theme-invert-* /
      // .theme-surface updates automatically from these two variables —
      // no per-element registration needed here.
      gsap.to(document.documentElement, {
        "--theme-bg": dark ? DARK : LIGHT,
        "--theme-fg": dark ? LIGHT : DARK,
        ...opts,
      });

      if (logos.length) {
        gsap.to(logos, {
          filter: dark ? "brightness(0) invert(1)" : "brightness(1) invert(0)",
          ...opts,
        });
      }
      if (navLogoLight) {
        gsap.to(navLogoLight, { opacity: dark ? 1 : 0, ...opts });
      }
    };

    const rootBottom = () =>
      window.innerHeight + window.innerHeight * LOOKAHEAD_VH;

    // Recompute from scratch each time (last section whose top has
    // crossed the line) rather than reacting incrementally per crossing
    // event — adjacent sections' edges can cross the same line near their
    // shared boundary, so incremental flips can reflect whichever edge
    // fired last instead of what's actually in view.
    const applyCurrentTheme = (instant = false) => {
      const bottom = rootBottom();
      let theme = "light";
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top < bottom) {
          theme = section.dataset.themeSection ?? theme;
        }
      });
      tweenAll(theme === "dark", instant);
    };

    // Set the correct starting theme synchronously (no animation) based on
    // where we actually are on load/hydration, before the observer engages.
    applyCurrentTheme(true);

    // IntersectionObserver, not GSAP ScrollTrigger: it reads live layout
    // directly, so it can't drift out of sync with a pin:true elsewhere
    // on the page corrupting GSAP's shared scroll-position cache.
    const observer = new IntersectionObserver(() => applyCurrentTheme(), {
      rootMargin: `0px 0px ${LOOKAHEAD_VH * 100}% 0px`,
      threshold: 0,
    });

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return null;
}
