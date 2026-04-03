import type { ReactNode } from "react";
import { useCallback } from "react";

import { useModalStore } from "@/shared/model/modalStore";

let idCounter = 0;

function generateId(): string {
  idCounter += 1;
  return `modal-${idCounter}`;
}

interface UseModalReturn {
  open: (render: (onClose: () => void) => ReactNode) => string;
  close: (id: string) => void;
  closeAll: () => void;
}

export function useModal(): UseModalReturn {
  const { openModal, closeModal, closeAll } = useModalStore();

  const open = useCallback(
    (render: (onClose: () => void) => ReactNode): string => {
      const id = generateId();
      openModal({ id, render });
      return id;
    },
    [openModal]
  );

  return { open, close: closeModal, closeAll };
}
