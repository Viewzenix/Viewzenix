/**
 * caseConversion.ts
 *
 * Utility functions to convert object keys and strings
 * between camelCase and snake_case.
 */

/**
 * Convert a camelCase string to snake_case
 * @param str String to convert
 * @returns String in snake_case
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Convert a snake_case string to camelCase
 * @param str String to convert
 * @returns String in camelCase
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert object keys from snake_case to camelCase recursively
 * @param obj Object to convert
 * @returns New object with keys in camelCase
 */
export function objectToCamelCase<T>(obj: any): T {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(objectToCamelCase) as any;
  }

  const newObj: any = {};
  Object.keys(obj).forEach(key => {
    const camelKey = snakeToCamel(key);
    newObj[camelKey] = objectToCamelCase(obj[key]);
  });

  return newObj;
}

/**
 * Convert object keys from camelCase to snake_case recursively
 * @param obj Object to convert
 * @returns New object with keys in snake_case
 */
export function objectToSnakeCase<T>(obj: any): T {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(objectToSnakeCase) as any;
  }

  const newObj: any = {};
  Object.keys(obj).forEach(key => {
    const snakeKey = camelToSnake(key);
    newObj[snakeKey] = objectToSnakeCase(obj[key]);
  });

  return newObj;
} 