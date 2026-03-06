const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Daily Submission Schema
 * Tracks per-user, per-day submission counts for contribution heatmap
 * Date stored in YYYY-MM-DD format for consistency
 */
const dailySubmissionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    index: true
  },
  date: {
    type: String, // YYYY-MM-DD format
    required: true,
    validate: {
      validator: function(v) {
        // Validate YYYY-MM-DD format
        return /^\d{4}-\d{2}-\d{2}$/.test(v);
      },
      message: 'Date must be in YYYY-MM-DD format'
    }
  },
  count: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  }
}, {
  timestamps: true
});

// Compound index to ensure one document per user per day
// Also enables efficient queries for heatmap data
dailySubmissionSchema.index({ userId: 1, date: 1 }, { unique: true });

// Index for date range queries
dailySubmissionSchema.index({ userId: 1, date: -1 });

const DailySubmission = mongoose.model('dailySubmission', dailySubmissionSchema);

module.exports = DailySubmission;

