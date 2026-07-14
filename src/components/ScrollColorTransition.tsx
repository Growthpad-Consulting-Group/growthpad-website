"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const DARK = "#231812";
const LIGHT = "#ffffff";
const DURATION = 1;
const EASE = "sine.inOut";

export default function ScrollColorTransition() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const about = document.querySelector<HTMLElement>(
        "[data-about-section]",
      );
      const brandsSection = document.querySelector<HTMLElement>(
        "[data-brands-section]",
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

      const toDark = () => tweenAll(true);
      const toLight = () => tweenAll(false);

      if (about) {
        ScrollTrigger.create({
          trigger: about,
          start: "top center",
          onEnter: toDark,
          onLeaveBack: toLight,
        });
      }

      if (brandsSection) {
        ScrollTrigger.create({
          trigger: brandsSection,
          start: "top center",
          onEnter: toLight,
          onLeaveBack: toDark,
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return null;
}
