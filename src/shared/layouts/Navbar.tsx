"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks, type NavLink } from "@/shared/layouts/nav";
import { Arrow } from "@/shared/components/ArrowGroup";
import CtaButton from "@/shared/components/CtaButton";

function MobileMenu({
  isOpen,
  onNavigate,
  pathname,
  topOffset,
}: {
  isOpen: boolean;
  onNavigate: () => void;
  pathname: string;
  topOffset: number;
}) {
  // SSR has no document to portal into; the client render (post-hydration)
  // picks this up immediately after.
  if (typeof document === "undefined") return null;

  // Portalled to document.body: the header this menu toggles from has its
  // own transform (translate-y) for the hide-on-scroll behavior, and a
  // transform on an ancestor turns position:fixed descendants into
  // behaving like position:absolute relative to *that* ancestor instead
  // of the viewport — which silently collapsed this panel to nothing.
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ top: topOffset + 8 }}
          className="fixed inset-x-6 bottom-0 z-50 isolate flex flex-col overflow-y-auto rounded-t-4xl xl:hidden"
        >
          {/* Same "liquid glass" recipe as the header (distorted+blurred
              backdrop, tint, specular ring), so the dropdown reads as an
              extension of the pill rather than a different material —
              just tinted dark instead of white, since this panel's nav
              text is hardcoded white and needs a dark backdrop for
              contrast regardless of what's scrolled behind it. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] backdrop-blur-[3px]"
            style={{ filter: "url(#glass-distortion)" }}
          />
          <div
            aria-hidden
            className="bg-secondary/70 pointer-events-none absolute inset-0 rounded-[inherit]"
          />
          <div
            aria-hidden
            className="ring-1 ring-white/10 shadow-lg shadow-black/20 pointer-events-none absolute inset-0 rounded-[inherit]"
          />

          <nav className="container-fluid relative flex flex-1 flex-col justify-center gap-1 py-8">
            {navLinks.map((link: NavLink, index: number) => {
              const isActive = link.href === pathname;

              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 + index * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="border-b border-white/10 py-4 first:pt-0"
                >
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    className="group flex items-center justify-between gap-4"
                  >
                    <span
                      className={`font-display text-3xl font-bold transition-colors sm:text-4xl ${
                        isActive
                          ? "text-primary"
                          : "text-white group-hover:text-primary"
                      }`}
                    >
                      {link.label}
                    </span>
                    <Arrow
                      className={`h-5 w-5 shrink-0 -rotate-45 text-white/40 transition-all group-hover:rotate-0 group-hover:text-primary ${
                        isActive ? "rotate-0 text-primary" : ""
                      }`}
                    />
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.1 + navLinks.length * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="container-fluid relative flex flex-col items-start gap-4 border-t border-white/10 py-6"
          >
            <p className="text-sm text-white/50">
              A Cross-Africa Communication &amp; Technology Firm
            </p>
            <CtaButton
              href="/contact"
              size="sm"
              fullWidth
              onClick={onNavigate}
              circleClassName="bg-primary text-white"
            >
              Get in touch
            </CtaButton>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [menuTop, setMenuTop] = useState(96);
  const navLinksRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [hoverRect, setHoverRect] = useState<{ left: number; width: number } | null>(null);
  // Kept around after the mouse leaves so the highlight has a position to
  // fade out from — without it, dropping `left`/`width` from `animate`
  // lets them snap to the pill's un-animated base (left-0), so it looked
  // like it was darting to the left edge before fading, instead of just
  // fading out in place.
  const [lastHoverRect, setLastHoverRect] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    let lastY = window.scrollY;

    const syncMenuTop = () => {
      const bottom = headerRef.current?.getBoundingClientRect().bottom;
      if (bottom) setMenuTop(bottom);
    };

    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 8);
      // Header height/margins shift between the full-width and pill
      // states, so the mobile menu's own top offset (which measures the
      // header, not a hardcoded value) has to stay in sync too.
      syncMenuTop();

      if (isOpen) {
        lastY = y;
        return;
      }

      const delta = y - lastY;
      if (y <= 8) {
        setIsHidden(false);
      } else if (delta > 4) {
        setIsHidden(true);
      } else if (delta < -4) {
        setIsHidden(false);
      }

      lastY = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", syncMenuTop);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", syncMenuTop);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
    {/* Liquid-glass refraction filter for the header background layer
        below. Hidden via zero size + overflow (not display:none —
        some browsers won't apply a filter referenced from a
        display:none SVG). Tuned subtle (scale 18, not the 70-100 a
        demo over a busy photo background would use) since this sits
        behind readable nav text, not a decorative image. */}
    <svg width="0" height="0" style={{ position: "absolute", overflow: "hidden" }}>
      <defs>
        <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.012" numOctaves="2" seed="8" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
          <feDisplacementMap in="SourceGraphic" in2="blurred" scale="18" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>

    <header
      ref={headerRef}
      style={{
        transform: isHidden ? "translateY(calc(-100% - 2rem))" : "translateY(0)",
        transition:
          "top 500ms cubic-bezier(0.22, 1, 0.36, 1), margin 500ms cubic-bezier(0.22, 1, 0.36, 1), border-radius 500ms cubic-bezier(0.22, 1, 0.36, 1), transform 550ms cubic-bezier(0.65, 0, 0.35, 1)",
      }}
      className={`sticky z-60 isolate overflow-hidden ${
        isScrolled
          ? "top-4 mx-6 rounded-4xl lg:mx-24"
          : "top-0 mx-0 w-full rounded-none"
      }`}
    >
      {/* "Liquid glass": a distorted+blurred backdrop layer, a faint
          white tint, and an inset specular highlight — stacked in that
          order behind the nav content so the distortion never touches
          the (crisp, on top) links/logo. Safari's SVG-filter +
          backdrop-filter combination is inconsistent, so this degrades
          to a plain frosted blur there rather than breaking. */}
      <div
        aria-hidden
        style={{
          filter: isScrolled ? "url(#glass-distortion)" : undefined,
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        className={`pointer-events-none absolute inset-0 rounded-[inherit] backdrop-blur-[3px] transition-opacity duration-500 ${
          isScrolled ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        aria-hidden
        style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        className={`pointer-events-none absolute inset-0 rounded-[inherit] bg-white/20 transition-opacity duration-500 ${
          isScrolled ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        aria-hidden
        style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        className={`pointer-events-none absolute inset-0 rounded-[inherit] shadow-lg shadow-secondary/6 ring-1 ring-white/25 ring-inset transition-opacity duration-500 ${
          isScrolled ? "opacity-100" : "opacity-0"
        }`}
      />

      <nav
        style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        className={`relative mx-auto flex w-full items-center justify-between transition-[height,padding] duration-500 ${
          // container-fluid's padding is sized for full-width sections;
          // the pill is already inset by its own margin, so it only needs
          // a small fixed padding to keep the logo close to its edge.
          isScrolled ? "h-20 px-6 lg:px-8" : "h-24 px-4 sm:px-[5vw] lg:px-32"
        }`}
      >
        <Link href="/" className="relative block h-15.25 w-40 shrink-0">
          <Image
            src="/assets/images/gcg_logo_primary.svg"
            alt="Growthpad"
            fill
            priority
          />
          <Image
            data-nav-logo-light
            src="/assets/images/gcg_logo_white.svg"
            alt=""
            fill
            className="opacity-0"
          />
        </Link>

        <div
          ref={navLinksRef}
          onMouseLeave={() => setHoverRect(null)}
          className="theme-fg relative ml-auto hidden items-center gap-1 lg:flex"
        >
          {/* One persistent highlight, measured off whichever link is
              hovered and animated via `animate` (not layoutId): a
              layoutId'd element that mounts fresh per-link unmounts
              whenever the pointer briefly has no target between two
              links (onMouseLeave firing before the next onMouseEnter is
              common), which kills the FLIP interpolation and makes it
              fade in at the new spot instead of sliding. This element
              never unmounts, so its position always animates smoothly. */}
          <motion.span
            animate={{
              opacity: hoverRect ? 1 : 0,
              left: (hoverRect ?? lastHoverRect)?.left,
              width: (hoverRect ?? lastHoverRect)?.width,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 36, mass: 0.6 }}
            className="bg-primary/80 ring-1 ring-primary/40 ring-inset shadow-lg shadow-black/10 pointer-events-none absolute top-0 left-0 z-0 h-10 w-10 rounded-full backdrop-blur-md"
          />

          {navLinks.map((link) => {
            const isActive = link.href === pathname;

            return (
              <Link
                key={link.href}
                href={link.href}
                ref={(el) => {
                  linkRefs.current[link.href] = el;
                }}
                onMouseEnter={() => {
                  const el = linkRefs.current[link.href];
                  const container = navLinksRef.current;
                  if (!el || !container) return;
                  const elRect = el.getBoundingClientRect();
                  const containerRect = container.getBoundingClientRect();
                  const rect = {
                    left: elRect.left - containerRect.left,
                    width: elRect.width,
                  };
                  setHoverRect(rect);
                  setLastHoverRect(rect);
                }}
                className={`relative inline-flex h-10 items-center rounded-full px-5 text-md whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-primary font-semibold text-white"
                    : "font-medium opacity-80 hover:text-white hover:opacity-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          className="theme-fg relative flex h-10 w-10 items-center justify-center rounded-full xl:hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isOpen ? "close" : "open"}
              initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Icon
                icon={isOpen ? "ci:close-big" : "ci:menu-alt-02"}
                width={32}
                height={32}
              />
            </motion.span>
          </AnimatePresence>
        </button>
      </nav>
    </header>

    <MobileMenu
      isOpen={isOpen}
      onNavigate={() => setIsOpen(false)}
      pathname={pathname ?? "/"}
      topOffset={menuTop}
    />
    </>
  );
}
