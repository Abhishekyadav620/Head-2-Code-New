/**
 * Date utility functions for contribution heatmap
 * All dates are handled in server timezone for consistency
 */

/**
 * Get current date in YYYY-MM-DD format (server timezone)
 * @returns {string} Date string in YYYY-MM-DD format
 */
const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get date string in YYYY-MM-DD format for a given date
 * @param {Date} date - Date object
 * @returns {string} Date string in YYYY-MM-DD format
 */
const getDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Generate array of date strings for last N days
 * @param {number} days - Number of days to generate (default: 365)
 * @returns {string[]} Array of date strings in YYYY-MM-DD format
 */
const getLastNDays = (days = 365) => {
  const dates = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(getDateString(date));
  }
  
  return dates;
};

/**
 * Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {number} Day of week (0-6)
 */
const getDayOfWeek = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getDay();
};

/**
 * Get month name from date string
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {string} Month name (e.g., "Jan", "Feb")
 */
const getMonthName = (dateString) => {
  const [year, month] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleString('en-US', { month: 'short' });
};

/**
 * Format date string for display (e.g., "Jan 15, 2024")
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {string} Formatted date string
 */
const formatDateForDisplay = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

module.exports = {
  getTodayDateString,
  getDateString,
  getLastNDays,
  getDayOfWeek,
  getMonthName,
  formatDateForDisplay
};

