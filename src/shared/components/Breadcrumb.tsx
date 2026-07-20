import Link from "next/link";
import { Icon } from "@iconify/react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export default function Breadcrumb({
  items,
  showBackArrow = true,
  variant = "light",
  className = "",
}: {
  items: BreadcrumbItem[];
  showBackArrow?: boolean;
  variant?: "light" | "dark";
  className?: string;
}) {
  const mutedClass = variant === "light" ? "text-white/80" : "text-secondary/60";
  const currentClass = variant === "light" ? "text-white" : "text-secondary";
  const separatorClass = variant === "light" ? "text-white/40" : "text-secondary/30";
  const hoverClass = variant === "light" ? "hover:text-white" : "hover:text-primary";

  return (
    <nav className={`inline-flex flex-wrap items-center gap-2 text-md ${className}`}>
      {showBackArrow && items[0]?.href && (
        <Link
          href={items[0].href}
          className={`inline-flex items-center transition-colors ${mutedClass} ${hoverClass}`}
        >
          <Icon icon="solar:alt-arrow-left-broken" className="h-5 w-5" />
        </Link>
      )}
      {items.map((item, i) => (
        <span key={i} className="inline-flex items-center gap-2">
          {item.href ? (
            <Link href={item.href} className={`transition-colors ${mutedClass} ${hoverClass}`}>
              {item.label}
            </Link>
          ) : (
            <span className={currentClass}>{item.label}</span>
          )}
          {i < items.length - 1 && <span className={separatorClass}>/</span>}
        </span>
      ))}
    </nav>
  );
}
