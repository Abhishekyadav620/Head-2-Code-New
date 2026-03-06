const DailySubmission = require("../models/dailySubmission");
const { getLastNDays, formatDateForDisplay } = require("../utils/dateUtils");

/**
 * Get contribution heatmap data for a user
 * Returns last 365 days of submission counts
 * Missing days are returned with count = 0
 */
const getContributionHeatmap = async (req, res) => {
  try {
    const userId = req.result._id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Get last 365 days of dates
    const last365Days = getLastNDays(365);

    // Fetch all daily submissions for this user within the date range
    const startDate = last365Days[0];
    const endDate = last365Days[last365Days.length - 1];

    const submissions = await DailySubmission.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).select('date count -_id');

    // Create a map of date -> count for quick lookup
    const submissionMap = new Map();
    submissions.forEach(sub => {
      submissionMap.set(sub.date, sub.count);
    });

    // Build response array with all 365 days
    // Missing days will have count = 0
    const heatmapData = last365Days.map(date => ({
      date,
      count: submissionMap.get(date) || 0,
      formattedDate: formatDateForDisplay(date)
    }));

    // Calculate total submissions for the period
    const totalSubmissions = submissions.reduce((sum, sub) => sum + sub.count, 0);

    res.status(200).json({
      success: true,
      data: heatmapData,
      totalSubmissions,
      period: {
        start: startDate,
        end: endDate,
        days: 365
      }
    });

  } catch (err) {
    console.error('Error fetching contribution heatmap:', err);
    res.status(500).json({ 
      message: "Internal Server Error",
      error: err.message 
    });
  }
};

/**
 * Get contribution heatmap data for a specific user (by userId)
 * Used for viewing other users' profiles
 */
const getContributionHeatmapByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Get last 365 days of dates
    const last365Days = getLastNDays(365);

    // Fetch all daily submissions for this user within the date range
    const startDate = last365Days[0];
    const endDate = last365Days[last365Days.length - 1];

    const submissions = await DailySubmission.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).select('date count -_id');

    // Create a map of date -> count for quick lookup
    const submissionMap = new Map();
    submissions.forEach(sub => {
      submissionMap.set(sub.date, sub.count);
    });

    // Build response array with all 365 days
    const heatmapData = last365Days.map(date => ({
      date,
      count: submissionMap.get(date) || 0,
      formattedDate: formatDateForDisplay(date)
    }));

    // Calculate total submissions for the period
    const totalSubmissions = submissions.reduce((sum, sub) => sum + sub.count, 0);

    res.status(200).json({
      success: true,
      data: heatmapData,
      totalSubmissions,
      period: {
        start: startDate,
        end: endDate,
        days: 365
      }
    });

  } catch (err) {
    console.error('Error fetching contribution heatmap by userId:', err);
    res.status(500).json({ 
      message: "Internal Server Error",
      error: err.message 
    });
  }
};

module.exports = {
  getContributionHeatmap,
  getContributionHeatmapByUserId
};

