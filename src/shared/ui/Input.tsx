import type { InputHTMLAttributes, ReactElement } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, className = "", ...props }: InputProps): ReactElement {
  const inputId = id ?? label;

  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-blue-900">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={`h-11 w-full rounded-xl bg-blue-200 px-4 text-sm text-black-950 outline-none transition-all duration-200 placeholder:text-blue-400 focus:bg-blue-100 focus:ring-2 focus:ring-black-500 disabled:cursor-not-allowed disabled:opacity-50 ${
          error ? "bg-blue-100 ring-2 ring-error" : ""
        } ${className}`}
        {...props}
      />
      {error ? <p className="animate-fade-in text-xs text-error">{error}</p> : null}
    </div>
  );
}
