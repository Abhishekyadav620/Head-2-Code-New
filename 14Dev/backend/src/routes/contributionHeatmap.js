const express = require('express');
const router = express.Router();
const userMiddleware = require("../middleware/userMiddleware");
const { getContributionHeatmap, getContributionHeatmapByUserId } = require("../controllers/contributionHeatmap");

// Get current user's contribution heatmap
router.get("/", userMiddleware, getContributionHeatmap);

// Get contribution heatmap for a specific user (for viewing profiles)
router.get("/user/:userId", userMiddleware, getContributionHeatmapByUserId);

module.exports = router;

