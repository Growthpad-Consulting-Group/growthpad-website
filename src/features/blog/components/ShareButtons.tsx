"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

export default function ShareButtons({
  url,
  title,
  variant = "dark",
}: {
  url: string;
  title: string;
  variant?: "dark" | "light";
}) {
  const [copied, setCopied] = useState(false);
  const isLight = variant === "light";

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const links = [
    {
      label: "Share on LinkedIn",
      icon: "mdi:linkedin",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      label: "Share on X",
      icon: "ri:twitter-x-fill",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      label: "Share on Facebook",
      icon: "mdi:facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
  ];

  const labelClass = isLight
    ? "text-white/50"
    : "text-secondary/40";
  const iconClass = isLight
    ? "text-white/80 hover:bg-white/15 hover:text-white"
    : "text-secondary/60 hover:bg-primary/10 hover:text-primary";

  return (
    <div className="flex items-center gap-2">
      <span className={`text-sm font-bold ${labelClass}`}>
        Share
      </span>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={link.label}
          className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${iconClass}`}
        >
          <Icon icon={link.icon} width={16} height={16} />
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        aria-label="Copy link"
        className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${iconClass}`}
      >
        <Icon icon={copied ? "solar:check-circle-bold" : "solar:link-broken"} width={16} height={16} />
      </button>
    </div>
  );
}
