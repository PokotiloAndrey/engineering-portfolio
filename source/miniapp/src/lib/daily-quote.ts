export function quoteForDate(
  quotes: readonly string[],
  date: Date = new Date(),
): string {
  if (quotes.length === 0) {
    return "";
  }

  const epochDay = Math.floor(date.getTime() / 86_400_000);
  const index = ((epochDay % quotes.length) + quotes.length) % quotes.length;

  return quotes[index];
}