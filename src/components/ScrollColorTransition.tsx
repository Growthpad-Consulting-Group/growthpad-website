"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const DARK = "#231812";
const LIGHT = "#ffffff";
const DURATION = 0.6;
const EASE = "power2.out";

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
      const heroText = document.querySelector<HTMLElement>(
        "[data-hero-text]",
      );
      const ctaCircle = document.querySelector<HTMLElement>(
        "[data-cta-circle]",
      );
      const navSurface = document.querySelector<HTMLElement>(
        "[data-nav-surface]",
      );
      const navText = document.querySelector<HTMLElement>("[data-nav-text]");
      const navLogoLight = document.querySelector<HTMLElement>(
        "[data-nav-logo-light]",
      );
      const logos = gsap.utils.toArray<HTMLElement>(".home-logo");

      const tweenAll = (dark: boolean) => {
        const opts = { duration: DURATION, ease: EASE, overwrite: "auto" as const };

        gsap.to(document.body, { backgroundColor: dark ? DARK : LIGHT, ...opts });

        if (heroText) {
          gsap.to(heroText, { color: dark ? "#ffffff" : "#231812", ...opts });
        }
        if (ctaCircle) {
          gsap.to(ctaCircle, {
            backgroundColor: dark ? "#ffffff" : "#231812",
            color: dark ? "#231812" : "#ffffff",
            ...opts,
          });
        }
        if (logos.length) {
          gsap.to(logos, {
            filter: dark
              ? "brightness(0) invert(1)"
              : "brightness(1) invert(0)",
            ...opts,
          });
        }
        if (navSurface) {
          gsap.to(navSurface, {
            backgroundColor: dark
              ? "rgba(35,24,18,0.6)"
              : "rgba(255,255,255,0.6)",
            borderBottomColor: dark
              ? "rgba(255,255,255,0.1)"
              : "rgba(255,255,255,0.4)",
            ...opts,
          });
        }
        if (navText) {
          gsap.to(navText, { color: dark ? "#ffffff" : "#231812", ...opts });
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
