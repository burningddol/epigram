"use client";

import type { ReactElement, ReactNode } from "react";
import { createContext, useCallback, useContext, useState } from "react";

type RenderModal = (onClose: () => void) => ReactNode;

interface ModalContextValue {
  open: (render: RenderModal) => void;
  close: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }): ReactElement {
  const [render, setRender] = useState<RenderModal | null>(null);

  const close = useCallback(() => setRender(null), []);

  const open = useCallback((next: RenderModal) => {
    // setState로 함수를 저장하려면 함수형 setter로 한 번 wrap 해야 함
    setRender(() => next);
  }, []);

  return (
    <ModalContext.Provider value={{ open, close }}>
      {children}
      {render?.(close)}
    </ModalContext.Provider>
  );
}

export function useModalContext(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModalContext must be used within <ModalProvider>");
  return ctx;
}
