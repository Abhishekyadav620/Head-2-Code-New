/**
 * Frontend date utility functions for contribution heatmap
 */

/**
 * Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {number} Day of week (0-6)
 */
export const getDayOfWeek = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getDay();
};

/**
 * Get month name from date string
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {string} Month name (e.g., "Jan", "Feb")
 */
export const getMonthName = (dateString) => {
  const [year, month] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleString('en-US', { month: 'short' });
};

/**
 * Format date string for display (e.g., "Jan 15, 2024")
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {string} Formatted date string
 */
export const formatDateForDisplay = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

/**
 * Check if a date string represents the first day of a month
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {boolean} True if first day of month
 */
export const isFirstDayOfMonth = (dateString) => {
  const [, , day] = dateString.split('-').map(Number);
  return day === 1;
};

/**
 * Get the maximum submission count from heatmap data
 * Used for calculating color intensity
 * @param {Array} heatmapData - Array of {date, count} objects
 * @returns {number} Maximum count
 */
export const getMaxCount = (heatmapData) => {
  if (!heatmapData || heatmapData.length === 0) return 0;
  return Math.max(...heatmapData.map(item => item.count || 0));
};

/**
 * Get color intensity level based on count and max count
 * Returns 0-4 where 0 = no submissions, 4 = max intensity
 * @param {number} count - Submission count for the day
 * @param {number} maxCount - Maximum count in the dataset
 * @returns {number} Intensity level (0-4)
 */
export const getIntensityLevel = (count, maxCount) => {
  if (count === 0) return 0;
  if (maxCount === 0) return 0;
  
  // Calculate intensity based on percentage of max
  const percentage = count / maxCount;
  
  if (percentage >= 0.8) return 4;
  if (percentage >= 0.6) return 3;
  if (percentage >= 0.4) return 2;
  if (percentage >= 0.2) return 1;
  return 1; // Minimum intensity for any submission
};

