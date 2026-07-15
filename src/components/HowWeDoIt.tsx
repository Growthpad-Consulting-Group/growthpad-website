"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArrowGroup from "@/components/ArrowGroup";
import { howWeDoIt } from "@/data/howWeDoIt";

const STICK_TOP_PX = 96;
// Extra scroll distance reserved after each card besides its own height —
// this is what gives CSS `position: sticky` room to actually hold the card
// in place while the next one scrolls up over it. Deliberately CSS sticky
// rather than GSAP's pin:true here: stacking several pin:true/
// pinSpacing:false triggers previously corrupted GSAP's cumulative
// pin-offset math for every OTHER ScrollTrigger on the page (confirmed —
// it threw the unrelated Specialties/HowWeDoIt theme boundary off by over
// 1000px, and the drift got worse, not better, while actually scrolling
// through the pins live). Sticky has no such global side effect since it
// never touches GSAP's pin bookkeeping.
const SLACK_PX = 260;

export default function HowWeDoIt() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const progressNumRef = useRef<HTMLDivElement>(null);
  const wrappersRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const progressFill = progressLineRef.current;
    const progressNum = progressNumRef.current;
    const wrappers = wrappersRef.current.filter(Boolean) as HTMLDivElement[];
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    if (!section || cards.length === 0) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const setSlack = () => {
          wrappers.forEach((wrapper, index) => {
            if (index === wrappers.length - 1) return;
            wrapper.style.height = `${cards[index].offsetHeight + SLACK_PX}px`;
          });
          ScrollTrigger.refresh();
        };

        setSlack();

        let prevWidth = window.innerWidth;
        const handleResize = () => {
          if (window.innerWidth !== prevWidth) {
            prevWidth = window.innerWidth;
            setSlack();
          }
        };
        window.addEventListener("resize", handleResize);

        if (progressFill) {
          gsap.to(progressFill, {
            height: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: `top ${STICK_TOP_PX}px`,
              end: "bottom bottom",
              scrub: true,
            },
          });
        }

        const updateNumber = (index: number) => {
          if (!progressNum) return;
          const num = index + 1;
          progressNum.innerText = num < 10 ? `0${num}` : `${num}`;
        };
        updateNumber(0);

        cards.forEach((card, index) => {
          ScrollTrigger.create({
            trigger: card,
            start: `top ${STICK_TOP_PX + 1}px`,
            end: `top ${STICK_TOP_PX}px`,
            onEnter: () => updateNumber(index),
            onLeaveBack: () => updateNumber(index - 1),
          });

          if (index === cards.length - 1) return;

          const nextWrapper = wrappers[index + 1];
          const toScale = 1 - (cards.length - 1 - index) * 0.05;

          gsap.set(card, { transformOrigin: "center top" });
          gsap.fromTo(
            card,
            { scale: 1, filter: "brightness(1)" },
            {
              scale: toScale,
              filter: "brightness(0.85)",
              ease: "none",
              scrollTrigger: {
                trigger: nextWrapper,
                start: "top bottom",
                end: `top ${STICK_TOP_PX}px`,
                scrub: true,
              },
            },
          );
        });

        return () => {
          window.removeEventListener("resize", handleResize);
        };
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-theme-section="dark"
      className="theme-bg relative w-full py-20 lg:py-28"
    >
      <div className="container-fluid">
        <div className="theme-fg flex items-start justify-between gap-6">
          <div>
            <h2 className="font-display text-4xl font-bold sm:text-5xl">
              How we do it
            </h2>
            <p className="mt-4 max-w-md text-lg leading-8 opacity-60">
              We make bold moves to disrupt the present and build the future
              for your organization.
            </p>
          </div>

          <ArrowGroup count={5} className="hidden sm:flex" />
        </div>

        <div className="mx-auto mt-16 flex max-w-5xl items-start gap-12 lg:gap-24">
          <div
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--theme-fg) 10%, transparent)",
              top: `${STICK_TOP_PX}px`,
              height: `calc(100vh - ${STICK_TOP_PX * 2}px)`,
            }}
            className="relative hidden w-0.5 self-stretch md:sticky md:block"
          >
            <div
              ref={progressLineRef}
              className="bg-primary absolute top-0 left-0 w-full origin-top"
              style={{ height: "0%" }}
            >
              <div
                ref={progressNumRef}
                className="font-display text-primary pointer-events-none absolute bottom-0 left-6 translate-y-1/2 text-4xl font-black select-none"
              >
                01
              </div>
            </div>
          </div>

          <div className="flex-1">
            {howWeDoIt.map((step, index) => (
              <div
                key={step.title}
                ref={(el) => {
                  wrappersRef.current[index] = el;
                }}
                className="relative"
              >
                <div
                  ref={(el) => {
                    cardsRef.current[index] = el;
                  }}
                  style={{ top: `${STICK_TOP_PX}px` }}
                  className={`bg-secondary sticky grid items-center gap-10 rounded-3xl border border-white/10 p-6 shadow-xl will-change-transform md:p-10 lg:grid-cols-2 ${
                    index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div className="notch-image relative aspect-4/3 w-full overflow-hidden rounded-2xl">
                    <span className="bg-primary absolute -top-4 -left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white shadow-lg md:hidden">
                      {index + 1}
                    </span>
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="font-display text-3xl leading-tight font-bold text-white sm:text-4xl">
                      {step.title}
                    </h3>
                    <p className="mt-5 max-w-md text-lg leading-8 text-white/60">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
