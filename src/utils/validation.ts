/**
 * Validation utilities for the application
 */

export function isValidApiKey(key: string | undefined): boolean {
  return Boolean(key && typeof key === "string" && key.trim().length > 0);
}

export function validateDeepgramApiKey(
  apiKey: string | undefined,
  onError: (message: string) => void
): boolean {
  if (!isValidApiKey(apiKey)) {
    onError("Deepgram API key missing in .env file.");
    return false;
  }
  return true;
}
