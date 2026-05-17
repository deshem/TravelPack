import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createTrip, listTrips } from "../../backend/controllers/tripController";
import { adaptReq, adaptRes } from "../../backend/vercelShim";

export default function handler(vercelReq: VercelRequest, vercelRes: VercelResponse) {
  const req = adaptReq(vercelReq);
  const res = adaptRes(vercelRes);

  if (vercelReq.method === "GET") {
    return listTrips(req, res);
  }
  if (vercelReq.method === "POST") {
    return createTrip(req, res);
  }
  return res.status(405).json({ message: "Method not allowed" });
}
