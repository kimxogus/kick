const viewerKey = "kick_viewer_id";

export function getOrCreateViewerId(): string {
  if (typeof window === "undefined") {
    return "server_viewer";
  }

  const existing = window.localStorage.getItem(viewerKey);
  if (existing) {
    return existing;
  }

  const next = `viewer_${crypto.randomUUID()}`;
  window.localStorage.setItem(viewerKey, next);
  return next;
}
