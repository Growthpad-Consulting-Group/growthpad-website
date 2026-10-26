import type { Metadata } from "next";
import Script from "next/script";
import ProjectInquiry from "@/features/contact/components/ProjectInquiry";
import ImpactSection from "@/features/contact/components/ImpactSection";
import FaqSection from "@/features/contact/components/FaqSection";
import ScrollColorTransition from "@/shared/components/ScrollColorTransition";
import SectionAnimate from "@/shared/components/SectionAnimate";
import PartnersHero from "@/features/for-partners/components/PartnersHero";

export const metadata: Metadata = {
  title: "Contact Growthpad: Let's Connect And Explore How We Can Work Together | Contact Us",
  description: "Have questions or ready to explore how Growthpad Digital Consulting can help your business grow? Get in touch with us today. We're here to assist you and discuss your digital needs | Contact Us",
  keywords: [
    "contact Growthpad",
    "digital consulting inquiry Kenya",
    "hire digital agency Nairobi",
    "Growthpad contact",
    "digital marketing consultation",
    "business growth consultation",
    "get in touch Growthpad",
  ],
  alternates: {
    canonical: "https://growthpad.africa/contact",
  },
  openGraph: {
    title: "Contact Growthpad: Let's Connect And Explore How We Can Work Together | Contact Us",
    description: "Have questions or ready to explore how Growthpad Digital Consulting can help your business grow? Get in touch with us today. We're here to assist you and discuss your digital needs | Contact Us",
    url: "https://growthpad.africa/contact",
    images: [
      {
        url: "/assets/images/about.png",
        alt: "Get in Touch with Growthpad, Contact Us",
      },
    ],
  },
  twitter: {
    title: "Contact Growthpad: Let's Connect And Explore How We Can Work Together | Contact Us",
    description: "Have questions or ready to explore how Growthpad Digital Consulting can help your business grow? Get in touch with us today. We're here to assist you and discuss your digital needs | Contact Us",
    images: ["/assets/images/about.png"],
  },
};

export default function ContactPage() {
  return (
    <div className="flex flex-1 flex-col">
      {/* OpenAI tracking pixel */}
      <Script id="oaiq-pixel" strategy="afterInteractive">
        {`
          !function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=1;j.src=u;var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f)}(window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");
          oaiq("init",{pixelId:"Fj9eviXx7BsCDAF6hBkEQ9",debug:true});
        `}
      </Script>
      <ScrollColorTransition />
      <PartnersHero />
      <ProjectInquiry />
      <SectionAnimate variant="fade-up">
        <ImpactSection />
      </SectionAnimate>
      <SectionAnimate variant="fade-up">
        <FaqSection />
      </SectionAnimate>
    </div>
  );
}
