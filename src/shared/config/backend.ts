// Server-only: backend base URL for direct server-side fetch (bypassing BFF proxy)
export const BACKEND_BASE = `${process.env.BACKEND_URL}/${process.env.TEAM_ID}`;
