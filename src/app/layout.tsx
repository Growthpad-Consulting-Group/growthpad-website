import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
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
        {/* Google Analytics Tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JC9NBLNQFS"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JC9NBLNQFS');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
