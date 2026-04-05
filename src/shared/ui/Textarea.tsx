import type { TextareaHTMLAttributes, ReactElement } from "react";

import { cn } from "@/shared/lib/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, id, className, ...props }: TextareaProps): ReactElement {
  const textareaId = id ?? label;

  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <label htmlFor={textareaId} className="text-sm font-medium text-blue-900">
          {label}
        </label>
      ) : null}
      <textarea
        id={textareaId}
        className={cn(
          "w-full rounded-xl bg-blue-200 px-4 py-3 text-sm text-black-950 outline-none transition-all duration-200 placeholder:text-blue-400 focus:bg-blue-100 focus:ring-2 focus:ring-black-500 disabled:cursor-not-allowed disabled:opacity-50",
          error && "bg-blue-100 ring-2 ring-error",
          className
        )}
        {...props}
      />
      {error ? <p className="animate-fade-in text-xs text-error">{error}</p> : null}
    </div>
  );
}
