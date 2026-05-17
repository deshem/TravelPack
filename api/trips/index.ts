import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const telegramUserId = String(req.query.telegramUserId ?? "");
    if (!telegramUserId) {
      return res.status(400).json({ message: "telegramUserId is required" });
    }
    return res.status(200).json([]);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
