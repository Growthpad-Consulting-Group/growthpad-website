import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

const links = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
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

        <div className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-secondary/80 hover:text-secondary transition-colors"
            >
              {link.label}
            </Link>
          ))}
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
