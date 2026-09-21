/**
 * Formats a given date string into a custom format.
 * Example: "Sep 9, 12:16 PM"
 *
 * @param {string|Date} dateString - The date to format
 * @returns {string} - The formatted date string
 */
export const formatTime = (dateString: string | Date) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return String(dateString);

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};
