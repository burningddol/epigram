import React from "react";

interface TagProps {
  label: string;
  onClick?: (label: string) => void;
}

export function Tag({ label, onClick }: TagProps): React.ReactElement {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={() => onClick(label)}
        className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-100 transition-colors"
      >
        #{label}
      </button>
    );
  }

  return (
    <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
      #{label}
    </span>
  );
}
