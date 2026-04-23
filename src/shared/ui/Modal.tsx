"use client";

import type { MouseEvent, ReactElement, ReactNode } from "react";
import { useEffect } from "react";

import { Button } from "@/shared/ui/Button";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ onClose, children }: ModalProps): ReactElement {
  useEffect(() => {
    const activeElement = document.activeElement;
    const previousFocus = activeElement instanceof HTMLElement ? activeElement : null;
    const mainContent = document.getElementById("main-content");

    mainContent?.setAttribute("inert", "");

    return () => {
      mainContent?.removeAttribute("inert");
      previousFocus?.focus();
    };
  }, []);

  function handleBackdropClick(e: MouseEvent<HTMLDivElement>): void {
    if (e.target !== e.currentTarget) return;
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">{children}</div>
    </div>
  );
}

interface ConfirmModalProps {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({
  title,
  description,
  confirmLabel = "확인",
  cancelLabel = "취소",
  onConfirm,
  onClose,
}: ConfirmModalProps): ReactElement {
  function handleConfirm(): void {
    onConfirm();
    onClose();
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {description && <p className="mt-2 text-sm text-gray-600">{description}</p>}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
