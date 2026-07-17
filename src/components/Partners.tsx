"use client";

import Script from "next/script";
import ArrowGroup from "@/components/ArrowGroup";

export default function Partners() {
  return (
    <section
      data-theme-section="dark"
      className="theme-bg relative flex w-full flex-col justify-center overflow-hidden py-16 lg:min-h-[calc(100svh-6rem)] lg:py-24"
    >
      <div className="container-fluid relative">
        <div className="flex items-start justify-between gap-6">
          <h2 className="font-display theme-fg text-4xl leading-tight font-bold sm:text-5xl">
            What Our Partners Say
            <br />
            Impact That Speaks for Itself
          </h2>

          <ArrowGroup count={5} className="hidden sm:flex" />
        </div>

        <div className="mt-16 overflow-hidden rounded-3xl">
          <div
            className="clutch-widget"
            data-url="https://widget.clutch.co"
            data-widget-type="12"
            data-height="375"
            data-nofollow="true"
            data-expandifr="true"
            data-scale="100"
            data-reviews="2159466,2055059,1971872,1818521,1792207,1772134,1382066,1388859"
            data-clutchcompany-id="1367697"
          />
        </div>
      </div>

      <ArrowGroup
        count={4}
        className="absolute bottom-8 left-6 lg:bottom-10 lg:left-10"
      />

      <Script
        src="https://widget.clutch.co/static/js/widget.js"
        strategy="afterInteractive"
      />
    </section>
  );
}
