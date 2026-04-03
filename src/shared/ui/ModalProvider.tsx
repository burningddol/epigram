"use client";

import type { ReactElement } from "react";
import { Fragment } from "react";

import { useModalStore } from "@/shared/model/modalStore";

export function ModalProvider(): ReactElement | null {
  const { modals, closeModal } = useModalStore();

  if (modals.length === 0) return null;

  return (
    <>
      {modals.map((modal) => (
        <Fragment key={modal.id}>{modal.render(() => closeModal(modal.id))}</Fragment>
      ))}
    </>
  );
}
