import type { ReactElement } from "react";

import { Menu, User } from "lucide-react";
import Link from "next/link";

interface LogoProps {
  size: "sm" | "lg";
}

function Logo({ size }: LogoProps): ReactElement {
  const isLg = size === "lg";
  return (
    <Link href="/" className="flex items-center gap-1" aria-label="홈으로 이동">
      <span
        className={`font-black leading-[26px] text-black-600 whitespace-nowrap ${isLg ? "text-[20px]" : "text-[16px]"}`}
      >
        Epigram
      </span>
    </Link>
  );
}

interface UserSectionProps {
  iconSize: "sm" | "lg";
  textSize: "sm" | "md";
}

function UserSection({ iconSize, textSize }: UserSectionProps): ReactElement {
  const isLgIcon = iconSize === "lg";
  const isMdText = textSize === "md";
  return (
    <Link href="/mypage" className="flex items-center gap-[6px]" aria-label="마이페이지">
      <User size={isLgIcon ? 24 : 16} className="text-gray-300 shrink-0" aria-hidden="true" />
      <span
        className={`font-medium text-gray-300 whitespace-nowrap ${isMdText ? "text-[14px] leading-6" : "text-[13px] leading-[22px]"}`}
      >
        김코드
      </span>
    </Link>
  );
}

export function Header(): ReactElement {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-line-100 bg-white">
      {/* Mobile (base ~ 743px): 햄버거 + 로고 / 유저 */}
      <div className="flex h-[52px] items-center justify-between px-6 tablet:hidden">
        <div className="flex items-center gap-3">
          <button type="button" aria-label="메뉴 열기">
            <Menu size={24} className="text-gray-200" aria-hidden="true" />
          </button>
          <Logo size="sm" />
        </div>
        <UserSection iconSize="sm" textSize="sm" />
      </div>

      {/* Tablet (744px ~ 1919px): 로고 + 텍스트 링크 / 유저 */}
      <div className="hidden h-[60px] items-center justify-between px-[72px] tablet:flex desktop:hidden">
        <div className="flex items-center gap-6">
          <Logo size="sm" />
          <nav className="flex gap-6" aria-label="주요 메뉴">
            <Link href="/feed" className="text-[14px] font-semibold leading-6 text-black-600">
              피드
            </Link>
            <Link href="/search" className="text-[14px] font-semibold leading-6 text-black-600">
              검색
            </Link>
          </nav>
        </div>
        <UserSection iconSize="sm" textSize="sm" />
      </div>

      {/* Desktop (1920px+): 로고 + 텍스트 링크 / 유저 */}
      <div className="hidden h-[80px] items-center justify-between px-[120px] desktop:flex">
        <div className="flex items-center gap-9">
          <Logo size="lg" />
          <nav className="flex gap-6" aria-label="주요 메뉴">
            <Link href="/feed" className="text-[16px] font-semibold leading-[26px] text-black-600">
              피드
            </Link>
            <Link
              href="/search"
              className="text-[16px] font-semibold leading-[26px] text-black-600"
            >
              검색
            </Link>
          </nav>
        </div>
        <UserSection iconSize="lg" textSize="md" />
      </div>
    </header>
  );
}
