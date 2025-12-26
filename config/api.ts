// Global API Base URL
const DEFAULT_API_BASE_URL = "http://193.203.161.174:3007";

const envBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;

export const API_BASE_URL = envBaseUrl.replace(/\/$/, "");

export const getApiUrl = (path = ""): string => {
  if (!path) return API_BASE_URL;
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};
