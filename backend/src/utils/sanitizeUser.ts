import { Document } from 'mongoose';

/**
 * Utility to sanitize user data by removing sensitive fields.
 * @param user - The user object (plain object or Mongoose document).
 * @param fieldsToExclude - Array of sensitive fields to exclude.
 * @returns Sanitized user object.
 */
export const sanitizeUser = <T extends Record<string, unknown>>(
  user: T | (T & Document), // Accept plain object or Mongoose document
  fieldsToExclude: (keyof T)[] = []
): Partial<T> => {
  // If user is a Mongoose document, convert it to a plain object
  const userObject = (user as Document).toObject ? (user as Document).toObject() : { ...user };

  // Remove each field from the object
  fieldsToExclude.forEach((field) => delete userObject[field]);

  return userObject;
};
