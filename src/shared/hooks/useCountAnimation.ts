"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useCountAnimation(
  ref: RefObject<HTMLElement | null>,
  endValue: number,
  duration: number = 2.5,
) {
  const counterRef = useRef({ value: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      gsap.to(counterRef.current, {
        value: endValue,
        duration,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          once: true,
        },
        onUpdate: () => {
          element.textContent = Math.floor(counterRef.current.value).toString() + "+";
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [ref, endValue, duration]);
}
