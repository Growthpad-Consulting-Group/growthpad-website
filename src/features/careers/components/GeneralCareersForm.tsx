"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import CtaButton from "@/shared/components/CtaButton";
import { specialties } from "@/features/services/data/specialties";

const DEPARTMENTS = specialties.map((service) => service.title);

export default function GeneralCareersForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const formEl = e.currentTarget;

    if (!executeRecaptcha) {
      setErrorMessage("reCAPTCHA not ready. Please try again.");
      setIsLoading(false);
      return;
    }
    const recaptchaToken = await executeRecaptcha("career_inquiry");

    const formData = new FormData(formEl);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      service: formData.get("service") as string || undefined,
      message: formData.get("message") as string || undefined,
    };

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, recaptchaToken }),
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

  const inputBase = `placeholder:text-white/40 text-white w-full bg-white/[0.05] border border-white/10 px-6 py-4 text-base outline-none rounded-2xl transition-all duration-300 hover:border-white/20 focus:bg-transparent focus:border-primary focus:ring-2 focus:ring-primary/20`;

  if (isSubmitted) {
    return (
      <div className="bg-secondary flex flex-col items-center justify-center text-center gap-6 rounded-2xl p-10 border border-white/10 shadow-2xl min-h-[350px] hover:border-white/20 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/10">
        <div className="bg-primary/10 text-primary flex h-20 w-20 items-center justify-center rounded-full animate-bounce">
          <Icon icon="solar:check-circle-broken" className="h-12 w-12" />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-display text-2xl font-bold text-white">
            Inquiry Received!
          </h3>
          <p className="max-w-md text-base leading-relaxed text-white/70">
            Thank you for your interest in joining Growthpad. Our talent
            acquisition team will review your inquiry and get back to you
            shortly.
          </p>
        </div>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setErrorMessage(null);
          }}
          className="mt-4 text-sm font-semibold tracking-wide text-primary hover:underline bg-transparent border-none cursor-pointer"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-secondary flex flex-col gap-8 rounded-2xl p-8 pt-14 pb-12 sm:p-10 sm:pt-16 sm:pb-14 lg:flex-row lg:gap-12 border border-white/5 hover:border-white/10 transition-all duration-500 ease-out hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-primary/10"
    >
      <div className="pb-12 lg:w-64 lg:shrink-0">
        <p className="text-2xl leading-8 font-light text-white opacity-90">
          Share your credentials and make your case.
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Full name"
          required
          className={inputBase}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className={inputBase}
        />

        <select
          name="service"
          defaultValue=""
          className={`${inputBase} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22><path fill=%22%23f5f5f5%22 d=%22M7 10l5 5 5-5z%22/></svg>')] bg-position-[right_1.5rem_center] bg-no-repeat pr-12`}
        >
          <option value="" disabled>
            Service Area of Interest (Optional)
          </option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <textarea
          name="message"
          placeholder="Tell us about yourself and your interest in joining Growthpad..."
          rows={5}
          className="placeholder:text-white/40 text-white w-full resize-none rounded-2xl bg-white/[0.04] border border-white/10 px-6 py-4 text-base outline-none transition-all duration-300 hover:border-white/20 focus:bg-transparent focus:border-primary focus:ring-2 focus:ring-primary/20"
        />

        {errorMessage && (
          <p className="mt-1 text-sm font-medium text-red-400 flex items-center gap-1.5 animate-pulse text-left">
            <Icon icon="solar:danger-triangle-broken" className="h-4 w-4 shrink-0" />
            {errorMessage}
          </p>
        )}

        <p className="text-xs text-white/30 text-center">
          Protected by reCAPTCHA —{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white/50"
          >
            Privacy
          </a>
          {" "}&amp;{" "}
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white/50"
          >
            Terms
          </a>
        </p>

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
    </form>
  );
}
