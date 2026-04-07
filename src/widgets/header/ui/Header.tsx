"use client";

import type { ReactElement } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { User } from "lucide-react";

import { useMe } from "@/entities/user";
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
  size: "sm" | "lg";
}

function UserSection({ size }: UserSectionProps): ReactElement {
  const { user, isLoading } = useMe();
  const isLg = size === "lg";
  const imageSize = isLg ? 32 : 24;

  if (isLoading) {
    return (
      <div className="flex items-center gap-[6px] animate-pulse">
        <div className={cn("rounded-full bg-blue-100 shrink-0", isLg ? "h-8 w-8" : "h-6 w-6")} />
        <div className="h-4 w-14 rounded bg-blue-100" />
      </div>
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className={cn(
          "font-semibold text-blue-700 hover:text-blue-900 transition-colors duration-150 whitespace-nowrap",
          isLg ? "text-[16px] leading-6" : "text-[14px] leading-[22px]"
        )}
      >
        로그인
      </Link>
    );
  }

  return (
    <Link href="/mypage" className="flex items-center gap-[6px]" aria-label="마이페이지">
      {user.image ? (
        <Image
          src={user.image}
          alt={user.nickname}
          width={imageSize}
          height={imageSize}
          className="rounded-full object-cover shrink-0"
        />
      ) : (
        <User size={imageSize} className="text-gray-300 shrink-0" aria-hidden="true" />
      )}
      <span
        className={cn(
          "font-medium text-gray-300 whitespace-nowrap",
          isLg ? "text-[14px] leading-6" : "text-[13px] leading-[22px]"
        )}
      >
        {user.nickname}
      </span>
    </Link>
  );
}

export function Header(): ReactElement {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-line-100 bg-white/90 backdrop-blur-md">
      {/* Mobile (base ~ 743px): 로고 + 텍스트 링크 / 유저 */}
      <div className="flex h-[52px] items-center justify-between px-6 tablet:hidden">
        <div className="flex items-center gap-6">
          <Logo size="sm" />
          <nav className="flex gap-6" aria-label="주요 메뉴">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} textSize="sm" />
            ))}
          </nav>
        </div>
        <UserSection size="sm" />
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
        <UserSection size="sm" />
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
        <UserSection size="lg" />
      </div>
    </header>
  );
}
