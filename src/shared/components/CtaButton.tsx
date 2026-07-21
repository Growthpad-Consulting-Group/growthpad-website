import Link from "next/link";
import { Arrow } from "@/shared/components/ArrowGroup";

type CtaButtonProps = {
  children: React.ReactNode;
  className?: string;
  circleClassName?: string;
  size?: "md" | "sm";
  onClick?: () => void;
  href?: string;
  type?: "submit" | "button";
  fullWidth?: boolean;
  disabled?: boolean;
};

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
  fullWidth = false,
  disabled = false,
}: CtaButtonProps) {
  const sizes = SIZES[size];

  const content = (
    <>
      <span
        className={`bg-primary group-hover:bg-primary/90 inline-flex items-center rounded-full font-semibold whitespace-nowrap text-white shadow-transparent transition-all duration-700 ease-out group-hover:shadow-xl group-hover:shadow-primary/30 ${sizes.pill} ${
          fullWidth ? "flex-1 justify-center" : ""
        }`}
      >
        {children}
      </span>
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-full transition-all duration-700 ease-out group-hover:rotate-45 ${sizes.circle} ${circleClassName}`}
      >
        <Arrow className={sizes.icon} />
      </span>
    </>
  );

  const sharedClassName = `group items-center transition-all duration-700 ease-out hover:-translate-y-1 ${sizes.gap} ${fullWidth ? "flex w-full" : "inline-flex"} ${className} ${
    disabled ? "opacity-50 pointer-events-none" : ""
  }`;

  if (href) {
    const isExternal = /^https?:\/\//.test(href);

    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
          className={sharedClassName}
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={href} onClick={onClick} className={sharedClassName}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type ?? "button"}
      onClick={onClick}
      disabled={disabled}
      className={sharedClassName}
    >
      {content}
    </button>
  );
}
