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
 * Generates a site API key for production use
 * Format: site_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx (32 random characters after prefix)
 */
export function generateSiteApiKey(): string {
  const randomBytes = crypto.randomBytes(24);
  const key = randomBytes.toString("base64url");
  return `site_${key}`;
}

/**
 * Generates a production API key (legacy - use generateSiteApiKey instead)
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
  return /^(demo|live|site)_[A-Za-z0-9_-]{32}$/.test(key);
}

/**
 * Checks if API key is a demo key
 */
export function isDemoKey(key: string): boolean {
  return key.startsWith("demo_");
}

/**
 * Checks if API key is a site key (production)
 */
export function isSiteKey(key: string): boolean {
  return key.startsWith("site_");
}

/**
 * Gets the key type from an API key
 */
export function getKeyType(key: string): "demo" | "site" | "live" | "invalid" {
  if (key.startsWith("demo_")) return "demo";
  if (key.startsWith("site_")) return "site";
  if (key.startsWith("live_")) return "live";
  return "invalid";
}
