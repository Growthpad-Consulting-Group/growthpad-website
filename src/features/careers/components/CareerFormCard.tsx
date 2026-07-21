"use client";

import React, { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import CtaButton from "@/shared/components/CtaButton";

interface CareerFormCardProps {
  /** The title of the job role (e.g. "Creative Director") */
  jobTitle?: string;
  /** Adds standard border/shadow styling */
  bordered?: boolean;
  /** Custom class name overrides */
  className?: string;
  /** 
   * "stacked" — description above the fields, single column layout (default).
   * "split"   — description in a left column, fields in a right column.
   */
  layout?: "stacked" | "split";
  /** Optional introduction copy */
  description?: React.ReactNode;
}

export default function CareerFormCard({
  jobTitle,
  bordered = false,
  className = "",
  layout = "stacked",
  description,
}: CareerFormCardProps) {
  // Form State
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // References
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Constants
  const MAX_FILE_SIZE_MB = 10;
  const ALLOWED_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const inputBase = `placeholder:text-white/40 text-white w-full bg-white/[0.05] border border-white/10 px-6 py-4 text-base outline-none rounded-2xl transition-all duration-300 hover:border-white/20 focus:bg-transparent focus:border-primary focus:ring-2 focus:ring-primary/20`;

  // Validation helper
  const validateAndSetFile = (selectedFile: File) => {
    setFileError(null);

    // Some systems report empty file type for docx/doc files in input. We can also fall back to extension check.
    const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
    const isValidType = ALLOWED_TYPES.includes(selectedFile.type) || 
                        ["pdf", "doc", "docx"].includes(fileExtension || "");

    if (!isValidType) {
      setFileError("Invalid file type. Please upload a PDF or Word document (.pdf, .doc, .docx).");
      setFile(null);
      return false;
    }

    const fileSizeInMB = selectedFile.size / (1024 * 1024);
    if (fileSizeInMB > MAX_FILE_SIZE_MB) {
      setFileError(`File is too large. Max size allowed is ${MAX_FILE_SIZE_MB}MB.`);
      setFile(null);
      return false;
    }

    setFile(selectedFile);
    return true;
  };

  // Event Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering file selection trigger
    setFile(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setFileError("Please upload your Resume/CV.");
      return;
    }

    setIsLoading(true);
    setFileError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const linkedin = (formData.get("linkedin") as string) || undefined;
    const portfolio = (formData.get("portfolio") as string) || undefined;
    const message = (formData.get("message") as string) || undefined;
    const role = jobTitle || undefined;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Data = (reader.result as string).split(",")[1];
      const payload = {
        name,
        phone,
        email,
        linkedin,
        portfolio,
        message,
        role,
        attachment: {
          content: base64Data,
          filename: file.name,
        },
      };

      try {
        const response = await fetch("/api/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (response.ok && result.success) {
          setIsSubmitted(true);
        } else {
          setFileError(
            result.error || "Failed to submit your application. Please try again."
          );
        }
      } catch (err) {
        setFileError("A network error occurred. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setFileError("Failed to read the file. Please try another file.");
      setIsLoading(false);
    };
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Submission Thank You View
  if (isSubmitted) {
    return (
      <div
        className={`bg-secondary flex flex-col items-center justify-center text-center gap-6 rounded-2xl p-10 border border-white/10 shadow-2xl min-h-[400px] ${className}`}
      >
        <div className="bg-primary/10 text-primary flex h-20 w-20 items-center justify-center rounded-full animate-bounce">
          <Icon icon="solar:check-circle-broken" className="h-12 w-12" />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-display text-2xl font-bold text-white">Application Received!</h3>
          <p className="max-w-md text-base leading-relaxed text-white/70">
            Thank you for applying{jobTitle ? ` for the ${jobTitle} position` : ""}. 
            Our talent acquisition team will review your credentials and get back to you shortly.
          </p>
        </div>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setFile(null);
            setFileError(null);
          }}
          className="mt-4 text-sm font-semibold tracking-wide text-primary hover:underline bg-transparent border-none cursor-pointer"
        >
          Submit another application
        </button>
      </div>
    );
  }

  // The actual form fields
  const fields = (
    <div className="flex flex-1 flex-col gap-4">
      {jobTitle && (
        <div className="relative">
          <input type="hidden" name="role" value={jobTitle} />
          <input
            type="text"
            value={`Applying for: ${jobTitle}`}
            readOnly
            disabled
            className={`${inputBase} text-white/60 bg-white/[0.08] cursor-not-allowed font-medium border border-transparent`}
          />
        </div>
      )}

      {/* Name and Phone details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Full name"
          required
          className={inputBase}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone number"
          required
          className={inputBase}
        />
      </div>

      {/* Email Address */}
      <input
        type="email"
        name="email"
        placeholder="Email address"
        required
        className={inputBase}
      />

      {/* LinkedIn & Portfolio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="url"
          name="linkedin"
          placeholder="LinkedIn URL (Optional)"
          className={inputBase}
        />
        <input
          type="url"
          name="portfolio"
          placeholder="Portfolio / Website URL (Optional)"
          className={inputBase}
        />
      </div>

      {/* Interactive CV/Resume Drag and Drop */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-white/70 mb-1 text-left">Resume / CV (Required)</label>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileSelect}
          className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-8 px-6 cursor-pointer text-center transition-all duration-300 ${
            isDragOver
              ? "border-primary bg-primary/5 text-white"
              : file
              ? "border-emerald-500/50 bg-emerald-500/5 text-white"
              : "border-white/20 hover:border-primary/50 hover:bg-white/5 text-white/60"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            className="hidden"
          />

          {!file ? (
            <div className="flex flex-col items-center gap-3">
              <Icon
                icon="solar:upload-cloud-broken"
                className={`h-10 w-10 transition-colors duration-300 ${
                  isDragOver ? "text-primary" : "text-white/40 group-hover:text-primary"
                }`}
              />
              <div>
                <p className="text-base font-medium text-white">
                  Drag & drop your Resume/CV here or <span className="text-primary hover:underline">browse</span>
                </p>
                <p className="mt-1 text-xs text-white/50">
                  Supports PDF, DOC, DOCX (Max {MAX_FILE_SIZE_MB}MB)
                </p>
              </div>
            </div>
          ) : (
            <div className="flex w-full items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-left">
                <div className="bg-emerald-500/20 text-emerald-400 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                  <Icon icon="solar:file-text-broken" className="h-6 w-6" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-white truncate max-w-[200px] sm:max-w-[320px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-white/50">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="text-white/40 hover:text-red-400 transition-colors p-2"
                title="Remove file"
              >
                <Icon icon="solar:trash-bin-trash-broken" className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
        {fileError && (
          <p className="mt-1.5 text-sm font-medium text-red-400 flex items-center gap-1.5 animate-pulse text-left">
            <Icon icon="solar:danger-triangle-broken" className="h-4 w-4 shrink-0" />
            {fileError}
          </p>
        )}
      </div>

      {/* Cover Letter */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-white/70 mb-1 text-left">Cover Letter / Message (Optional)</label>
        <textarea
          name="message"
          placeholder="Briefly introduce yourself and why you'd be a great fit..."
          rows={4}
          className="placeholder:text-white/40 text-white w-full resize-none rounded-2xl bg-white/[0.04] border border-white/10 px-6 py-4 text-base outline-none transition-all duration-300 hover:border-white/20 focus:bg-transparent focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="mt-2 flex justify-end">
        <CtaButton 
          type="submit" 
          circleClassName="bg-primary text-white"
          fullWidth
          className="sm:w-auto"
          disabled={isLoading}
        >
          {isLoading ? "Submitting Application..." : "Submit Application"}
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
          <div className="pb-6 lg:w-64 lg:shrink-0 text-left">
            <div className="text-2xl leading-8 font-light text-white opacity-90">
              {description}
            </div>
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
        <div className="mb-2 max-w-sm text-2xl leading-8 font-light text-white opacity-90 text-left">
          {description}
        </div>
      )}
      {fields}
    </form>
  );
}
