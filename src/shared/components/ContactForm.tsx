"use client";

import ArrowGroup from "@/components/ArrowGroup";
import CtaButton from "@/components/CtaButton";
import LogoShowcase from "@/components/LogoShowcase";

export default function ContactCream() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: wire this up to an actual submission endpoint (API route,
    // email service, CRM, etc.) once one is decided on.
  };

  return (
    <section
      id="contact"
      data-theme-section="cream"
      className="theme-bg relative w-full overflow-hidden py-20 lg:py-28"
    >
      <ArrowGroup
        count={4}
        className="absolute top-8 right-6 lg:top-10 lg:right-10"
      />

      <div className="container-fluid grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-6">
          <h2 className="font-display theme-fg text-4xl leading-[1.1] font-bold sm:text-5xl lg:text-6xl">
            It&apos;s time to build something exciting, let&apos;s get you
            started
          </h2>

          <p className="text-secondary/70 text-lg leading-8">
            Send us a message we&apos;d love to hear from you.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-secondary flex flex-col gap-4 rounded-2xl p-8 shadow-xl shadow-black/5 sm:p-10"
        >
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            className="placeholder:text-secondary/50 text-secondary w-full rounded-full bg-white px-6 py-4 text-base outline-none"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="company"
              placeholder="Company"
              className="placeholder:text-secondary/50 text-secondary w-full rounded-full bg-white px-6 py-4 text-base outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="placeholder:text-secondary/50 text-secondary w-full rounded-full bg-white px-6 py-4 text-base outline-none"
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
      </div>

      <div className="container-fluid mt-20 flex flex-col items-center gap-10 lg:mt-28">
        <h3 className="font-display text-secondary text-center text-2xl font-bold sm:text-3xl">
          Growthpad is trusted by industry leaders
        </h3>

        <LogoShowcase />
      </div>

      <ArrowGroup
        count={4}
        className="absolute bottom-8 left-6 lg:bottom-10 lg:left-10"
      />
    </section>
  );
}
