export interface JoinRequest {
  id: string;
  tripCode: string;
  tripId: number;
  tripTitle: string;
  tripLocation: string;
  tripDateRange: string;
  tripParticipants: Array<{ id: number; name: string; avatar: string }>;
  status: 'pending' | 'accepted' | 'rejected';
  requestedAt: string;
}

export type TripFilter = 'total' | 'upcoming' | 'completed' | 'active' | 'requests';

// Maps join codes to trip metadata for resolving join links
export const JOIN_CODE_MAP: Record<string, {
  tripId: number;
  title: string;
  location: string;
  dateRange: string;
  participants: Array<{ id: number; name: string; avatar: string }>;
}> = {
  'chravelgmbsme99': {
    tripId: 101,
    title: 'Miami Art Basel 2026',
    location: 'Miami, FL',
    dateRange: 'Dec 1 - Dec 5, 2026',
    participants: [
      { id: 40, name: 'Sofia', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face' },
      { id: 41, name: 'Marcus', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' },
      { id: 42, name: 'Ava', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face' },
    ],
  },
  'chravelbeach2026': {
    tripId: 102,
    title: 'Tulum Beach Retreat',
    location: 'Tulum, Mexico',
    dateRange: 'Jun 10 - Jun 17, 2026',
    participants: [
      { id: 43, name: 'Diego', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face' },
      { id: 44, name: 'Priya', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face' },
    ],
  },
  'chravelski2026': {
    tripId: 103,
    title: 'Whistler Ski Trip',
    location: 'Whistler, BC',
    dateRange: 'Jan 15 - Jan 20, 2026',
    participants: [
      { id: 45, name: 'Jake', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' },
      { id: 46, name: 'Emma', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' },
      { id: 47, name: 'Liam', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=40&h=40&fit=crop&crop=face' },
    ],
  },
};
