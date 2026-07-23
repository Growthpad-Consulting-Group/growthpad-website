import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import CookieConsent from "@/shared/components/CookieConsent";
import "@/styles/globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const cloverDisplay = localFont({
  variable: "--font-clover-display",
  src: [
    {
      path: "../../public/assets/fonts/CloverDisplay-SemiBold.woff2",
      weight: "600",
    },
    {
      path: "../../public/assets/fonts/CloverDisplay-Bold.woff2",
      weight: "700",
    },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://growthpad.co.ke"),
  title: {
    template: "%s",
    default: "Growthpad Consulting Group | Technology, Digital Media And Communication Firm",
  },
  description: "Elevate your business with Growthpad, a leading digital consulting firm in Nairobi. Our innovative solutions and bold strategies drive success through digital technology.",
  openGraph: {
    title: "Growthpad Consulting Group | Technology, Digital Media And Communication Firm",
    description: "Elevate your business with Growthpad, a leading digital consulting firm in Nairobi. Our innovative solutions and bold strategies drive success through digital technology.",
    url: "https://growthpad.co.ke/",
    siteName: "Growthpad Consulting Group // Impact That Matters",
    images: [
      {
        url: "/assets/images/seo/opengraph.png",
        width: 1920,
        height: 630,
        alt: "digital",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Growthpad Consulting Group | Technology, Digital Media And Communication Firm",
    description: "Elevate your business with Growthpad, a leading digital consulting firm in Nairobi. Our innovative solutions and bold strategies drive success through digital technology.",
    images: ["/assets/images/seo/opengraph.png"],
    site: "@growthpadEA",
    creator: "@growthpadEA",
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/favicon.png", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${cloverDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Consent Mode v2: default deny until user accepts */}
        <Script id="gtag-consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              analytics_storage: 'denied',
              ad_storage: 'denied',
              wait_for_update: 500,
            });
          `}
        </Script>

        {/* Google Tag Manager */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PW5FM42');
          `}
        </Script>

        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PW5FM42"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}>
          {children}
        </GoogleReCaptchaProvider>
        <CookieConsent />
      </body>
    </html>
  );
}
