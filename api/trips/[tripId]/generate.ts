import type { VercelRequest, VercelResponse } from "@vercel/node";
import { generatePackingItems, weatherHint } from "../../lib/packing";
import { getById, save } from "../../lib/globalTripStore";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const tripId = String(req.query.tripId ?? "");
  const trip = getById(tripId);
  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  const aiItems = await generatePackingItems(trip);
  const recommendation = weatherHint(trip.destination);
  const hasWeatherItem = aiItems.some((item) => item.name.includes("курт"));
  if (!hasWeatherItem) {
    aiItems.push({
      id: Math.random().toString(36).slice(2, 10),
      name: recommendation,
      category: "other",
      packed: false
    });
  }

  trip.items = aiItems;
  save(trip);
  return res.status(200).json(trip);
}
