import type { Trip, TripInput } from "./types";

type TripMap = Map<string, Trip>;

const globalStore = globalThis as typeof globalThis & { __packmateTrips?: TripMap };

function tripsMap(): TripMap {
  if (!globalStore.__packmateTrips) {
    globalStore.__packmateTrips = new Map();
  }
  return globalStore.__packmateTrips;
}

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

export const tripStore = {
  listByUser(telegramUserId: string): Trip[] {
    const trips = tripsMap();
    return Array.from(trips.values()).filter(
      (trip) => trip.ownerTelegramId === telegramUserId || trip.members.includes(telegramUserId)
    );
  },
  create(telegramUserId: string, input: TripInput): Trip {
    const trips = tripsMap();
    const id = randomId();
    const trip: Trip = {
      ...input,
      id,
      ownerTelegramId: telegramUserId,
      members: [telegramUserId],
      items: [],
      createdAt: new Date().toISOString()
    };
    trips.set(id, trip);
    return trip;
  },
  getById(tripId: string): Trip | null {
    return tripsMap().get(tripId) ?? null;
  },
  save(trip: Trip): Trip {
    tripsMap().set(trip.id, trip);
    return trip;
  }
};
