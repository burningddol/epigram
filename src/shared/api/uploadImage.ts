import { apiClient } from "./client";

// Only ASCII printable characters allowed — the backend rejects non-English filenames
const ASCII_ONLY = /^[\x20-\x7E]+$/;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
  "image/svg+xml",
]);

export async function uploadImage(file: File): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("jpg, png, gif, webp 형식의 이미지만 업로드할 수 있습니다.");
  }

  if (!ASCII_ONLY.test(file.name)) {
    throw new Error("파일명은 영문만 사용할 수 있습니다.");
  }

  const formData = new FormData();
  formData.append("image", file);

  // Content-Type을 undefined로 지워야 브라우저가 boundary 포함한 multipart/form-data를 자동 설정한다.
  // axios 기본 헤더(application/json)가 살아있으면 BFF가 JSON으로 오인해 파싱 실패한다.
  const response = await apiClient.post<{ url: string }>("/api/images/upload", formData, {
    headers: { "Content-Type": undefined },
  });

  return response.data.url;
}
