"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, Check, X } from "lucide-react";
import { Field } from "@/components/contact/field";
import { Spinner } from "@/components/ui/spinner";
import { CONTACT_EMAIL } from "@/lib/social-links";
import { cn } from "@/lib/utils";

type FieldName = "name" | "email" | "message";
type Errors = Partial<Record<FieldName, string>>;
type Status = { type: "success" | "error"; message: string } | null;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

const validate = (data: FormData): Errors => {
  const value = (key: FieldName) => String(data.get(key) ?? "").trim();
  const errors: Errors = {};
  if (!value("name")) errors.name = "Name is required";
  if (!value("email")) errors.email = "Email is required";
  else if (!EMAIL_PATTERN.test(value("email")))
    errors.email = "Please enter a valid email address";
  if (!value("message")) errors.message = "Message is required";
  return errors;
};

function StatusBanner({
  status,
  onDismiss,
}: {
  status: NonNullable<Status>;
  onDismiss: () => void;
}) {
  const ok = status.type === "success";
  return (
    <div
      id="submit-status"
      role="status"
      aria-live="polite"
      className={cn(
        "font-custom2 animate-in fade-in slide-in-from-top-2 mt-4 flex items-start gap-3 rounded-lg border p-4 text-sm duration-300",
        ok ? "border-line text-fg-body" : "border-danger/30 text-danger",
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
          ok ? "bg-muted" : "bg-danger/10",
        )}
      >
        {ok ? (
          <Check size={12} strokeWidth={3} aria-hidden="true" />
        ) : (
          <AlertCircle size={12} strokeWidth={2.5} aria-hidden="true" />
        )}
      </span>
      <div className="flex-1">
        <p className="font-medium">
          {ok ? "Message sent" : "Something went wrong"}
        </p>
        <p
          className={cn("mt-0.5 text-xs", ok ? "text-fg-subtle" : "opacity-80")}
        >
          {status.message}
        </p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="text-fg-faint hover:bg-muted hover:text-fg-muted shrink-0 rounded-md p-1 transition-colors duration-200"
      >
        <X size={14} strokeWidth={2} />
      </button>
    </div>
  );
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const [errors, setErrors] = useState<Errors>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const nextErrors = validate(data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    setStatus(null);
    data.append("_subject", "New Contact Form Submission from Portfolio");
    data.append("_replyto", String(data.get("email")));

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      if (result.success) {
        setStatus({
          type: "success",
          message: "Message sent successfully! Thank you for reaching out.",
        });
        form.reset();
      } else {
        setStatus({
          type: "error",
          message: "Something went wrong. Please try again.",
        });
      }
    } catch {
      setStatus({
        type: "error",
        message: "Failed to send message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-7">
      <Field
        id="name"
        label="Full name"
        type="text"
        autoComplete="name"
        placeholder="Tyler Durden"
        error={errors.name}
      />
      <Field
        id="email"
        label="Email address"
        type="email"
        autoComplete="email"
        placeholder="tyler@projectmayhem.com"
        error={errors.email}
      />
      <Field
        id="message"
        label="Message"
        multiline
        rows={5}
        placeholder="You're crazy good, never change."
        error={errors.message}
        className="resize-none"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        aria-describedby={status ? "submit-status" : undefined}
        className="btn-solid !mt-2 px-6 py-3.5 md:w-full md:py-2.5"
      >
        {isSubmitting ? (
          <>
            <Spinner />
            Sending...
          </>
        ) : (
          "Send message"
        )}
      </button>

      {status && (
        <StatusBanner status={status} onDismiss={() => setStatus(null)} />
      )}
    </form>
  );
}
