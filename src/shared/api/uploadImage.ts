import { apiClient } from "./client";

// Only ASCII printable characters allowed — the backend rejects non-English filenames
const ASCII_ONLY = /^[\x20-\x7E]+$/;

export class NonAsciiFilenameError extends Error {
  constructor(filename: string) {
    super(`Image filename must contain only English characters: "${filename}"`);
    this.name = "NonAsciiFilenameError";
  }
}

export async function uploadImage(file: File): Promise<string> {
  if (!ASCII_ONLY.test(file.name)) {
    throw new NonAsciiFilenameError(file.name);
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await apiClient.post<{ url: string }>("/api/images/upload", formData);

  return response.data.url;
}
