"use client";

import { useId } from "react";
import Image from "next/image";

// Original stepped-tab notch — 455×232 viewBox.
const TAB_PATH =
  "M357.206 20C357.206 8.95431 348.252 0 337.206 0H20C8.95431 0 0 8.95432 0 20V193.663C0 204.709 8.95432 213.663 20 213.663H242.008C247.072 213.663 251.176 217.768 251.176 222.832C251.176 227.895 255.281 232 260.345 232H435C446.046 232 455 223.046 455 212V61.457C455 50.4114 446.046 41.457 435 41.457H377.206C366.16 41.457 357.206 32.5027 357.206 21.457V20Z";

// Shape from xxx.svg — 1120×499 viewBox.
const CONCAVE_PATH =
  "M675,0c10.984.746,17.632,11.009,19.579,21.107l.261,20.647c1.112,9.577,4.979,15.333,14.891,17.249l386.455-.007c13.303,2.419,21.664,9.643,23.314,23.18l-.005,205.687.506,2.138v126c-1.421,22.184-22.608,25.65-40.798,23.897-7.517.665-13.984,4.236-15.679,12.111l-.842,24.852c-1.886,10.917-7.8,20.932-19.681,22.141H369c-13.507-1.397-19.057-14.017-20.195-26.182,1.201-9.212-.305-21.558-10.52-24.428l-313.833-.521c-12.201-1.687-24.064-9.644-24.453-22.869V13C.57,5.992,2.266.873,10,0h665Z";

type Variant = "tab" | "concave";

type BaseProps = {
  variant?: Variant;
  showBorder?: boolean;
  className?: string;
};

// Image mode — pass src + alt
type ImageProps = BaseProps & {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  children?: never;
};

// Children mode — pass any content (video, div, etc.)
type ChildrenProps = BaseProps & {
  children: React.ReactNode;
  src?: never;
  alt?: never;
  sizes?: never;
  priority?: never;
};

type Props = ImageProps | ChildrenProps;

/**
 * Clips any content to the site's notch shape.
 *
 * Image mode:   `<NotchImage src="..." alt="..." />`
 * Children mode: `<NotchImage><video .../></NotchImage>`
 *
 * `variant="tab"`     — original stepped notch (455×232, default)
 * `variant="concave"` — xxx.svg shape (1120×499)
 */
export default function NotchImage({
  src,
  alt,
  variant = "tab",
  showBorder = true,
  className = "w-full",
  sizes = "100vw",
  priority = false,
  children,
}: Props) {
  const uid    = useId().replace(/:/g, "");
  const clipId = `notch-clip-${uid}`;

  const isConcave = variant === "concave";
  const path      = isConcave ? CONCAVE_PATH    : TAB_PATH;
  const viewBox   = isConcave ? "0 0 1120 499"  : "0 0 455 232";
  const scaleX    = isConcave ? 1 / 1120        : 1 / 455;
  const scaleY    = isConcave ? 1 / 499         : 1 / 232;

  return (
    <div className={`relative ${className}`}>
      {/* SVG sets aspect ratio and defines the clipPath */}
      <svg
        viewBox={viewBox}
        preserveAspectRatio={isConcave ? "xMidYMid slice" : "xMidYMid meet"}
        className={isConcave ? "h-full w-full" : "h-auto w-full"}
        aria-hidden
      >
        <defs>
          <clipPath
            id={clipId}
            clipPathUnits="objectBoundingBox"
            transform={`scale(${scaleX} ${scaleY})`}
          >
            <path d={path} />
          </clipPath>
        </defs>

        {showBorder && (
          <path
            d={path}
            fill="none"
            stroke="#F05D23"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
            opacity="0.35"
          />
        )}
      </svg>

      {/* Content layer — absolutely fills the bounding box, clipped to shape */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `url(#${clipId})` }}
      >
        {children ?? (
          <Image
            src={src!}
            alt={alt!}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover"
          />
        )}
      </div>
    </div>
  );
}
