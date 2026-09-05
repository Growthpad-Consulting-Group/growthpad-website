"use client";

import ArrowGroup from "@/shared/components/ArrowGroup";
import ContactFormCard from "@/shared/components/ContactFormCard";
import LogoShowcase from "@/shared/components/LogoShowcase";

interface ContactFormProps {
  theme?: "light" | "dark" | "gray" | "cream";
  /**
   * "standard" — equal two-column grid, text left / form right (default).
   * "home"     — 7/3 grid, form left / text right, pill inputs, extra
   *              bottom padding (matches the original Contact.tsx layout).
   * "wide-form" — 3/7 grid, text left / form right (form takes more space).
   */
  variant?: "standard" | "home" | "wide-form";
  heading?: React.ReactNode;
  description?: React.ReactNode;
  /** Show the logo showcase below the form. Default: true for standard, false for home. */
  showLogos?: boolean;
  /** Service options for the dropdown. */
  serviceOptions?: string[];
  /** Pre-select a service option. */
  selectedService?: string;
}

export default function ContactForm({
  theme = "light",
  variant = "standard",
  heading,
  description,
  showLogos,
  serviceOptions,
  selectedService,
}: ContactFormProps) {
  const isHome = variant === "home";
  const isWideForm = variant === "wide-form";

  // Resolve defaults per variant so each page gets sensible copy without
  // having to repeat it at every call site.
  const resolvedHeading = heading ?? (
    isHome ? (
      <>
        Let&apos;s Design,<br />Build,<br />Launch
      </>
    ) : (
      <>It&apos;s time to build something exciting, let&apos;s get you started</>
    )
  );

  const resolvedDescription = description ?? (
    isHome ? (
      <>
        Talk directly to our<br />Director of Business
      </>
    ) : (
      <>
        Send us a message we&apos;d love <br />to hear from you.
      </>
    )
  );

  const resolvedShowLogos = showLogos ?? !isHome;

  const form = (
    <ContactFormCard
      inputShape={isHome ? "pill" : "rounded"}
      bordered={!isHome}
      serviceOptions={serviceOptions}
      selectedService={selectedService}
    />
  );

  const textBlock = (
    <div className={`flex flex-col gap-6 ${isHome ? "" : ""}`}>
      <h2
        className={`font-display theme-fg font-light leading-[1.05] ${
          isHome
            ? "text-6xl sm:text-7xl"
            : "text-4xl leading-[1.1] sm:text-5xl lg:text-6xl"
        }`}
      >
        {resolvedHeading}
      </h2>

      <p
        className={
          isHome
            ? "text-primary text-lg leading-8 font-medium"
            : "text-secondary/90 text-2xl leading-8"
        }
      >
        {resolvedDescription}
      </p>
    </div>
  );

  return (
    <section
      id="contact"
      data-theme-section={theme}
      className={`theme-bg relative w-full overflow-hidden py-20 ${
        isHome ? "lg:pt-28 lg:pb-60" : "lg:py-28"
      }`}
    >
      <ArrowGroup
        count={4}
        className="absolute top-8 right-6 lg:top-10 lg:right-10"
      />

      <div
        className={`container-fluid grid items-center gap-12 lg:gap-16 ${
          isHome ? "lg:grid-cols-[7fr_3fr]" : isWideForm ? "lg:grid-cols-[3fr_7fr]" : "lg:grid-cols-2"
        }`}
      >
        {/* Text always first in DOM (so mobile reads text → form).
            On desktop, home variant flips to form-left / text-right via order utilities. */}
        <div className={isHome ? "lg:order-last" : ""}>{textBlock}</div>
        <div className={isHome ? "lg:order-first" : ""}>{form}</div>
      </div>

      {resolvedShowLogos && (
        <div className="container-fluid mt-20 flex flex-col items-center gap-10 lg:mt-28">
          <h3 className="font-display text-secondary text-center text-2xl font-bold sm:text-3xl">
            Growthpad is trusted by industry leaders
          </h3>
          <LogoShowcase />
        </div>
      )}

      <ArrowGroup
        count={4}
        className="absolute bottom-8 left-6 lg:bottom-10 lg:left-10"
      />
    </section>
  );
}

