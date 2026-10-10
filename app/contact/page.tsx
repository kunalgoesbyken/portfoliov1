"use client";

import { useState } from "react";
import Container from "@/components/containers";
import { Github, Linkedin, Check, AlertCircle, X } from "lucide-react";
import { SiX } from "react-icons/si";
import dynamic from "next/dynamic";
const DisplacementText = dynamic(() => import("@/components/ui/displacement-text"), { ssr: false });
import PageBorder from "@/components/ui/page-border";
import { SOCIAL_LINKS } from "@/lib/social-links";

const LABEL_CLASS = "block text-sm font-medium text-neutral-700 dark:text-neutral-300 font-custom2";

const fieldClass = (hasError: boolean) =>
  `block w-full px-0 py-2.5 bg-transparent border-0 border-b rounded-none outline-none transition-colors duration-200 font-custom2 text-base md:text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 ${
    hasError
      ? "border-red-400 dark:border-red-700"
      : "border-neutral-300 dark:border-neutral-700 focus:border-neutral-900 dark:focus:border-neutral-100"
  }`;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  const validateForm = (formData: FormData) => {
    const newErrors: typeof errors = {};
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    if (!name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!message?.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    if (!validateForm(formData)) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    // Add FormSubmit special fields
    formData.append("_subject", "New Contact Form Submission from Portfolio");

    // Use the email for _replyto so you can easily reply to the sender
    const email = formData.get("email") as string;
    if (email) {
      formData.append("_replyto", email);
    }

    try {
      const response = await fetch("https://formsubmit.co/ajax/kunt.rc7@gmail.com", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({
          type: "success",
          message: "Message sent successfully! Thank you for reaching out.",
        });
        form.reset();
        setErrors({});
      } else {
        setSubmitStatus({
          type: "error",
          message: "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Failed to send message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen justify-center font-sans overflow-hidden">
      <Container className="min-h-screen px-6 sm:px-10 pt-20 md:p-20 md:pb-10 mx-auto">
        <PageBorder side="right" />
        <PageBorder side="left" />

        <h1 className="text-neutral-900 dark:text-neutral-50 font-custom font-semibold text-3xl tracking-tight">
          <span className="link--elara">Contact</span>
        </h1>
        <p className="tracking-tight font-custom2 text-neutral-600 dark:text-neutral-400 max-w-lg text-sm md:text-base mt-2 mb-8 md:mb-12">
          Hi there, I’m currently open to meaningful work.
        </p>

        <div className="w-full max-w-2xl md:max-lg:pr-4 relative z-10">
          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="space-y-1">
              <label htmlFor="name" className={LABEL_CLASS}>
                Full name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                aria-required="true"
                aria-invalid={errors.name ? "true" : "false"}
                aria-describedby={errors.name ? "name-error" : undefined}
                placeholder="Tyler Durden"
                className={fieldClass(!!errors.name)}
              />
              {errors.name && (
                <p id="name-error" className="text-sm text-red-500 dark:text-red-400 mt-1 font-custom2 flex items-center gap-1.5 animate-in fade-in slide-in-from-left-1 duration-200" role="alert">
                  <AlertCircle size={14} strokeWidth={2} />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className={LABEL_CLASS}>
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                aria-required="true"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
                placeholder="tyler@projectmayhem.com"
                className={fieldClass(!!errors.email)}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-red-500 dark:text-red-400 mt-1 font-custom2 flex items-center gap-1.5 animate-in fade-in slide-in-from-left-1 duration-200" role="alert">
                  <AlertCircle size={14} strokeWidth={2} />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="message" className={LABEL_CLASS}>
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                aria-required="true"
                aria-invalid={errors.message ? "true" : "false"}
                aria-describedby={errors.message ? "message-error" : undefined}
                rows={5}
                placeholder="You're crazy good, never change."
                className={fieldClass(!!errors.message) + " resize-none"}
              />
              {errors.message && (
                <p id="message-error" className="text-sm text-red-500 dark:text-red-400 mt-1 font-custom2 flex items-center gap-1.5 animate-in fade-in slide-in-from-left-1 duration-200" role="alert">
                  <AlertCircle size={14} strokeWidth={2} />
                  {errors.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
              aria-describedby={submitStatus.type ? "submit-status" : undefined}
              className="btn-solid md:w-full px-6 py-3.5 md:py-2.5 !mt-2"
            >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-current"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send message"
                )}
            </button>

            {/* Status Message - Matches site's neutral palette aesthetic */}
            {submitStatus.type && (
              <div
                id="submit-status"
                role="status"
                aria-live="polite"
                className={`mt-4 rounded-lg text-sm font-custom2 overflow-hidden
                  border ${submitStatus.type === "success"
                    ? "border-neutral-200/80 dark:border-neutral-700/50"
                    : "border-red-200/60 dark:border-red-900/30"
                  }
                  animate-in fade-in slide-in-from-top-2 duration-300 ease-out
                  ${submitStatus.type === "success" ? "text-neutral-700 dark:text-neutral-300" : "text-red-700 dark:text-red-400"}`}
              >
                <div className="flex items-start gap-3 p-4">
                  <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5
                    ${submitStatus.type === "success"
                      ? "bg-neutral-100 dark:bg-neutral-800"
                      : "bg-red-50 dark:bg-red-900/20"
                    }`}>
                    {submitStatus.type === "success" ? (
                      <Check size={12} className="text-neutral-600 dark:text-neutral-400" strokeWidth={3} />
                    ) : (
                      <AlertCircle size={12} className="text-red-500 dark:text-red-400" strokeWidth={2.5} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{submitStatus.type === "success" ? "Message sent" : "Something went wrong"}</p>
                    <p className={`mt-0.5 text-xs ${submitStatus.type === "success"
                      ? "text-neutral-500 dark:text-neutral-500"
                      : "text-red-600/80 dark:text-red-400/80"
                    }`}>
                      {submitStatus.message}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSubmitStatus({ type: null, message: "" })}
                    className="flex-shrink-0 p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800
                      text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300
                      transition-colors duration-200"
                    aria-label="Dismiss"
                  >
                    <X size={14} strokeWidth={2} />
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-8 md:mt-10 flex flex-row justify-between items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 font-custom2">
            <div className="flex items-center gap-2">
              <p>Kunal</p>
            </div>

            {/* Displacement Text - Visible and Hoverable */}

            <div className="flex items-center gap-4">
              <a href={SOCIAL_LINKS.x} target="_blank" rel="noopener noreferrer" aria-label="X" className="max-md:p-3">
                <SiX size={14} className="hover:text-neutral-900 dark:hover:text-neutral-200 cursor-pointer transition-colors" />
              </a>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="max-md:p-3">
                <Linkedin size={14} className="hover:text-neutral-900 dark:hover:text-neutral-200 cursor-pointer transition-colors" />
              </a>
              <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="max-md:p-3">
                <Github size={14} className="hover:text-neutral-900 dark:hover:text-neutral-200 cursor-pointer transition-colors" />
              </a>
            </div>
          </div>
        </div>

        <div className="w-full h-36 md:h-60 relative overflow-hidden flex items-center justify-center">
          <DisplacementText
            text="KUNAL"
            fontSize={450}
            className="h-full w-full"
            lightColor="#171717"
            darkColor="#e5e5e5"
          />
        </div>


      </Container>
    </div>
  );
}
