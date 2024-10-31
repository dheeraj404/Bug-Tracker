
import { parseISO, format } from 'date-fns';

/**
 * Safely parses a date string to a Date object.
 * @param {string} dateString - Date string in 'yyyy-MM-dd' format.
 * @returns {Date|null} - Parsed Date object or null if invalid.
 */
export const safeParseISO = (dateString) => {
  if (!dateString) return null;
  try {
    return parseISO(dateString);
  } catch (error) {
    console.error('Invalid date format:', dateString);
    return null;
  }
};

/**
 * Formats a Date object to a specified string format.
 * @param {Date|null} date - Date object.
 * @param {string} dateFormat - Desired format.
 * @returns {string} - Formatted date string or 'Invalid Date'.
 */
export const formatDisplayDate = (date, dateFormat = 'MM-dd-yyyy') => {
  if (!date) return 'Invalid Date';
  return format(date, dateFormat);
};
