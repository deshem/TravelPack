import type { VercelRequest, VercelResponse } from "@vercel/node";

type TripMap = Map<
  string,
  { id: string; items: Array<{ id: string; name: string; category: string; packed: boolean }> }
>;

function getTripsMap(): TripMap {
  const g = globalThis as typeof globalThis & { __packmateTrips?: TripMap };
  if (!g.__packmateTrips) {
    g.__packmateTrips = new Map();
  }
  return g.__packmateTrips;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const tripId = String(req.query.tripId ?? "");
  const itemId = String(req.query.itemId ?? "");
  const trip = getTripsMap().get(tripId);
  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  const item = trip.items.find((it) => it.id === itemId);
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  item.packed = Boolean(req.body?.packed);
  getTripsMap().set(tripId, trip);
  return res.status(200).json(trip);
}
