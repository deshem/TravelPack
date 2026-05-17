import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { tripRoutes } from "./routes/tripRoutes";

dotenv.config();

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "PackMate API" });
  });

  app.use("/api/trips", tripRoutes);

  return app;
}
