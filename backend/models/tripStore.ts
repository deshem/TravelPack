import { Trip, TripInput } from "../types";

const trips = new Map<string, Trip>();

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

export const tripStore = {
  listByUser(telegramUserId: string): Trip[] {
    return Array.from(trips.values()).filter(
      (trip) => trip.ownerTelegramId === telegramUserId || trip.members.includes(telegramUserId)
    );
  },
  create(telegramUserId: string, input: TripInput): Trip {
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
    return trips.get(tripId) ?? null;
  },
  save(trip: Trip): Trip {
    trips.set(trip.id, trip);
    return trip;
  }
};
