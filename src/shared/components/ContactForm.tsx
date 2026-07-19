"use client";

import ArrowGroup from "@/shared/components/ArrowGroup";
import CtaButton from "@/shared/components/CtaButton";
import LogoShowcase from "@/shared/components/LogoShowcase";

interface ContactFormProps {
  theme?: "light" | "dark" | "gray" | "cream";
  /**
   * "standard" — equal two-column grid, text left / form right (default).
   * "home"     — 7/3 grid, form left / text right, pill inputs, extra
   *              bottom padding (matches the original Contact.tsx layout).
   */
  variant?: "standard" | "home";
  heading?: React.ReactNode;
  description?: React.ReactNode;
  /** Show the logo showcase below the form. Default: true for standard, false for home. */
  showLogos?: boolean;
}

export default function ContactForm({
  theme = "light",
  variant = "standard",
  heading,
  description,
  showLogos,
}: ContactFormProps) {
  const isHome = variant === "home";

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: wire this up to an actual submission endpoint (API route,
    // email service, CRM, etc.) once one is decided on.
  };

  // Input shape differs between variants
  const inputBase = `placeholder:text-secondary/50 text-secondary w-full bg-white px-6 py-4 text-base outline-none ${
    isHome ? "rounded-full" : "rounded-2xl"
  }`;

  const form = (
    <form
      onSubmit={handleSubmit}
      className={`bg-secondary flex flex-col gap-4 rounded-2xl p-8 sm:p-10 ${
        isHome ? "" : "shadow-xl shadow-black/5"
      }`}
    >
      <input
        type="text"
        name="name"
        placeholder="Full name"
        required
        className={inputBase}
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="company"
          placeholder="Company"
          className={inputBase}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className={inputBase}
        />
      </div>

      <textarea
        name="message"
        placeholder="Message"
        rows={5}
        className="placeholder:text-secondary/50 text-secondary w-full resize-none rounded-2xl bg-white px-6 py-4 text-base outline-none"
      />

      <div className="mt-2 flex justify-end">
        <CtaButton type="submit" circleClassName="bg-primary text-white">
          Submit
        </CtaButton>
      </div>
    </form>
  );

  const textBlock = (
    <div className={`flex flex-col gap-6 ${isHome ? "" : ""}`}>
      <h2
        className={`font-display theme-fg font-bold leading-[1.05] ${
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
          isHome ? "lg:grid-cols-[7fr_3fr]" : "lg:grid-cols-2"
        }`}
      >
        {/* Home variant: form left, text right. Standard: text left, form right. */}
        <div className={isHome ? "order-1 lg:order-1" : "order-2 lg:order-1"}>
          {isHome ? form : textBlock}
        </div>
        <div className={isHome ? "order-2 lg:order-2" : "order-1 lg:order-2"}>
          {isHome ? textBlock : form}
        </div>
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

