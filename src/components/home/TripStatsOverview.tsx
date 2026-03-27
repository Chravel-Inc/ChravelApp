
import React from 'react';
import { TripFilter } from '../../types/joinRequests';

interface TripStatsOverviewProps {
  totalTrips: number;
  upcomingCount: number;
  completedCount: number;
  activeCount: number;
  requestsCount: number;
  activeFilter: TripFilter;
  onFilterChange: (filter: TripFilter) => void;
}

const filters: { key: TripFilter; label: string; color: string }[] = [
  { key: 'total', label: 'Total', color: 'text-white' },
  { key: 'upcoming', label: 'Upcoming', color: 'text-yellow-500' },
  { key: 'completed', label: 'Completed', color: 'text-green-500' },
  { key: 'active', label: 'Active', color: 'text-blue-500' },
  { key: 'requests', label: 'Requests', color: 'text-yellow-500' },
];

export const TripStatsOverview = ({
  totalTrips,
  upcomingCount,
  completedCount,
  activeCount,
  requestsCount,
  activeFilter,
  onFilterChange,
}: TripStatsOverviewProps) => {
  const counts: Record<TripFilter, number> = {
    total: totalTrips,
    upcoming: upcomingCount,
    completed: completedCount,
    active: activeCount,
    requests: requestsCount,
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl p-3 mb-8">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {filters.map(({ key, label, color }) => {
          const isActive = activeFilter === key;
          return (
            <button
              key={key}
              onClick={() => onFilterChange(key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                isActive
                  ? 'bg-yellow-500/15 border border-yellow-500/30 text-yellow-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={isActive ? 'text-yellow-400 font-bold' : `${color} font-bold`}>
                {counts[key]}
              </span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
