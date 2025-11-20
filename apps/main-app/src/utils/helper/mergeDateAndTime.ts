/**
 * Merges a date string and optional time string into a Date object
 * @param dateString - Date string in format YYYY-MM-DD
 * @param timeString - Optional time string in format HH:MM:SS or HH:MM
 * @returns Date object with merged date and time, or null if date is invalid
 */
export function mergeDateAndTime(
  dateString: string | null | undefined,
  timeString?: string | null | undefined
): Date | null {
  // Validate date string exists
  if (!dateString || dateString.trim() === '') {
    return null;
  }

  // Parse and validate the date
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return null;
  }

  // Create base date at midnight
  const baseDate = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(baseDate.getTime())) {
    return null;
  }

  // If no time string or invalid, return date at midnight
  if (!timeString || timeString.trim() === '') {
    return baseDate;
  }

  // Parse time string (supports HH:MM:SS or HH:MM)
  const timeRegex = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;
  const timeMatch = timeString.match(timeRegex);

  if (!timeMatch) {
    // Invalid time format, return date at midnight
    return baseDate;
  }

  const hours = parseInt(timeMatch[1], 10);
  const minutes = parseInt(timeMatch[2], 10);
  const seconds = timeMatch[3] ? parseInt(timeMatch[3], 10) : 0;

  // Validate time values
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
    // Invalid time values, return date at midnight
    return baseDate;
  }

  // Set the time on the date
  baseDate.setHours(hours, minutes, seconds, 0);

  return baseDate;
}

// Example usage with your data structure:
interface GameData {
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
}

export function parseGameDates(game: GameData) {
  return {
    startDate: mergeDateAndTime(game.start_date, game.start_time),
    endDate: mergeDateAndTime(game.end_date, game.end_time),
  };
}

// Usage examples:
// const startDate = mergeDateAndTime("2025-11-20", "03:00:00");
// const endDate = mergeDateAndTime("2025-11-30", "06:00:00");
// const dateOnly = mergeDateAndTime("2025-11-20", null); // Returns midnight
// const invalidTime = mergeDateAndTime("2025-11-20", "invalid"); // Returns midnight
// const shortTime = mergeDateAndTime("2025-11-20", "15:30"); // Also supported