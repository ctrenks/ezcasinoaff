/**
 * Check if a user has admin privileges
 * Admin roles: 0, 1, or 5
 */
export function isAdmin(role: number | undefined | null): boolean {
  if (!role && role !== 0) return false;
  return role === 0 || role === 1 || role === 5;
}

/**
 * Check if a user is a forum moderator or admin
 */
export function isModerator(role: number | undefined | null): boolean {
  return isAdmin(role);
}
