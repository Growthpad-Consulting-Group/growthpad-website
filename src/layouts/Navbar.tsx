"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks, type NavLink } from "@/data/nav";
import { Arrow } from "@/components/ArrowGroup";
import CtaButton from "@/components/CtaButton";

function MobileMenu({
  isOpen,
  onNavigate,
  pathname,
}: {
  isOpen: boolean;
  onNavigate: () => void;
  pathname: string;
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
          className="bg-secondary fixed inset-x-0 top-24 bottom-0 z-50 flex flex-col overflow-y-auto md:hidden"
        >
          <nav className="container-fluid flex flex-1 flex-col justify-center gap-1 py-8">
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
            className="container-fluid flex flex-col items-start gap-4 border-t border-white/10 py-6"
          >
            <p className="text-sm text-white/50">
              A Cross-Africa Communication &amp; Technology Firm
            </p>
            <CtaButton
              href="#contact"
              size="sm"
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
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 8);

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
    return () => window.removeEventListener("scroll", onScroll);
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
    <header
      style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
      className={`sticky top-0 z-60 w-full bg-transparent transition-[translate,backdrop-filter,box-shadow] duration-500 ${
        isScrolled
          ? "shadow-lg shadow-secondary/6 backdrop-blur-[10px]"
          : "shadow-none backdrop-blur-none"
      } ${isHidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <nav className="container-fluid flex h-24 items-center justify-between">
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

        <div className="theme-fg hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = link.href === pathname;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? "bg-primary hover:bg-primary/90 inline-flex h-10 items-center rounded-full px-5 text-md font-semibold text-white transition-colors"
                    : "hover:bg-primary -mx-5 inline-flex h-10 items-center rounded-full px-5 text-md font-medium opacity-80 transition-colors hover:text-white hover:opacity-100"
                }
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
          className="theme-fg relative flex h-10 w-10 items-center justify-center rounded-full md:hidden"
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
    />
    </>
  );
}
