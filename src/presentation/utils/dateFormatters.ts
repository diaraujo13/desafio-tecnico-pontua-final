/**
 * Date Formatting Utilities
 *
 * Presentation-layer utilities for formatting dates in pt-BR locale.
 * These are presentation-only - backend still uses ISO strings.
 *
 * All formatting is done client-side and does not affect data storage or API communication.
 */

/**
 * Formats a Date to pt-BR format (dd/MM/yyyy)
 * Example: new Date('2024-01-15') -> "15/01/2024"
 *
 * @param date - The date to format
 * @returns Formatted date string in dd/MM/yyyy format
 */
export function formatDateToPTBR(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Formats a Date with time to pt-BR format (dd/MM/yyyy HH:mm)
 * Example: new Date('2024-01-15T14:30:00') -> "15/01/2024 14:30"
 *
 * @param date - The date to format
 * @returns Formatted date and time string in dd/MM/yyyy HH:mm format
 */
export function formatDateTimeToPTBR(date: Date): string {
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
