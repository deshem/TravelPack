import type { VercelRequest, VercelResponse } from "@vercel/node";
import { updateItemStatus } from "../../../../backend/controllers/tripController";
import { adaptReq, adaptRes } from "../../../../backend/vercelShim";

export default function handler(vercelReq: VercelRequest, vercelRes: VercelResponse) {
  if (vercelReq.method !== "PATCH") {
    return vercelRes.status(405).json({ message: "Method not allowed" });
  }

  const tripId = String(vercelReq.query.tripId ?? "");
  const itemId = String(vercelReq.query.itemId ?? "");
  const req = adaptReq(vercelReq, { tripId, itemId });
  const res = adaptRes(vercelRes);
  return updateItemStatus(req, res);
}
