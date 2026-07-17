import Link from "next/link";
import { Arrow } from "@/components/ArrowGroup";

type CtaButtonProps = {
  children: React.ReactNode;
  className?: string;
  circleClassName?: string;
  size?: "md" | "sm";
  onClick?: () => void;
} & (
  | { href: string; type?: never }
  | { href?: never; type?: "submit" | "button" }
);

const SIZES = {
  md: {
    gap: "gap-4",
    pill: "h-11 px-7 text-base",
    circle: "h-11 w-11",
    icon: "h-4 w-4",
  },
  sm: {
    gap: "gap-3",
    pill: "h-9 px-5 text-sm",
    circle: "h-9 w-9",
    icon: "h-3.5 w-3.5",
  },
};

export default function CtaButton({
  children,
  className = "",
  circleClassName = "theme-invert-bg theme-invert-fg",
  size = "md",
  href,
  type,
  onClick,
}: CtaButtonProps) {
  const sizes = SIZES[size];

  const content = (
    <>
      <span
        className={`bg-primary group-hover:bg-primary/90 inline-flex items-center rounded-full font-semibold whitespace-nowrap text-white transition-colors ${sizes.pill}`}
      >
        {children}
      </span>
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-full transition-opacity group-hover:opacity-90 ${sizes.circle} ${circleClassName}`}
      >
        <Arrow className={sizes.icon} />
      </span>
    </>
  );

  const sharedClassName = `group inline-flex items-center ${sizes.gap} ${className}`;

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={sharedClassName}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type ?? "button"} onClick={onClick} className={sharedClassName}>
      {content}
    </button>
  );
}
