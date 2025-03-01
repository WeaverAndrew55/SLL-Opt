// sanity/lib/helpers.ts
// Sanity studio helper functions
import { Rule } from 'sanity';

/**
 * Helper function to create validation that requires exactly one of several fields
 */
export function requireExactlyOne(fields: string[]) {
  return (rule: Rule) =>
    rule.custom((value, context) => {
      const doc = context.document;
      const filledFields = fields.filter(field => doc[field]);
      
      if (filledFields.length !== 1) {
        return `Please fill exactly one of: ${fields.join(', ')}`;
      }
      
      return true;
    });
}

/**
 * Creates a validation rule that requires a field if another field exists
 */
export function requiredIfField(field: string, message = `Required because ${field} is set`) {
  return (rule: Rule) =>
    rule.custom((value, context) => {
      // If the dependent field has a value but this field doesn't
      if (context.document[field] && !value) {
        return message;
      }
      return true;
    });
}

/**
 * Formats a string for use in preview titles (truncates, capitalizes, etc.)
 */
export function formatPreviewTitle(str: string, maxLength = 50) {
  if (!str) return 'Untitled';
  
  // Truncate if too long
  const truncated = str.length > maxLength
    ? str.substring(0, maxLength) + '...'
    : str;
    
  return truncated;
}
