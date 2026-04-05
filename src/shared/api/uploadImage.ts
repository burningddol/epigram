import { apiClient } from "./client";

// Only ASCII printable characters allowed — the backend rejects non-English filenames
const ASCII_ONLY = /^[\x20-\x7E]+$/;

export async function uploadImage(file: File): Promise<string> {
  if (!ASCII_ONLY.test(file.name)) {
    throw new Error(`이미지 파일명은 영문만 사용할 수 있습니다: "${file.name}"`);
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await apiClient.post<{ url: string }>("/api/images/upload", formData);

  return response.data.url;
}
