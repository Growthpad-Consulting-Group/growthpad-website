"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const DARK = "#231812";
const LIGHT = "#ffffff";
const DURATION = 0.7;
const EASE = "sine.inOut";

export default function ScrollColorTransition() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Any section can opt into the theme system by adding
      // data-theme-section="dark" or "light" — no changes needed here to
      // register a new boundary.
      const sections = gsap.utils.toArray<HTMLElement>(
        "[data-theme-section]",
      );
      const navLogoLight = document.querySelector<HTMLElement>(
        "[data-nav-logo-light]",
      );

      // Client logo images (dark PNGs/SVGs) can't be recolored via a CSS
      // variable, so they get a filter-invert exception.
      const logos = gsap.utils.toArray<HTMLElement>(".home-logo");

      const tweenAll = (dark: boolean) => {
        const opts = { duration: DURATION, ease: EASE, overwrite: "auto" as const };

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
            filter: dark
              ? "brightness(0) invert(1)"
              : "brightness(1) invert(0)",
            ...opts,
          });
        }
        if (navLogoLight) {
          gsap.to(navLogoLight, { opacity: dark ? 1 : 0, ...opts });
        }
      };

      sections.forEach((section, i) => {
        const theme = section.dataset.themeSection;
        // Default base theme (before the first marked section) is light.
        const prevTheme = i > 0 ? sections[i - 1].dataset.themeSection : "light";

        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          onEnter: () => tweenAll(theme === "dark"),
          onLeaveBack: () => tweenAll(prevTheme === "dark"),
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
