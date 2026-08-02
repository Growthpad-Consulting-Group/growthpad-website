"use client";

import { ViewTransition } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import Navbar from "@/shared/layouts/Navbar";
import ConditionalFooter from "@/shared/layouts/ConditionalFooter";
import ScrollToTop from "@/shared/layouts/ScrollToTop";
import CookieConsent from "@/shared/components/CookieConsent";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}>
      <Navbar />
      <ViewTransition name="page" share="auto" enter="auto" exit="auto">
        {children}
      </ViewTransition>
      <ConditionalFooter />
      <ScrollToTop />
      <CookieConsent />
    </GoogleReCaptchaProvider>
  );
}
