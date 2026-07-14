"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollColorTransition() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const about = document.querySelector<HTMLElement>(
        "[data-about-section]",
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

      if (!about) return;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: about,
          start: "top bottom",
          end: "top 60%",
          scrub: true,
        },
      });

      timeline.fromTo(
        document.body,
        { backgroundColor: "#ffffff" },
        { backgroundColor: "#231812", ease: "none" },
        0,
      );

      if (heroText) {
        timeline.fromTo(
          heroText,
          { color: "#231812" },
          { color: "#ffffff", ease: "none" },
          0,
        );
      }

      if (ctaCircle) {
        timeline.fromTo(
          ctaCircle,
          { backgroundColor: "#231812", color: "#ffffff" },
          { backgroundColor: "#ffffff", color: "#231812", ease: "none" },
          0,
        );
      }

      if (logos.length) {
        timeline.fromTo(
          logos,
          { filter: "brightness(1) invert(0)" },
          { filter: "brightness(0) invert(1)", ease: "none" },
          0,
        );
      }

      if (navSurface) {
        timeline.fromTo(
          navSurface,
          {
            backgroundColor: "rgba(255,255,255,0.6)",
            borderBottomColor: "rgba(255,255,255,0.4)",
          },
          {
            backgroundColor: "rgba(35,24,18,0.6)",
            borderBottomColor: "rgba(255,255,255,0.1)",
            ease: "none",
          },
          0,
        );
      }

      if (navText) {
        timeline.fromTo(
          navText,
          { color: "#231812" },
          { color: "#ffffff", ease: "none" },
          0,
        );
      }

      if (navLogoLight) {
        timeline.fromTo(
          navLogoLight,
          { opacity: 0 },
          { opacity: 1, ease: "none" },
          0,
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return null;
}
