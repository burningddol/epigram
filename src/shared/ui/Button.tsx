import type { ButtonHTMLAttributes, ReactElement } from "react";

import { cn } from "@/shared/lib/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
}

const VARIANT_CLASSES = {
  primary:
    "bg-black-500 text-white hover:bg-black-600 active:scale-95 disabled:bg-blue-300 disabled:text-white disabled:cursor-not-allowed",
  secondary:
    "border border-black-500 text-black-500 hover:bg-blue-200 active:scale-95 disabled:border-blue-300 disabled:text-blue-300 disabled:cursor-not-allowed",
  ghost:
    "text-blue-400 hover:text-black-500 active:scale-95 disabled:text-blue-300 disabled:cursor-not-allowed",
} as const;

export function Button({
  variant = "primary",
  isLoading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps): ReactElement {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black-500 focus-visible:ring-offset-1",
        VARIANT_CLASSES[variant],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
}
