import { useEffect, useState } from "react";

const AUTH_EVENT = "chaincode:auth";

export function getToken(): string | null {
  return localStorage.getItem("token");
}

/** Single source of truth for auth writes — notifies every listener. */
export function setAuthToken(token: string | null): void {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
  window.dispatchEvent(new Event(AUTH_EVENT));
}

/**
 * Auth token that stays in sync everywhere.
 * Fixes the stale-state bugs where Header/landing removed the token
 * directly while App's state (and therefore route guards) kept it.
 */
export function useAuthToken(): string | null {
  const [token, setLocalToken] = useState<string | null>(getToken);

  useEffect(() => {
    const sync = () => setLocalToken(getToken());
    window.addEventListener(AUTH_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(AUTH_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return token;
}

/** Decode the JWT payload (base64url) without a dependency. */
export function getWalletAddress(): string | null {
  const token = getToken();
  if (!token) return null;
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return payload?.user?.walletAddress ?? null;
  } catch {
    return null;
  }
}
