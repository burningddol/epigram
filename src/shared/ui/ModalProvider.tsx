"use client";

import React from "react";
import { useModalStore } from "@/shared/model/modalStore";

export function ModalProvider(): React.ReactElement | null {
  const { modals, closeModal } = useModalStore();

  if (modals.length === 0) return null;

  return (
    <>
      {modals.map((modal) => (
        <React.Fragment key={modal.id}>{modal.render(() => closeModal(modal.id))}</React.Fragment>
      ))}
    </>
  );
}
