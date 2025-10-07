/**
 * Calculates a person's age in years based on a given date string.
 * @param dateString - The date of birth in ISO format (e.g. "1991-01-01")
 * @returns The age as a string (e.g. "2 years", "1 year") or an empty string if invalid
 */
export function evaluateAge(dateString?: string): string {
  if (!dateString) return "";

  const birthDate = new Date(dateString);
  if (isNaN(birthDate.getTime())) return ""; // invalid date

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Adjust if birthday hasn’t occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 0) return ""; // future date case

  // Return formatted string
  return age === 1 ? "1 year" : `${age} years`;
}
