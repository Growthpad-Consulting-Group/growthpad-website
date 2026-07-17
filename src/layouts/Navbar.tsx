"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks } from "@/data/nav";

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

  return (
    <header
      style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
      className={`sticky top-0 z-60 w-full bg-transparent transition-[translate,backdrop-filter,box-shadow] duration-500 ${
        isScrolled
          ? "shadow-[0_1px_20px_rgba(35,24,18,0.06)] backdrop-blur-[10px]"
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/40 bg-white/70 shadow-[0_1px_20px_rgba(35,24,18,0.06)] backdrop-blur-xl md:hidden"
          >
            <div className="container-fluid flex flex-col gap-2 py-4">
              {navLinks.map((link, index) => {
                const isActive = link.href === pathname;

                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: index * 0.04,
                      ease: "easeOut",
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={
                        isActive
                          ? "bg-primary inline-flex h-11 items-center rounded-full px-5 text-md font-semibold text-white"
                          : "text-secondary/80 inline-flex h-11 items-center rounded-full px-5 text-md font-medium"
                      }
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
