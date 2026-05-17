import type { VercelRequest, VercelResponse } from "@vercel/node";
import { generatePackingItems, weatherHint } from "../../lib/packing";

type TripMap = Map<string, { id: string; destination: string; items: Array<{ id: string; name: string; category: string; packed: boolean }> }>;

function getTripsMap(): TripMap {
  const g = globalThis as typeof globalThis & { __packmateTrips?: TripMap };
  if (!g.__packmateTrips) {
    g.__packmateTrips = new Map();
  }
  return g.__packmateTrips;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const tripId = String(req.query.tripId ?? "");
  const trip = getTripsMap().get(tripId);
  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  const aiItems = await generatePackingItems(trip);
  const recommendation = weatherHint(trip.destination);
  if (!aiItems.some((item) => item.name.includes("курт"))) {
    aiItems.push({
      id: Math.random().toString(36).slice(2, 10),
      name: recommendation,
      category: "other",
      packed: false
    });
  }

  trip.items = aiItems;
  getTripsMap().set(tripId, trip);
  return res.status(200).json(trip);
}
