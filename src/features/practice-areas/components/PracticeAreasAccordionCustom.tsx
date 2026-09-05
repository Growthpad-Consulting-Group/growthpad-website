"use client";

import { useState } from "react";

export type PracticeAreaItem = {
  title: string;
  subtitle: string;
  description: React.ReactNode;
  cta?: string;
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
            className="theme-fg group flex w-full flex-col border-b-2 py-6 text-left transition-all duration-300 ease-out sm:py-8 hover:bg-primary/2"
          >
            <div className="flex w-full gap-x-4">
              <span className="shrink-0 text-sm font-semibold opacity-40 pt-1">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="flex flex-1 min-w-0 gap-x-4">
                {/* Left: accordion title */}
                <span className="font-display shrink-0 text-xl leading-tight font-bold transition-all duration-700 ease-out sm:text-2xl max-w-xs">
                  {item.title}
                </span>

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
                        onClick={(e) => {
                          e.stopPropagation();
                          onCTAClick(item.title, item.cta!);
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.stopPropagation();
                            onCTAClick(item.title, item.cta!);
                          }
                        }}
                        className="mt-6 inline-block bg-primary text-white rounded-full px-8 py-3 font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        {item.cta} →
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary text-primary font-light text-2xl transition-colors duration-700 ease-out group-hover:opacity-80">
                {isOpen ? "−" : "+"}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
