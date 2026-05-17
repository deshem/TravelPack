import type { VercelRequest, VercelResponse } from "@vercel/node";
import { tripStore } from "../../../lib/tripStore";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const tripId = String(req.query.tripId ?? "");
  const itemId = String(req.query.itemId ?? "");
  const trip = tripStore.getById(tripId);
  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  const item = trip.items.find((it) => it.id === itemId);
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  item.packed = Boolean(req.body?.packed);
  tripStore.save(trip);
  return res.status(200).json(trip);
}
