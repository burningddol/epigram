interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
}

const VARIANT_CLASSES = {
  primary: "bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed",
  secondary:
    "border border-black text-black hover:bg-gray-100 disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed",
  ghost: "text-gray-500 hover:text-black disabled:text-gray-300 disabled:cursor-not-allowed",
} as const;

export function Button({
  variant = "primary",
  isLoading = false,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
}
