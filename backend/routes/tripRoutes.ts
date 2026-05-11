import { Router } from "express";
import { createTrip, generateTripList, listTrips, updateItemStatus } from "../controllers/tripController";

export const tripRoutes = Router();

tripRoutes.get("/", listTrips);
tripRoutes.post("/", createTrip);
tripRoutes.post("/:tripId/generate", generateTripList);
tripRoutes.patch("/:tripId/items/:itemId", updateItemStatus);
