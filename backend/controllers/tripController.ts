import { Request, Response } from "express";
import { tripStore } from "../models/tripStore";
import { generatePackingItems } from "../services/aiService";
import { getWeatherHint } from "../services/weatherService";
import { TripInput } from "../../src/types";

export function listTrips(req: Request, res: Response) {
  const telegramUserId = String(req.query.telegramUserId ?? "");
  if (!telegramUserId) {
    return res.status(400).json({ message: "telegramUserId is required" });
  }
  return res.json(tripStore.listByUser(telegramUserId));
}

export function createTrip(req: Request, res: Response) {
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

export async function generateTripList(req: Request, res: Response) {
  const trip = tripStore.getById(req.params.tripId);
  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  const weather = await getWeatherHint(trip.destination);
  const aiItems = await generatePackingItems(trip);
  const hasWeatherItem = aiItems.some((item) => item.name.includes("курт"));
  if (!hasWeatherItem) {
    aiItems.push({
      id: Math.random().toString(36).slice(2, 10),
      name: weather.recommendation,
      category: "other",
      packed: false
    });
  }

  trip.items = aiItems;
  tripStore.save(trip);
  return res.json(trip);
}

export function updateItemStatus(req: Request, res: Response) {
  const trip = tripStore.getById(req.params.tripId);
  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  const item = trip.items.find((it) => it.id === req.params.itemId);
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  item.packed = Boolean(req.body.packed);
  tripStore.save(trip);
  return res.json(trip);
}
