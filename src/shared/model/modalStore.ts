import type { ReactNode } from "react";

import { create } from "zustand";

interface ModalConfig {
  id: string;
  render: (onClose: () => void) => ReactNode;
}

interface ModalState {
  modals: ModalConfig[];
  openModal: (config: ModalConfig) => void;
  closeModal: (id: string) => void;
  closeAll: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  modals: [],
  openModal: (config) => set((state) => ({ modals: [...state.modals, config] })),
  closeModal: (id) => set((state) => ({ modals: state.modals.filter((m) => m.id !== id) })),
  closeAll: () => set({ modals: [] }),
}));
