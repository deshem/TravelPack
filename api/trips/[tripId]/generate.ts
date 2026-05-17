import type { VercelRequest, VercelResponse } from "@vercel/node";
import { generateTripList } from "../../../backend/controllers/tripController";
import { adaptReq, adaptRes } from "../../../backend/vercelShim";

export default async function handler(vercelReq: VercelRequest, vercelRes: VercelResponse) {
  if (vercelReq.method !== "POST") {
    return vercelRes.status(405).json({ message: "Method not allowed" });
  }

  const tripId = String(vercelReq.query.tripId ?? "");
  const req = adaptReq(vercelReq, { tripId });
  const res = adaptRes(vercelRes);
  return generateTripList(req, res);
}
