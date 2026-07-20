"use client";

import { usePathname } from "next/navigation";
import Footer from "@/shared/layouts/Footer";

// Job detail pages have their own sticky two-column layout that doesn't fit
// underneath the site-wide footer, so it's hidden there.
const HIDDEN_ON = [/^\/careers\/[^/]+$/];

export default function ConditionalFooter() {
  const pathname = usePathname();

  if (HIDDEN_ON.some((pattern) => pattern.test(pathname))) return null;

  return <Footer />;
}
