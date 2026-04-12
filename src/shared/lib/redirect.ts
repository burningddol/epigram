export const SESSION_REDIRECT_KEY = "loginRedirect";
export const DEFAULT_REDIRECT_PATH = "/epigrams";

/** open redirect 방지: / 로 시작하는 경로만 허용 */
export function getSafeRedirect(redirect: string | null | undefined): string {
  return redirect?.startsWith("/") ? redirect : DEFAULT_REDIRECT_PATH;
}
