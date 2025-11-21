/**
 * Merges a date string and a time string into a datetime string
 * @param date - Date string (YYYY-MM-DD) or datetime string (YYYY-MM-DD HH:mm:ss)
 * @param time - Time string (HH:mm:ss) or undefined/empty
 * @returns Combined datetime string in format "YYYY-MM-DD HH:mm:ss" or empty string
 */
export function mergeDateTimeStrings(
  date: string | undefined,
  time?: string | undefined
): string {
  // Return empty string if date is undefined or empty
  if (!date || date.trim() === '') {
    return '';
  }

  // Extract just the date part if datetime was passed
  const datePart = date.split(' ')[0];

  // If time is undefined, empty, or whitespace, return just the date
  if (!time || time.trim() === '') {
    return datePart;
  }

  // Merge date and time
  return `${datePart} ${time.trim()}`;
}

// Example usage:
// mergeDateTimeStrings('2025-11-25', '22:05:04') // '2025-11-25 22:05:04'
// mergeDateTimeStrings('2025-11-25 10:30:00', '22:05:04') // '2025-11-25 22:05:04'
// mergeDateTimeStrings('2025-11-25', undefined) // '2025-11-25'
// mergeDateTimeStrings('2025-11-25', '') // '2025-11-25'
// mergeDateTimeStrings(undefined, '22:05:04') // ''
// mergeDateTimeStrings('', '22:05:04') // ''