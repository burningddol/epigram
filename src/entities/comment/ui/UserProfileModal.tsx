import type { ReactElement } from "react";

import { Button } from "@/shared/ui/Button";
import { Modal } from "@/shared/ui/Modal";

import { WriterAvatar } from "./WriterAvatar";

import type { Writer } from "../model/schema";

interface UserProfileModalProps {
  writer: Writer;
  onClose: () => void;
}

export function UserProfileModal({ writer, onClose }: UserProfileModalProps): ReactElement {
  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col items-center gap-5 px-2 py-4">
        <WriterAvatar writer={writer} size={64} />
        <p className="text-center text-lg font-semibold text-black-800">{writer.nickname}</p>
        <Button variant="secondary" onClick={onClose} className="w-full">
          닫기
        </Button>
      </div>
    </Modal>
  );
}
