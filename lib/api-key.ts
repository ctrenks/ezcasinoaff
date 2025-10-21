import crypto from "crypto";

/**
 * Generates a unique API key for demo/testing purposes
 * Format: demo_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx (32 random characters after prefix)
 */
export function generateDemoApiKey(): string {
  const randomBytes = crypto.randomBytes(24);
  const key = randomBytes.toString("base64url");
  return `demo_${key}`;
}

/**
 * Generates a production API key
 * Format: live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx (32 random characters after prefix)
 */
export function generateLiveApiKey(): string {
  const randomBytes = crypto.randomBytes(24);
  const key = randomBytes.toString("base64url");
  return `live_${key}`;
}

/**
 * Validates API key format
 */
export function isValidApiKey(key: string): boolean {
  return /^(demo|live)_[A-Za-z0-9_-]{32}$/.test(key);
}
