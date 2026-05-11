import { create } from "zustand";
import { Trip } from "../types";

interface AppState {
  telegramUserId: string | null;
  activeTripId: string | null;
  trips: Trip[];
  setTelegramUserId: (userId: string) => void;
  setTrips: (trips: Trip[]) => void;
  setActiveTripId: (tripId: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  telegramUserId: null,
  activeTripId: null,
  trips: [],
  setTelegramUserId: (userId) => set({ telegramUserId: userId }),
  setTrips: (trips) => set({ trips }),
  setActiveTripId: (tripId) => set({ activeTripId: tripId })
}));
