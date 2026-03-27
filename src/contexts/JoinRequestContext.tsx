import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { JoinRequest, JOIN_CODE_MAP } from '../types/joinRequests';

interface JoinRequestContextType {
  joinRequests: JoinRequest[];
  addJoinRequest: (code: string) => JoinRequest | null;
  pendingCount: number;
}

const JoinRequestContext = createContext<JoinRequestContextType | undefined>(undefined);

const STORAGE_KEY = 'chravel_join_requests';

function loadFromStorage(): JoinRequest[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export const JoinRequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>(loadFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(joinRequests));
  }, [joinRequests]);

  const addJoinRequest = useCallback((code: string): JoinRequest | null => {
    const tripData = JOIN_CODE_MAP[code];
    if (!tripData) return null;

    // Check for duplicate
    const existing = joinRequests.find(r => r.tripCode === code);
    if (existing) return existing;

    const newRequest: JoinRequest = {
      id: crypto.randomUUID(),
      tripCode: code,
      tripId: tripData.tripId,
      tripTitle: tripData.title,
      tripLocation: tripData.location,
      tripDateRange: tripData.dateRange,
      tripParticipants: tripData.participants,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    };

    setJoinRequests(prev => [...prev, newRequest]);
    return newRequest;
  }, [joinRequests]);

  const pendingCount = joinRequests.filter(r => r.status === 'pending').length;

  return (
    <JoinRequestContext.Provider value={{ joinRequests, addJoinRequest, pendingCount }}>
      {children}
    </JoinRequestContext.Provider>
  );
};

export function useJoinRequests() {
  const context = useContext(JoinRequestContext);
  if (!context) {
    throw new Error('useJoinRequests must be used within a JoinRequestProvider');
  }
  return context;
}
