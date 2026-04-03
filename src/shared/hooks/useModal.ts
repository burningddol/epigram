import React, { useCallback } from "react";
import { useModalStore } from "@/shared/model/modalStore";

let idCounter = 0;

function generateId(): string {
  idCounter += 1;
  return `modal-${idCounter}`;
}

interface UseModalReturn {
  open: (render: (onClose: () => void) => React.ReactNode) => string;
  close: (id: string) => void;
  closeAll: () => void;
}

export function useModal(): UseModalReturn {
  const { openModal, closeModal, closeAll } = useModalStore();

  const open = useCallback(
    (render: (onClose: () => void) => React.ReactNode): string => {
      const id = generateId();
      openModal({ id, render });
      return id;
    },
    [openModal]
  );

  const close = useCallback(
    (id: string): void => {
      closeModal(id);
    },
    [closeModal]
  );

  return { open, close, closeAll };
}
