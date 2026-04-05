import type { ReactElement } from "react";

import { FileQuestion } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/shared/ui/EmptyState";

export default function NotFound(): ReactElement {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <EmptyState
        icon={
          <FileQuestion className="h-9 w-9 text-blue-500" strokeWidth={1.5} aria-hidden="true" />
        }
        title="페이지를 찾을 수 없어요"
        description="요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다."
        action={
          <Link
            href="/epigrams"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-black-500 px-6 text-sm font-semibold text-white transition-all duration-200 hover:bg-black-600 active:scale-95"
          >
            홈으로 돌아가기
          </Link>
        }
      />
    </div>
  );
}
