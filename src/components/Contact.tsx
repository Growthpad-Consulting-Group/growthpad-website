"use client";

import ArrowGroup from "@/components/ArrowGroup";
import CtaButton from "@/components/CtaButton";

export default function Contact() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: wire this up to an actual submission endpoint (API route,
    // email service, CRM, etc.) once one is decided on.
  };

  return (
    <section
      id="contact"
      data-theme-section="light"
      className="theme-bg relative w-full overflow-hidden py-20 lg:py-28"
    >
      <ArrowGroup
        count={4}
        className="absolute top-8 right-6 lg:top-10 lg:right-10"
      />

      <div className="container-fluid grid items-center gap-16 lg:grid-cols-[7fr_3fr]">
        <form
          onSubmit={handleSubmit}
          className="bg-secondary flex flex-col gap-4 rounded-2xl p-8 sm:p-10"
        >
          <input
            type="text"
            name="name"
            placeholder="Full name"
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

        <div className="flex flex-col gap-6">
          <h2 className="font-display theme-fg text-6xl leading-[1.05] font-bold sm:text-7xl">
            Let&apos;s Design,
            <br />
            Build,
            <br />
            Launch
          </h2>

          <p className="text-primary text-lg leading-8 font-medium">
            Talk directly to our
            <br />
            Director of Business
          </p>
        </div>
      </div>

      <ArrowGroup
        count={4}
        className="absolute bottom-8 left-6 lg:bottom-10 lg:left-10"
      />
    </section>
  );
}
