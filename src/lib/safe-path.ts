/**
 * Returns `from` only if it is a safe *same-origin* path (starts with a single
 * "/", not "//" or a full URL). Prevents open-redirect phishing via ?from=.
 */
export function safeAdminRedirect(from: string | null | undefined): string {
  if (typeof from === "string" && from.startsWith("/") && !from.startsWith("//")) {
    return from;
  }
  return "/admin";
}
