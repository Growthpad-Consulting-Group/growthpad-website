"use client";

import { useEffect } from "react";
import gsap from "gsap";

const DARK = "#231812";
const LIGHT = "#ffffff";
const DURATION = 0.7;
const EASE = "sine.inOut";

// The crossing line sits at (1 + LOOKAHEAD_VH) viewport-heights from the
// top of the viewport. 0 = crossing at the very bottom of the screen.
// -0.5 = crossing at the vertical middle (matches the original "top
// center" GSAP trigger). Positive values look further ahead, firing while
// the next section is still off-screen — but that only works for
// boundaries with enough scroll room before them; a section starting
// close to one viewport height in (like About, right under a short Hero)
// would already be "crossed" at page load with any positive value here.
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

    // Recompute the correct theme from scratch — the last (lowest) section
    // whose top has crossed the line — rather than reacting incrementally
    // to each individual crossing event. Adjacent sections' edges can both
    // cross the same observer line near their shared boundary (e.g. one
    // section's bottom and the next section's top can occupy overlapping
    // screen space), so incrementally flipping theme/prevTheme per crossing
    // can end up reflecting whichever edge happened to fire last rather
    // than the section that's actually in view. Recomputing fresh every
    // time is immune to that regardless of which section's edge triggered
    // the callback.
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

    // IntersectionObserver, not GSAP ScrollTrigger, deliberately: it reads
    // each section's live position on every scroll frame straight from the
    // browser's own layout engine, so it can't drift out of sync the way
    // ScrollTrigger's cached start/end values can when something elsewhere
    // on the page uses pin:true (GSAP's cumulative pin-offset math is
    // shared globally across every trigger, so an unrelated pinned section
    // can throw this off by 1000+px — confirmed by direct measurement).
    const observer = new IntersectionObserver(() => applyCurrentTheme(), {
      rootMargin: `0px 0px ${LOOKAHEAD_VH * 100}% 0px`,
      threshold: 0,
    });

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return null;
}
