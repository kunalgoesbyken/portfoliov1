import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const CONTROL_CLASS =
  "block w-full rounded-none border-0 border-b bg-transparent px-0 py-2.5 font-custom2 text-base text-fg outline-none transition-colors duration-200 placeholder:text-fg-faint md:text-sm";

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  multiline?: boolean;
}

type ControlProps = InputHTMLAttributes<HTMLInputElement> &
  TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Field({
  id,
  label,
  error,
  multiline,
  className,
  ...props
}: FieldProps & ControlProps) {
  const errorId = `${id}-error`;
  const controlProps = {
    id,
    name: id,
    required: true,
    "aria-invalid": !!error,
    "aria-describedby": error ? errorId : undefined,
    className: cn(
      CONTROL_CLASS,
      error ? "border-danger" : "border-line-strong focus:border-fg",
      className,
    ),
    ...props,
  };

  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="font-custom2 text-fg-body block text-sm font-medium"
      >
        {label}
      </label>
      {multiline ? <textarea {...controlProps} /> : <input {...controlProps} />}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="font-custom2 text-danger animate-in fade-in slide-in-from-left-1 mt-1 flex items-center gap-1.5 text-sm duration-200"
        >
          <AlertCircle size={14} strokeWidth={2} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
