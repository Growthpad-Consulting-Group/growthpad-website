"use client";

import { useState } from "react";
import { Arrow } from "@/components/ArrowGroup";

export type AccordionItemData = {
  title: string;
  description: string;
};

export default function Accordion({
  items,
  defaultOpenIndex = 0,
}: {
  items: AccordionItemData[];
  defaultOpenIndex?: number | null;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  return (
    <div className="">
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
            className="theme-fg group flex w-full flex-wrap items-center gap-x-4 gap-y-4 border-b-2 py-6 text-left sm:flex-nowrap sm:items-start sm:gap-x-6 sm:gap-y-0 sm:py-8 sm:gap-10"
          >
            <span className="order-1 shrink-0 text-sm font-semibold opacity-40 sm:pt-1">
              {String(index + 1).padStart(2, "0")}
            </span>

            <span
              className={`font-display order-2 pt-0.5 text-xl leading-tight font-bold transition-[flex-grow,translate] duration-700 ease-out sm:min-w-64 sm:pt-1 sm:text-2xl ${
                isOpen ? "" : "group-hover:translate-x-3"
              }`}
              style={{ flexGrow: isOpen ? 0 : 1, flexBasis: "auto" }}
            >
              {item.title}
            </span>

            <span
              className={`order-3 hidden h-14 w-14 shrink-0 items-center justify-center self-center rounded-full transition-all duration-700 ease-out sm:order-4 sm:flex ${
                isOpen
                  ? "bg-primary rotate-90"
                  : "theme-invert-bg group-hover:opacity-80"
              }`}
            >
              <Arrow
                className={`h-4 w-4 ${isOpen ? "text-white" : "theme-invert-fg"}`}
              />
            </span>

            {/* Fixed content width on desktop means the text never
                re-wraps mid-transition — only opacity/clip move, so the
                width reveal and height reveal can't fight each other. */}
            <div
              className="order-4 min-w-0 basis-full overflow-hidden transition-[flex-grow] duration-700 ease-out sm:order-3 sm:basis-0"
              style={{ flexGrow: isOpen ? 1 : 0 }}
            >
              <div
                className="grid transition-[grid-template-rows] duration-700 ease-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p
                    style={{
                      color:
                        "color-mix(in srgb, var(--theme-fg) 70%, transparent)",
                    }}
                    className={`pt-3 text-base leading-7 transition-opacity duration-300 ease-in-out sm:w-2xl sm:pt-0 sm:text-lg sm:leading-8 ${
                      isOpen ? "opacity-100 delay-150" : "opacity-0"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
