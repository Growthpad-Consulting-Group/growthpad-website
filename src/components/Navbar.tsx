"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { navLinks } from "@/data/nav";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="w-full">
      <nav className="container-fluid flex h-24 items-center justify-between">
        <Link href="/" className="shrink-0">
          <Image
            src="/assets/images/gcg_logo_primary.svg"
            alt="Growthpad"
            width={160}
            height={61}
            priority
          />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = link.href === pathname;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive
                    ? "bg-primary hover:bg-primary/90 inline-flex h-10 items-center rounded-full px-5 text-md font-semibold text-white transition-colors"
                    : "text-secondary/80 hover:text-white hover:bg-primary -mx-5 inline-flex h-10 items-center rounded-full px-5 text-md font-medium transition-colors"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-secondary/15 text-secondary md:hidden"
        >
          <Icon icon="mdi:menu" width={20} height={20} />
        </button>
      </nav>
    </header>
  );
}
