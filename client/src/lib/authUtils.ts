export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}

export function redirectToLogin() {
  window.location.href = "/api/auth/google";
}

export async function redirectToLogout() {
  try {
    // Call logout endpoint
    await fetch("/api/logout", {
      method: "GET",
      credentials: "include",
    });
    
    // Force page reload to clear all state and caches
    window.location.href = "/";
  } catch (error) {
    // If logout fails, still redirect to clear frontend state
    window.location.href = "/";
  }
}
