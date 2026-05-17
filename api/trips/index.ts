import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { TripInput } from "../lib/types";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const telegramUserId = String(req.query.telegramUserId ?? "");
    if (!telegramUserId) {
      return res.status(400).json({ message: "telegramUserId is required" });
    }
    return res.status(200).json([]);
  }

  if (req.method === "POST") {
    const body = req.body as { telegramUserId: string } & TripInput;
    return res.status(201).json({ ok: true, destination: body?.destination });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
