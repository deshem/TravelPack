interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  peopleCount: number;
  tripType: string;
  ownerTelegramId: string;
  members: string[];
  items: Array<{ id: string; name: string; category: string; packed: boolean }>;
  createdAt: string;
}

interface TripInput {
  destination: string;
  startDate: string;
  endDate: string;
  peopleCount: number;
  tripType: string;
}

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

export function listByUser(telegramUserId: string): Trip[] {
  const trips = tripsMap();
  return Array.from(trips.values()).filter(
    (trip) => trip.ownerTelegramId === telegramUserId || trip.members.includes(telegramUserId)
  );
}

export function create(telegramUserId: string, input: TripInput): Trip {
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
}

export function getById(tripId: string): Trip | null {
  return tripsMap().get(tripId) ?? null;
}

export function save(trip: Trip): Trip {
  tripsMap().set(trip.id, trip);
  return trip;
}
