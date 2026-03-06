import { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import { 
  getDayOfWeek, 
  getMonthName, 
  formatDateForDisplay, 
  isFirstDayOfMonth,
  getMaxCount,
  getIntensityLevel 
} from '../utils/dateUtils';

/**
 * GitHub-style Contribution Heatmap Component
 * Displays a 7x52 grid showing submission activity over the last 365 days
 */
const ContributionHeatmap = ({ userId = null }) => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [totalSubmissions, setTotalSubmissions] = useState(0);

  // Color intensity mapping (similar to GitHub's contribution graph)
  const colorClasses = [
    'bg-slate-100 dark:bg-slate-800',           // 0 submissions
    'bg-emerald-200 dark:bg-emerald-900',        // 1 submission (light green)
    'bg-emerald-400 dark:bg-emerald-700',        // 2-3 submissions
    'bg-emerald-500 dark:bg-emerald-600',        // 4-5 submissions
    'bg-emerald-600 dark:bg-emerald-500',        // 6+ submissions (darkest green)
  ];

  useEffect(() => {
    fetchHeatmapData();
  }, [userId]);

  const fetchHeatmapData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const endpoint = userId 
        ? `/contribution-heatmap/user/${userId}`
        : '/contribution-heatmap';
      
      const response = await axiosClient.get(endpoint);
      
      if (response.data.success) {
        setHeatmapData(response.data.data);
        setTotalSubmissions(response.data.totalSubmissions || 0);
      } else {
        setError('Failed to load heatmap data');
      }
    } catch (err) {
      console.error('Error fetching heatmap data:', err);
      setError(err.response?.data?.message || 'Failed to load contribution data');
    } finally {
      setLoading(false);
    }
  };

  // Organize data into weeks (7 days per week, 52 weeks)
  // GitHub-style: weeks start on Sunday
  const organizeIntoWeeks = () => {
    if (!heatmapData || heatmapData.length === 0) return [];

    const weeks = [];
    let currentWeek = [];
    
    // Find the first day
    const firstDate = heatmapData[0]?.date;
    if (!firstDate) return [];

    const firstDayOfWeek = getDayOfWeek(firstDate);
    
    // Add empty cells for days before the first date (to align with Sunday)
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }

    // Process all 365 days
    heatmapData.forEach((dayData) => {
      const dayOfWeek = getDayOfWeek(dayData.date);
      
      currentWeek.push(dayData);
      
      // If we've filled a week (7 days), start a new one
      if (currentWeek.length === 7) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });

    // Add the last week if it's not complete (fill with nulls)
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    return weeks;
  };

  const weeks = organizeIntoWeeks();
  const maxCount = getMaxCount(heatmapData);

  // Get month labels for the top of the heatmap
  const getMonthLabels = () => {
    const labels = [];
    let lastMonth = '';
    
    weeks.forEach((week, weekIndex) => {
      // Check the first day of the week that has data
      const firstDayWithData = week.find(day => day !== null);
      if (firstDayWithData) {
        const month = getMonthName(firstDayWithData.date);
        // Only add label if it's the first occurrence of this month
        // or if it's the first day of the month
        if (month !== lastMonth || isFirstDayOfMonth(firstDayWithData.date)) {
          // Calculate position based on the actual week position
          // Account for gaps between weeks in the flex layout
          const totalWeeks = weeks.length;
          // Calculate the position considering that there are gaps between items
          // The position should be weekIndex * (width of one week + gap)
          // Since we're using flexbox with gap-1, the gap is 0.25rem (4px)
          const positionPercentage = (weekIndex / Math.max(totalWeeks - 1, 1)) * 100;
          labels.push({ weekIndex, month, position: positionPercentage });
          lastMonth = month;
        }
      }
    });
    
    return labels;
  };

  const monthLabels = getMonthLabels();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        <span className="ml-3 text-slate-600 dark:text-slate-400">Loading contribution data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg">
        <p className="text-rose-600 dark:text-rose-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
          Contribution Activity
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {totalSubmissions} submissions in the last year
        </p>
      </div>

      {/* Month Labels */}
      <div className="relative mb-2 h-4">
        {monthLabels.map((label, idx) => (
          <span
            key={idx}
            className="absolute text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap"
            style={{ left: `calc(${label.position}% + 32px)` }}
          >
            {label.month}
          </span>
        ))}
      </div>

      {/* Heatmap Grid */}
      <div className="flex gap-1">
        {/* Day Labels (Sun-Sat) */}
        <div className="flex flex-col gap-1 mr-2">
          <div className="h-3"></div> {/* Spacer for month labels */}
          {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((day, idx) => (
            <div
              key={idx}
              className="h-3 text-xs text-slate-500 dark:text-slate-500 flex items-center"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Weeks Grid */}
        <div className="flex-1 flex gap-1 overflow-x-auto">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((dayData, dayIndex) => {
                if (dayData === null) {
                  return (
                    <div
                      key={dayIndex}
                      className="w-3 h-3 rounded-sm"
                    />
                  );
                }

                const intensity = getIntensityLevel(dayData.count, maxCount);
                const colorClass = colorClasses[intensity];
                const isHovered = hoveredCell?.date === dayData.date;

                return (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-3 h-3 rounded-sm ${colorClass} transition-all duration-150 cursor-pointer ${
                      isHovered ? 'ring-2 ring-slate-400 dark:ring-slate-500 scale-110' : ''
                    }`}
                    onMouseEnter={(e) => {
                      setHoveredCell(dayData);
                      setTooltipPosition({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseMove={(e) => {
                      setTooltipPosition({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseLeave={() => {
                      setHoveredCell(null);
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
        <span>Less</span>
        <div className="flex gap-1">
          {colorClasses.map((colorClass, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-sm ${colorClass}`}
            />
          ))}
        </div>
        <span>More</span>
      </div>

      {/* Tooltip - positioned at mouse cursor */}
      {hoveredCell && (
        <div 
          className="fixed z-50 p-3 bg-slate-900 dark:bg-slate-800 text-white text-sm rounded-lg shadow-xl pointer-events-none border border-slate-700"
          style={{
            top: `${tooltipPosition.y + 10}px`,
            left: `${tooltipPosition.x - 100}px`,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="font-semibold">{hoveredCell.formattedDate || formatDateForDisplay(hoveredCell.date)}</div>
          <div className="text-slate-300">
            {hoveredCell.count} submission{hoveredCell.count !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContributionHeatmap;

