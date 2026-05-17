import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { Request, Response } from "express";

export function adaptReq(vercelReq: VercelRequest, params: Record<string, string> = {}): Request {
  return {
    method: vercelReq.method,
    query: vercelReq.query,
    body: vercelReq.body,
    params
  } as Request;
}

export function adaptRes(vercelRes: VercelResponse): Response {
  const res = {
    statusCode: 200,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      vercelRes.status(this.statusCode).setHeader("Content-Type", "application/json");
      vercelRes.end(JSON.stringify(payload));
      return this;
    }
  };
  return res as Response;
}
