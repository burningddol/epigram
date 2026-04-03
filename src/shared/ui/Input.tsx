interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, className = "", ...props }: InputProps) {
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
        className={`h-11 w-full rounded-xl bg-blue-200 px-4 text-sm text-black-950 outline-none transition-colors placeholder:text-blue-400 focus:ring-2 focus:ring-black-500 disabled:cursor-not-allowed disabled:opacity-50 ${
          error ? "ring-2 ring-error" : ""
        } ${className}`}
        {...props}
      />
      {error ? <p className="text-xs text-error">{error}</p> : null}
    </div>
  );
}
