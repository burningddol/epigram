"use client";

import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { Smartphone, X } from "lucide-react";

import { APP_QR } from "./appQr";

export function AppQrPopover(): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent): void {
      // event.target은 EventTarget | null 타입이지만 DOM 이벤트에서는 실제로 Node를 반환한다.
      // Node.contains 시그니처 호환을 위해 단언이 불가피하다.
      const target = event.target as Node | null;
      if (!containerRef.current?.contains(target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent): void {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  function handleToggle(): void {
    setIsOpen((prev) => !prev);
  }

  function handleClose(): void {
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="inline-flex h-12 w-36 items-center justify-center gap-2 rounded-xl border border-blue-950 bg-transparent text-sm font-semibold text-blue-950 shadow-sm transition-all duration-300 hover:bg-blue-950 hover:text-white hover:shadow-md active:scale-95"
      >
        <Smartphone size={16} aria-hidden="true" />
        앱으로 받기
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="모바일 앱 QR 코드"
          className="absolute left-1/2 top-full z-20 mt-3 w-64 -translate-x-1/2 rounded-2xl border border-line-100 bg-white p-5 shadow-xl animate-fade-in-up"
        >
          <button
            type="button"
            onClick={handleClose}
            aria-label="닫기"
            className="absolute right-3 top-3 text-black-300 transition-colors hover:text-black-600"
          >
            <X size={16} aria-hidden="true" />
          </button>
          <div className="flex flex-col items-center gap-3">
            <Image
              src={APP_QR.src}
              alt={APP_QR.alt}
              width={180}
              height={180}
              unoptimized
              className="h-44 w-44 bg-white"
            />
            <p className="text-center text-xs text-black-500">
              Expo Go 앱으로
              <br />
              QR을 스캔해 주세요
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
