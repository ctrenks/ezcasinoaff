/**
 * Create a URL-friendly slug from a title
 */
export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Create a unique slug by appending a random suffix if needed
 */
export function createUniqueSlug(title: string): string {
  const baseSlug = createSlug(title);
  const suffix = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${suffix}`;
}

/**
 * Extract YouTube video ID from various YouTube URL formats
 */
export function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

/**
 * Extract Twitter/X tweet ID from URL
 */
export function extractTwitterId(url: string): string | null {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?twitter\.com\/\w+\/status\/(\d+)/,
    /(?:https?:\/\/)?(?:www\.)?x\.com\/\w+\/status\/(\d+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

/**
 * Convert embed URLs to proper embed HTML
 */
export function processEmbeds(content: string): string {
  let processed = content;

  // Replace YouTube URLs with embeds
  processed = processed.replace(
    /(?:https?:\/\/)?(?:www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([^\s<]+)/g,
    (match, prefix, videoId) => {
      const cleanId = videoId.split(/[?&]/)[0];
      return `<div class="video-embed"><iframe src="https://www.youtube.com/embed/${cleanId}" frameborder="0" allowfullscreen></iframe></div>`;
    }
  );

  // Replace Twitter/X URLs with embeds
  processed = processed.replace(
    /(?:https?:\/\/)?(?:www\.)?(twitter\.com|x\.com)\/(\w+)\/status\/(\d+)/g,
    (match, domain, username, tweetId) => {
      return `<blockquote class="twitter-tweet"><a href="https://twitter.com/${username}/status/${tweetId}"></a></blockquote>`;
    }
  );

  return processed;
}

/**
 * Sanitize HTML content (basic implementation)
 */
export function sanitizeContent(content: string): string {
  // Remove script tags
  let sanitized = content.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );

  // Remove on* event handlers
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");

  return sanitized;
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60)
    return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  if (diffMonths < 12)
    return `${diffMonths} month${diffMonths !== 1 ? "s" : ""} ago`;
  return `${diffYears} year${diffYears !== 1 ? "s" : ""} ago`;
}
