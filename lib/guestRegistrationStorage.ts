const STORAGE_PREFIX = "goccc-guest-reg";

function storageKey(eventId: string): string {
  return `${STORAGE_PREFIX}:${eventId}`;
}

export function getGuestRegistrationEmail(eventId: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(storageKey(eventId));
}

export function setGuestRegistrationEmail(eventId: string, email: string): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(storageKey(eventId), email.toLowerCase().trim());
}

export function clearGuestRegistrationEmail(eventId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(storageKey(eventId));
}
