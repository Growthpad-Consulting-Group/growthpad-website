"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string || undefined,
      service: formData.get("service") as string || undefined,
      message: formData.get("message") as string || undefined,
      role: jobRole || undefined,
    };

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSubmitted(true);
      } else {
        setErrorMessage(
          result.error || "Failed to submit your inquiry. Please try again."
        );
      }
    } catch (err) {
      setErrorMessage("A network error occurred. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase = `placeholder:text-secondary/50 text-secondary w-full bg-white px-6 py-4 text-base outline-none ${
    inputShape === "pill" ? "rounded-2xl" : "rounded-2xl"
  }`;

  // Submission Thank You View
  if (isSubmitted) {
    return (
      <div
        className={`bg-secondary flex flex-col items-center justify-center text-center gap-6 rounded-2xl p-10 border border-white/10 shadow-2xl min-h-[350px] transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/10 ${className}`}
      >
        <div className="bg-primary/10 text-primary flex h-20 w-20 items-center justify-center rounded-full animate-bounce">
          <Icon icon="solar:check-circle-broken" className="h-12 w-12" />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-display text-2xl font-bold text-white">Inquiry Received!</h3>
          <p className="max-w-md text-base leading-relaxed text-white/70">
            Thank you for reaching out to Growthpad. Our team has received your message and will review it. We&apos;re looking forward to speaking with you!
          </p>
        </div>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setErrorMessage(null);
          }}
          className="mt-4 text-sm font-semibold tracking-wide text-primary hover:underline bg-transparent border-none cursor-pointer"
        >
          Send another message
        </button>
      </div>
    );
  }

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

      {errorMessage && (
        <p className="mt-1 text-sm font-medium text-red-400 flex items-center gap-1.5 animate-pulse text-left">
          <Icon icon="solar:danger-triangle-broken" className="h-4 w-4 shrink-0" />
          {errorMessage}
        </p>
      )}

      <div className="mt-2 flex justify-end">
        <CtaButton
          type="submit"
          circleClassName="bg-primary text-white"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Submit"}
        </CtaButton>
      </div>
    </div>
  );

  if (layout === "split") {
    return (
      <form
        onSubmit={handleSubmit}
        className={`bg-secondary flex flex-col gap-8 rounded-2xl p-8 pt-14 pb-12 sm:p-10 sm:pt-16 sm:pb-14 lg:flex-row lg:gap-12 border border-white/5 hover:border-white/10 transition-all duration-500 ease-out hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-primary/10 ${
          bordered ? "shadow-black/5" : ""
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
      className={`bg-secondary flex flex-col gap-4 rounded-2xl p-8 sm:p-10 border border-white/5 hover:border-white/10 transition-all duration-500 ease-out hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-primary/10 ${
        bordered ? "shadow-black/5" : ""
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
