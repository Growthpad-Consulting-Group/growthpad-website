"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";

// Staggered fade/rise-in for a scoped set of ".xxx-reveal" elements, on
// mount. Explicit numeric "to" opacity per element (rather than gsap.from's
// implicit current-value capture): each element's own opacity-0 class
// already set it to 0 before this runs, so an implicit capture would read 0
// as the resting target and elements would never fade back in — an element
// can opt into a different rest opacity via a `data-rest-opacity` attribute.
export function useRevealAnimation(
  scopeRef: RefObject<HTMLElement | null>,
  selector: string,
) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray<HTMLElement>(selector);
      els.forEach((el, i) => {
        const restOpacity = Number(el.dataset.restOpacity ?? 1);
        gsap.fromTo(
          el,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: restOpacity,
            duration: 0.9,
            delay: 0.15 + i * 0.12,
            ease: "power3.out",
          },
        );
      });
    }, scopeRef);

    return () => ctx.revert();
  }, [scopeRef, selector]);
}
