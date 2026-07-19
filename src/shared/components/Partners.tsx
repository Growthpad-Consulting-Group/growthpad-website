"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import ArrowGroup from "@/shared/components/ArrowGroup";

const CLUTCH_PROFILE_URL =
  "https://clutch.co/profile/growthpad-consulting-group?utm_source=widget&utm_medium=3&utm_campaign=widget&utm_content=stars&utm_term=growthpad.co.ke";

export default function Partners({
  showHeading = true,
  theme = "dark",
}: {
  showHeading?: boolean;
  theme?: "dark" | "light" | "gray" | "cream";
}) {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [widgetFailed, setWidgetFailed] = useState(false);

  useEffect(() => {
    // Give the widget script time to inject its iframe — it fetches its
    // content from Clutch's CDN, which can fail (ad blockers, Cloudflare
    // bot challenges, network issues). If nothing shows up, fall back to a
    // static screenshot linking to the profile instead of an empty box.
    const timeout = setTimeout(() => {
      if (!widgetRef.current?.querySelector("iframe")) {
        setWidgetFailed(true);
      }
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <section
      data-theme-section={theme}
      className="theme-bg relative flex w-full flex-col justify-center overflow-hidden py-16 lg:min-h-[calc(80svh-6rem)] lg:py-0"
    >
      <div className="container-fluid relative">
        {showHeading && (
          <div className="flex items-start justify-between gap-6">
            <h2 className="font-display theme-fg text-4xl leading-tight font-bold sm:text-5xl">
              What Our Partners Say
              <br />
              Impact That Speaks for Itself
            </h2>

            <ArrowGroup count={5} className="hidden sm:flex" />
          </div>
        )}

        <div className={`overflow-hidden shadow-2xl shadow-secondary/10 transition-all duration-600 ease-out hover:shadow-2xl hover:shadow-primary/10 rounded-2xl ${showHeading ? "mt-16" : ""}`}>
          {widgetFailed ? (
            <a
              href={CLUTCH_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Image
                src="/assets/images/clutch.png"
                alt="Growthpad Consulting Group reviews on Clutch"
                width={2010}
                height={610}
                sizes="100vw"
                className="h-auto w-full"
              />
            </a>
          ) : (
            <div
              ref={widgetRef}
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
          )}
        </div>
      </div>

      <ArrowGroup
        count={4}
        className="absolute bottom-8 left-6 lg:bottom-10 lg:left-10"
      />

      <Script
        src="https://widget.clutch.co/static/js/widget.js"
        strategy="afterInteractive"
        onError={() => setWidgetFailed(true)}
        className="rounded-full"
      />
    </section>
  );
}
