"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type AnimationVariant = "fade-up" | "fade-left" | "fade-right" | "scale-up";

interface SectionAnimateProps {
  children: ReactNode;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
}

export default function SectionAnimate({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 0.8,
  threshold = 0.1,
  className = "",
}: SectionAnimateProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const element = ref.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      // Set initial state based on variant
      let initialState: gsap.TweenVars = { opacity: 0 };
      let animateState: gsap.TweenVars = { opacity: 1 };
      
      switch (variant) {
        case "fade-up":
          initialState.y = 60;
          animateState.y = 0;
          break;
        case "fade-left":
          initialState.x = 60;
          animateState.x = 0;
          break;
        case "fade-right":
          initialState.x = -60;
          animateState.x = 0;
          break;
        case "scale-up":
          initialState.scale = 0.9;
          animateState.scale = 1;
          break;
      }

      gsap.set(element, initialState);

      // Animate in when scrolled into view
      gsap.to(element, {
        ...animateState,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: `top ${80 + threshold * 100}%`,
          toggleActions: "play none none reverse",
        },
      });
    }, element);

    return () => ctx.revert();
  }, [variant, delay, duration, threshold]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
