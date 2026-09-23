"use client";

import { useState } from "react";
import NotchImage from "@/shared/components/NotchImage";
import CtaButton from "@/shared/components/CtaButton";

export type PracticeAreaItem = {
  title: string;
  subtitle: string;
  description: React.ReactNode;
  cta?: string;
  image?: string;
};

export default function PracticeAreasAccordionCustom({
  items,
  onCTAClick,
}: {
  items: PracticeAreaItem[];
  onCTAClick?: (title: string, cta: string) => void;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-6">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <button
            key={item.title}
            type="button"
            onClick={() =>
              setOpenIndex((current) => (current === index ? null : index))
            }
            aria-expanded={isOpen}
            style={{
              borderColor: "color-mix(in srgb, var(--theme-fg) 20%, transparent)",
            }}
            className="theme-fg relative flex w-full flex-col border-b-2 py-6 text-left transition-all duration-300 ease-out sm:py-8 hover:bg-primary/2"
          >
            <div className="flex w-full flex-col sm:flex-row gap-y-3 sm:gap-x-4">
              <span className="shrink-0 text-sm font-semibold text-primary pt-1">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="flex flex-col sm:flex-row flex-1 min-w-0 gap-y-2 sm:gap-x-12">
                {/* Left: accordion title */}
                <div className="shrink-0 w-full sm:w-96">
                  <h3 className="font-display text-xl leading-tight font-bold transition-all duration-700 ease-out sm:text-2xl">
                    {item.title}
                  </h3>
                  {item.image && (
                    <div className={`overflow-hidden transition-all ease-out ${
                      isOpen ? "max-h-[700px] opacity-100 mt-8 duration-1000" : "max-h-0 opacity-0 duration-500"
                    }`}>
                      <NotchImage
                        src={item.image}
                        alt={item.title}
                        variant="tab"
                        sizes="(min-width: 1024px) 28vw, 100vw"
                      />
                    </div>
                  )}
                </div>

                {/* Right: subtitle (+ content when expanded) */}
                <div className="flex-1 min-w-0">
                  <span className="text-primary text-lg font-bold leading-tight sm:text-xl">
                    {item.subtitle}
                  </span>

                  <div className={`overflow-hidden transition-all duration-700 ease-out ${
                    isOpen ? "max-h-[2000px] opacity-100 mt-4" : "max-h-0 opacity-0"
                  }`}>
                    <div
                      style={{ color: "color-mix(in srgb, var(--theme-fg) 70%, transparent)" }}
                      className="text-base leading-7 sm:text-lg sm:leading-8"
                    >
                      {item.description}
                    </div>
                    {item.cta && onCTAClick && (
                      <div
                        className="mt-6 [&_*]:pointer-events-auto"
                        onMouseEnter={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <CtaButton
                          onClick={() => onCTAClick(item.title, item.cta!)}
                        >
                          {item.cta}
                        </CtaButton>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpenIndex((current) => (current === index ? null : index))}
                aria-expanded={isOpen}
                className="absolute right-6 top-6 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white font-light text-2xl transition-all duration-300 ease-out hover:bg-primary/80 hover:scale-110"
              >
                {isOpen ? "−" : "+"}
              </button>
            </div>
          </button>
        );
      })}
    </div>
  );
}
