/**
 * Utility to sanitize user data by removing sensitive fields.
 * @param user - The user object (plain object or Mongoose document).
 * @param fieldsToExclude - Array of sensitive fields to exclude.
 * @returns Sanitized user object.
 */
export const sanitizeUser = (
  user: Record<string, unknown>,
  fieldsToExclude: string[] = []
) => {
  const sanitizedUser = { ...user };

  // Remove each field from the object
  fieldsToExclude.forEach((field) => delete sanitizedUser[field]);

  return sanitizedUser;
};
