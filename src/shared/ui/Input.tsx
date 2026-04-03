interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, className = "", ...props }: InputProps) {
  const inputId = id ?? label;

  return (
    <div className="flex flex-col gap-1">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={`rounded-lg border px-4 py-2 text-sm outline-none transition-colors placeholder:text-gray-400 focus:ring-2 focus:ring-black disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 ${
          error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-black"
        } ${className}`}
        {...props}
      />
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
