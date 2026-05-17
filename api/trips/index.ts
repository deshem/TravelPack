import type { VercelRequest, VercelResponse } from "@vercel/node";
import { tripStore } from "../lib/globalTripStore";
import type { TripInput } from "../lib/types";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const telegramUserId = String(req.query.telegramUserId ?? "");
    if (!telegramUserId) {
      return res.status(400).json({ message: "telegramUserId is required" });
    }
    return res.status(200).json(tripStore.listByUser(telegramUserId));
  }

  if (req.method === "POST") {
    const { telegramUserId, destination, startDate, endDate, peopleCount, tripType } = req.body as {
      telegramUserId: string;
    } & TripInput;

    if (!telegramUserId || !destination || !startDate || !endDate || !tripType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const trip = tripStore.create(telegramUserId, {
      destination,
      startDate,
      endDate,
      peopleCount: Number(peopleCount) || 1,
      tripType
    });

    return res.status(201).json(trip);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
