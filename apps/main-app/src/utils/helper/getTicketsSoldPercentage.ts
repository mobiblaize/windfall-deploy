export function getTicketsSoldPercentage(
  available: number,
  total: number
): number {
  if (available === undefined || total === undefined) return 0;
  if (total <= 0) return 0; // avoid division by zero
  const sold = total - available;
  const percentage = (sold / total) * 100;
  return parseFloat(Math.min(Math.max(percentage, 0), 100).toFixed(1)); // clamp between 0 and 100 and format to 1 decimal place
}
