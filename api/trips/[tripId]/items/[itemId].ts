import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getById, save } from "../../../lib/globalTripStore";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const tripId = String(req.query.tripId ?? "");
  const itemId = String(req.query.itemId ?? "");
  const trip = getById(tripId);
  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  const item = trip.items.find((it) => it.id === itemId);
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  item.packed = Boolean(req.body?.packed);
  save(trip);
  return res.status(200).json(trip);
}
