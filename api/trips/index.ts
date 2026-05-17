import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { Trip, TripInput } from "../lib/types";

type TripMap = Map<string, Trip>;

function getTripsMap(): TripMap {
  const g = globalThis as typeof globalThis & { __packmateTrips?: TripMap };
  if (!g.__packmateTrips) {
    g.__packmateTrips = new Map();
  }
  return g.__packmateTrips;
}

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  const trips = getTripsMap();

  if (req.method === "GET") {
    const telegramUserId = String(req.query.telegramUserId ?? "");
    if (!telegramUserId) {
      return res.status(400).json({ message: "telegramUserId is required" });
    }
    const list = Array.from(trips.values()).filter(
      (trip) => trip.ownerTelegramId === telegramUserId || trip.members.includes(telegramUserId)
    );
    return res.status(200).json(list);
  }

  if (req.method === "POST") {
    const { telegramUserId, destination, startDate, endDate, peopleCount, tripType } = req.body as {
      telegramUserId: string;
    } & TripInput;

    if (!telegramUserId || !destination || !startDate || !endDate || !tripType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const id = randomId();
    const trip: Trip = {
      destination,
      startDate,
      endDate,
      peopleCount: Number(peopleCount) || 1,
      tripType,
      id,
      ownerTelegramId: telegramUserId,
      members: [telegramUserId],
      items: [],
      createdAt: new Date().toISOString()
    };
    trips.set(id, trip);
    return res.status(201).json(trip);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
