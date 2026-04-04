import type { ReactElement } from "react";

import Image from "next/image";

import { User } from "lucide-react";

import type { Writer } from "../model/schema";

interface WriterAvatarProps {
  writer: Writer;
  size?: number;
}

export function WriterAvatar({ writer, size = 36 }: WriterAvatarProps): ReactElement {
  if (writer.image) {
    return (
      <Image
        src={writer.image}
        alt={writer.nickname}
        width={size}
        height={size}
        className="rounded-full object-cover"
      />
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-full bg-blue-200"
      style={{ width: size, height: size }}
    >
      <User className="h-4 w-4 text-blue-600" aria-hidden="true" />
    </div>
  );
}
