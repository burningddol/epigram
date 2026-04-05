"use client";

import type { ReactElement } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Menu, User } from "lucide-react";

import { cn } from "@/shared/lib/cn";

const NAV_LINKS = [
  { href: "/feeds", label: "피드" },
  { href: "/search", label: "검색" },
] as const;

interface LogoProps {
  size: "sm" | "lg";
}

function Logo({ size }: LogoProps): ReactElement {
  const isLg = size === "lg";
  return (
    <Link href="/" className="flex items-center gap-1" aria-label="홈으로 이동">
      <span
        className={cn(
          "font-serif font-black leading-[26px] tracking-tight text-blue-950 whitespace-nowrap",
          isLg ? "text-[20px]" : "text-[16px]"
        )}
      >
        Epigram
      </span>
    </Link>
  );
}

interface NavLinkProps {
  href: string;
  label: string;
  textSize: "sm" | "md";
}

function NavLink({ href, label, textSize }: NavLinkProps): ReactElement {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);
  const isMd = textSize === "md";

  return (
    <Link
      href={href}
      className={cn(
        "relative font-semibold transition-colors duration-150",
        isMd ? "text-[16px] leading-[26px]" : "text-[14px] leading-6",
        isActive ? "text-blue-700" : "text-black-600 hover:text-blue-700"
      )}
    >
      {label}
      {isActive && (
        <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-blue-500" />
      )}
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
        className={cn(
          "font-medium text-gray-300 whitespace-nowrap",
          isMdText ? "text-[14px] leading-6" : "text-[13px] leading-[22px]"
        )}
      >
        김코드
      </span>
    </Link>
  );
}

export function Header(): ReactElement {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-line-100 bg-white/90 backdrop-blur-md">
      {/* Mobile (base ~ 743px): 햄버거 + 로고 / 유저 */}
      <div className="flex h-[52px] items-center justify-between px-6 tablet:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="메뉴 열기"
            className="rounded-md p-1 transition-colors hover:bg-blue-50"
          >
            <Menu size={24} className="text-gray-200" aria-hidden="true" />
          </button>
          <Logo size="sm" />
        </div>
        <UserSection iconSize="sm" textSize="sm" />
      </div>

      {/* Tablet (744px ~ 1279px): 로고 + 텍스트 링크 / 유저 */}
      <div className="hidden h-[60px] items-center justify-between px-[72px] tablet:flex pc:hidden">
        <div className="flex items-center gap-6">
          <Logo size="sm" />
          <nav className="flex gap-6" aria-label="주요 메뉴">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} textSize="sm" />
            ))}
          </nav>
        </div>
        <UserSection iconSize="sm" textSize="sm" />
      </div>

      {/* Desktop (1280px+): 로고 + 텍스트 링크 / 유저 */}
      <div className="hidden h-[80px] items-center justify-between px-[120px] pc:flex">
        <div className="flex items-center gap-9">
          <Logo size="lg" />
          <nav className="flex gap-6" aria-label="주요 메뉴">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} textSize="md" />
            ))}
          </nav>
        </div>
        <UserSection iconSize="lg" textSize="md" />
      </div>
    </header>
  );
}
