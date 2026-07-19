import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Shared engine behind OurWork and VideoStoryGrid's "sticky card stack"
// sections: a column of position:sticky cards that scale/dim (and
// optionally blur) into each other as you scroll, a mobile horizontal
// swipe-row fallback, and a synced pair of prev/next buttons.
//
// Everything here operates purely on refs/DOM measurements and never
// touches layout via transform, so it's safe to call regardless of how
// the section itself is revealed on scroll (see the opacity-only fade-in
// this hook also sets up, which is deliberately kept separate from
// SectionAnimate's transform-based reveal for the same reason).
export function useStickyStackScroll({
  itemCount,
  blur = false,
}: {
  itemCount: number;
  blur?: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const wrappersRef = useRef<(HTMLDivElement | null)[]>([]);
  const contentsRef = useRef<(HTMLDivElement | null)[]>([]);
  const mobileScrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  // Opacity-only fade-in, kept deliberately separate from the sticky-stack
  // scroll-scrub effect below and from SectionAnimate (which sections using
  // this hook aren't wrapped in): animating opacity never touches
  // layout/position, so it can't skew the offsetTop/getBoundingClientRect
  // measurements the scroll-scrub and goTo() logic below depend on — a
  // `transform`-based reveal (like SectionAnimate's) could.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const goTo = (index: number) => {
    const current = wrappersRef.current[index];
    if (!current) return;

    // offsetTop is a static layout value, unaffected by position:sticky —
    // unlike getBoundingClientRect(), which reports rect.top as 0 for any
    // wrapper that's currently pinned. It's relative to offsetParent (the
    // nearest positioned ancestor — the section, not necessarily the grid
    // div), so we read that dynamically rather than assuming which one it is.
    const next = wrappersRef.current[index + 1];
    const target = next ?? current;
    const offsetParent = target.offsetParent as HTMLElement | null;
    if (!offsetParent) return;

    const parentTop = offsetParent.getBoundingClientRect().top + window.scrollY;

    const targetY = next
      ? // Land one viewport-height before the card after `next` starts
        // entering.
        parentTop + next.offsetTop - window.innerHeight
      : // Last card: just reach the point where it becomes pinned.
        parentTop + current.offsetTop;

    // Native window.scrollTo({behavior:"smooth"}) gets cut short here: our
    // own scrub tweens mutate filter/transform on every scroll tick, which
    // interrupts Chromium's smooth-scroll animation mid-flight. GSAP's own
    // scrollTo runs on the same ticker driving ScrollTrigger, so it doesn't
    // fight itself.
    gsap.to(window, {
      scrollTo: { y: targetY },
      duration: 1,
      ease: "power2.inOut",
    });
  };

  const advanceMobile = (direction: 1 | -1) => {
    const el = mobileScrollerRef.current;
    const tile = el?.firstElementChild as HTMLElement | null;
    if (!el || !tile) return;
    const step = tile.getBoundingClientRect().width + 16; // tile + gap-4
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const grid = gridRef.current;
    const contents = contentsRef.current.filter(Boolean) as HTMLDivElement[];
    const wrappers = wrappersRef.current.filter(Boolean) as HTMLDivElement[];
    if (!grid || contents.length === 0) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const setCardHeight = () => {
          const tallest = Math.max(...contents.map((c) => c.offsetHeight));
          grid.style.setProperty("--card-height", `${tallest}px`);
          ScrollTrigger.refresh();
        };

        setCardHeight();

        let prevWidth = window.innerWidth;
        const handleResize = () => {
          if (window.innerWidth !== prevWidth) {
            prevWidth = window.innerWidth;
            setCardHeight();
          }
        };
        window.addEventListener("resize", handleResize);

        const blurEase = blur ? gsap.parseEase("power2.in") : null;

        contents.forEach((content, index) => {
          gsap.set(content, { zIndex: 10 + index, transformOrigin: "50% 0%" });
          if (index === wrappers.length - 1) return;

          const nextWrapper = wrappers[index + 1];
          const toScale = 1 - (wrappers.length - 1 - index) * 0.03;
          const toBrightness = 1 - (wrappers.length - 1 - index) * 0.12;
          const toBlur = blur ? (wrappers.length - 1 - index) * 10 : 0;

          gsap.fromTo(
            content,
            { scale: 1, filter: "brightness(1) blur(0px)" },
            {
              scale: toScale,
              filter: `brightness(${toBrightness}) blur(0px)`,
              ease: "none",
              scrollTrigger: {
                trigger: nextWrapper,
                start: "top bottom",
                end: "top top",
                scrub: true,
                onUpdate: (self) => {
                  const p = self.progress;

                  if (blurEase) {
                    // Blur uses its own eased curve — stays sharp early on
                    // and only kicks in as the next card actually arrives
                    // on top. Runs after the tween's own render this
                    // frame, so it wins the last write on `filter`.
                    const blurPx = toBlur * blurEase(p);
                    const brightness = 1 + (toBrightness - 1) * p;
                    content.style.filter = `brightness(${brightness}) blur(${blurPx}px)`;
                  }

                  // Flip which card "owns" the shared nav buttons at the
                  // halfway point of this card's transition into the
                  // next. Guarded against redundant calls: this fires
                  // every scroll frame, but the target index only
                  // actually changes twice per transition.
                  const nextIndex = p > 0.5 ? index + 1 : index;
                  if (activeIndexRef.current !== nextIndex) {
                    activeIndexRef.current = nextIndex;
                    setActiveIndex(nextIndex);
                  }
                },
              },
            },
          );
        });

        return () => {
          window.removeEventListener("resize", handleResize);
        };
      });
    }, grid);

    return () => ctx.revert();
  }, [itemCount, blur]);

  return {
    sectionRef,
    gridRef,
    wrappersRef,
    contentsRef,
    mobileScrollerRef,
    activeIndex,
    goTo,
    advanceMobile,
  };
}
