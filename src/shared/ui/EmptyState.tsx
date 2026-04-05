import type { ReactElement } from "react";

interface EmptyStateProps {
  icon: ReactElement;
  title: string;
  description?: string;
  action?: ReactElement;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps): ReactElement {
  return (
    <div className="flex flex-col items-center gap-5 py-16 text-center tablet:py-20 pc:gap-6 pc:py-24">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-200/40 pc:h-20 pc:w-20">
        {icon}
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-semibold text-black-600 tablet:text-base">{title}</p>
        {description && <p className="text-xs text-black-300 tablet:text-sm">{description}</p>}
      </div>
      {action}
    </div>
  );
}
