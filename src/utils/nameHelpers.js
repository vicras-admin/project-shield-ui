/**
 * Formats a staff member's name for display.
 * @param {Object} staff - Object with firstName, lastName, and optional middleInitial
 * @returns {string} Formatted full name
 */
export function displayName(staff) {
  if (!staff) return '';
  return [
    staff.firstName,
    staff.middleInitial ? staff.middleInitial + '.' : '',
    staff.lastName,
  ].filter(Boolean).join(' ');
}

/**
 * Returns initials from a staff member's name.
 * @param {Object} staff - Object with firstName and lastName
 * @returns {string} Initials (e.g., "JD")
 */
export function getInitials(staff) {
  if (!staff) return '';
  return ((staff.firstName?.[0] || '') + (staff.lastName?.[0] || '')).toUpperCase();
}
