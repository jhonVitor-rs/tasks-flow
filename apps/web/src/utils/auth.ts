const ACCESS_TOKEN_KEY = 'access_token'

export function getToken(): string | null {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setToken(token: string): void {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearToken(): void {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
}

export const hasRefreshToken = (): boolean => {
  if (typeof document === 'undefined') return false;
  return document.cookie.includes('refresh_token');
};
