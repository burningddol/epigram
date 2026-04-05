"use client";

import { useRef, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { Camera, Loader2 } from "lucide-react";

import { updateMe } from "@/entities/user/api/user";
import { uploadImage } from "@/shared/api/uploadImage";

interface ProfileImageUploadProps {
  currentImageUrl: string | null;
  nickname: string;
}

export function ProfileImageUpload({
  currentImageUrl,
  nickname,
}: ProfileImageUploadProps): React.ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const displayUrl = previewUrl ?? currentImageUrl;

  function handleAvatarClick(): void {
    if (isUploading) return;
    inputRef.current?.click();
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    event.target.value = "";

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setIsUploading(true);

    try {
      const imageUrl = await uploadImage(file);
      await updateMe({ image: imageUrl });
      // Clear preview so displayUrl falls back to the new currentImageUrl from parent
      setPreviewUrl(null);
      URL.revokeObjectURL(objectUrl);
      // Non-blocking: UI already shows the cleared preview
      void queryClient.invalidateQueries({ queryKey: ["me"] });
    } catch (error) {
      setPreviewUrl(null);
      URL.revokeObjectURL(objectUrl);
      setErrorMessage(
        error instanceof Error ? error.message : "이미지 업로드에 실패했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        aria-label="프로필 이미지 변경"
        onClick={handleAvatarClick}
        disabled={isUploading}
        className="group relative h-[80px] w-[80px] overflow-hidden rounded-full border-2 border-line-200 bg-blue-200 transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
      >
        {displayUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={displayUrl}
            alt={`${nickname} 프로필 이미지`}
            className="h-full w-full object-cover"
          />
        ) : (
          <DefaultAvatar nickname={nickname} />
        )}

        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          {isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          ) : (
            <Camera className="h-6 w-6 text-white" />
          )}
        </div>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        aria-hidden="true"
        tabIndex={-1}
      />

      {errorMessage && (
        <p role="alert" className="max-w-[240px] text-center text-xs text-error">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

interface DefaultAvatarProps {
  nickname: string;
}

function DefaultAvatar({ nickname }: DefaultAvatarProps): React.ReactElement {
  const initial = nickname.at(0)?.toUpperCase() ?? "?";

  return (
    <span className="flex h-full w-full items-center justify-center text-2xl font-semibold text-blue-600">
      {initial}
    </span>
  );
}
