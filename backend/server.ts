import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { tripRoutes } from "./routes/tripRoutes";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "PackMate API" });
});

app.use("/api/trips", tripRoutes);

app.listen(PORT, () => {
  console.log(`PackMate backend started on http://localhost:${PORT}`);
});
