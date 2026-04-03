import type { ReactElement } from "react";

interface TagProps {
  label: string;
  onClick?: (label: string) => void;
}

const TAG_CLASS = "rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600";

export function Tag({ label, onClick }: TagProps): ReactElement {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={() => onClick(label)}
        className={`${TAG_CLASS} hover:bg-blue-100 transition-colors`}
      >
        #{label}
      </button>
    );
  }

  return <span className={TAG_CLASS}>#{label}</span>;
}
