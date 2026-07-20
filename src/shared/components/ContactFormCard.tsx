"use client";

import CtaButton from "@/shared/components/CtaButton";

export default function ContactFormCard({
  description,
  inputShape = "rounded",
  bordered = false,
  layout = "stacked",
  serviceOptions,
  jobRole,
  className = "",
}: {
  /** Optional copy rendered inside the card. */
  description?: React.ReactNode;
  /** "rounded" (rounded-2xl, default) or "pill" (rounded-full) inputs. */
  inputShape?: "rounded" | "pill";
  /** Adds the subtle shadow used when the card sits on a light section. */
  bordered?: boolean;
  /**
   * "stacked" — description above the fields, single column (default).
   * "split"   — description in a narrower left column, fields in a wider
   *             right column.
   */
  layout?: "stacked" | "split";
  /** If provided, adds a "Service" <select> (before the message field) with these options. */
  serviceOptions?: string[];
  /** If provided, pins the form to a specific job opening (e.g. a job's detail page) —
   * shows a read-only "Applying for" field and includes the role in the submission. */
  jobRole?: string;
  className?: string;
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: wire this up to an actual submission endpoint (API route,
    // email service, CRM, etc.) once one is decided on.
  };

  const inputBase = `placeholder:text-secondary/50 text-secondary w-full bg-white px-6 py-4 text-base outline-none ${
    inputShape === "pill" ? "rounded-2xl" : "rounded-2xl"
  }`;

  const fields = (
    <div className="flex flex-1 flex-col gap-4">
      {jobRole && (
        <>
          <input type="hidden" name="role" value={jobRole} />
          <input
            type="text"
            value={`Applying for: ${jobRole}`}
            readOnly
            disabled
            className={`${inputBase} text-secondary/60 cursor-not-allowed`}
          />
        </>
      )}

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

      {serviceOptions && (
        <select
          name="service"
          defaultValue=""
          className={`${inputBase} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22><path fill=%22%23231812%22 d=%22M7 10l5 5 5-5z%22/></svg>')] bg-position-[right_1.5rem_center] bg-no-repeat pr-12`}
        >
          <option value="" disabled>
            Service
          </option>
          {serviceOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}

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
    </div>
  );

  if (layout === "split") {
    return (
      <form
        onSubmit={handleSubmit}
        className={`bg-secondary flex flex-col gap-8 rounded-2xl p-8 pt-14 pb-12 sm:p-10 sm:pt-16 sm:pb-14 lg:flex-row lg:gap-12 ${
          bordered ? "shadow-xl shadow-black/5" : ""
        } ${className}`}
      >
        {description && (
          <div className="pb-12 lg:w-64 lg:shrink-0">
            <p className="text-2xl leading-8 font-light text-white opacity-90">
              {description}
            </p>
          </div>
        )}
        {fields}
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-secondary flex flex-col gap-4 rounded-2xl p-8 sm:p-10 ${
        bordered ? "shadow-xl shadow-black/5" : ""
      } ${className}`}
    >
      {description && (
        <p className="mb-2 max-w-sm text-2xl leading-8 font-light text-white opacity-90">
          {description}
        </p>
      )}
      {fields}
    </form>
  );
}
