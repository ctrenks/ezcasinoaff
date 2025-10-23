/**
 * Check if a user has admin privileges
 * Admin role: 5 (Super Admin on both sites)
 */
export function isAdmin(role: number | undefined | null): boolean {
  if (role === null || role === undefined) return false;
  return role === 5;
}

/**
 * Check if a user is a forum moderator or admin
 */
export function isModerator(role: number | undefined | null): boolean {
  return isAdmin(role);
}
