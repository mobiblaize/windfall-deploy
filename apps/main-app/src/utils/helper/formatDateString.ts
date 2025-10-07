import { format } from "date-fns";

/**
 * Safely formats a date string using date-fns.
 * @param dateString - The date to format (e.g. "2025-10-06T12:34:56Z")
 * @param dateFormat - Optional format pattern (default: "MMMM d, yyyy")
 * @returns Formatted date string (e.g. "October 6, 2025") or empty string if invalid
 */
export function formatDateString(
  dateString?: string,
  dateFormat: string = "MMMM d, yyyy"
): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return ""; // invalid date

  try {
    return format(date, dateFormat);
  } catch (error) {
    console.error("Date formatting failed:", error);
    return "";
  }
}
